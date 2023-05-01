import { Command } from "./index.js";
import Ping from "./ping.js";
import { Routes } from 'discord.js';

export class Commands {
    /** @type {Command[]} Enabled command instances */
    instances = [new Ping()];

    /**
     * Refresh application (/) commands.
     * @param {import("discord.js").REST} rest
     * @returns {Promise<void>}
     */
    async refresh(rest) {
        try {
            console.log('Started refreshing application (/) commands.');
            await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), {
                body: this.instances.map(command => ({
                    name: command.name,
                    description: command.description,
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

        if (command) return command.handle(interaction);
    }
}
