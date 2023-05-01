import { Command } from "./command.js";

export default class Ping extends Command {
    name = "ping"

    /**
     * Configure slash command
     * @param {import("discord.js").SlashCommandBuilder} command
     * @param {() => ()} done
    */
    config(command, done) {
        command.setDescription("Répond par Pong")
        done();
    }

    /**
     * Handle an interaction
     * @param {import("discord.js").CommandInteraction} interaction
     * @returns {Promise<void>}
     */
    async handle(interaction) {
        await interaction.reply('Pong!');
    }
}
