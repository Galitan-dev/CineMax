import { Command } from "./command.js";

export default class Ping extends Command {
    name = "ping";
    description = "Replies with Pong!!"

    async handle(interaction) {
        await interaction.reply('Pong!');
    }
}
