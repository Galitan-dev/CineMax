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

    async handle(interaction) {
        await interaction.reply('Pong!');
    }
}
