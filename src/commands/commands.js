import AddCategory from "./addCategory.js";
import AddFilm from "./addFilm.js";
import { Command } from "./index.js";
import Ping from "./ping.js";
import { Routes, SlashCommandBuilder } from 'discord.js';
import Search from "./search.js";
import Catalogue from "./catalogue.js";
import { readFileSync, writeFileSync } from "fs";

export class Commands {
    /**
     * @param {import("sqlite3").Database} db
     */
    constructor(db) {
        /** @type {Command[]} Enabled command instances */
        this.instances = [new Ping(db), new AddFilm(db), new AddCategory(db), new Search(db), new Catalogue(db)];
    }

    /**
     * Refresh application (/) commands.
     * @param {import("discord.js").REST} rest
     * @returns {Promise<void>}
     */
    async refresh(rest = this.rest) {
        this.rest = rest
        try {
            const current = await Promise.all(this.instances.map(async command => {
                const cmd = new SlashCommandBuilder().setName(command.name);
                await new Promise(resolve => command.config(cmd, resolve));
                return cmd.toJSON();
            }));

            const currentJson = JSON.stringify(current, null, 4);
            const old = readFileSync("db/slash.json", "utf-8");
            if (old === currentJson) return;

            console.log('Started refreshing application (/) commands.');
            await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), {
                body: current,
            });
            writeFileSync("db/slash.json", currentJson, "utf-8");
            console.log('Successfully reloaded application (/) commands.');
        } catch (error) {
            console.error(error);
        }
    }

    /**
     * Handle an interaction
     * @param {import("discord.js").CommandInteraction} interaction
     * @returns {Promise<void>}
     */
    async handle(interaction) {
        if (!interaction.isChatInputCommand()) return;

        const command = this.instances.find(command => command.name == interaction.commandName);

        if (command) {
            await command.handle(interaction);
            if (command.needsRefresh) await this.refresh();
        }
    }
}
