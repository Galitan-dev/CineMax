import AddCategory from "./addCategory.js";
import AddFilm from "./addFilm.js";
import { Command } from "./index.js";
import Ping from "./ping.js";
import { Routes, SlashCommandBuilder } from 'discord.js';
import Search from "./search.js";

export class Commands {
    /**
     * @param {import("sqlite3").Database} db
     */
    constructor(db) {
        /** @type {Command[]} Enabled command instances */
        this.instances = [new Ping(db), new AddFilm(db), new AddCategory(db), new Search(db)];
    }

    /**
     * Refresh application (/) commands.
     * @param {import("discord.js").REST} rest
     * @returns {Promise<void>}
     */
    async refresh(rest = this.rest) {
        this.rest = rest
        try {
            console.log('Started refreshing application (/) commands.');
            await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), {
                body: await Promise.all(this.instances.map(async command => {
                    const cmd = new SlashCommandBuilder().setName(command.name);
                    await new Promise(resolve => command.config(cmd, resolve));
                    return cmd.toJSON();
                })),
            });
            console.log('Successfully reloaded application (/) commands.');
        } catch (error) {
            console.error(error);
        }
    }

    /**
     * Handle an interaction
     * @param {import("discord.js").Interaction<import("discord.js").CacheType>} interaction
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
