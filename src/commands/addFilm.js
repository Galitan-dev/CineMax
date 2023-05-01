import { ModalBuilder, TextInputBuilder, TextInputStyle } from "discord.js";
import { Command } from "./command.js";

export default class AddFilm extends Command {
    name = "addfilm";

    /**
     * Configure slash command
     * @param {import("discord.js").SlashCommandBuilder} command
     * @param {() => ()} done
    */
    config(command, done) {
        const categories = [];
        this.db.each("SELECT categoryid, name FROM category", (_, category) => {
            categories.push({
                name: category.name,
                value: category.categoryid.toString(),
            })
        }, () => {
            command.setDescription("Ajouter un film à la base de données")
                .addStringOption(option =>
                    option.setName("name")
                        .setDescription("Le nom du film")
                        .setRequired(true))
                .addStringOption(option =>
                    option.setName("category")
                        .setDescription("La catégorie du film")
                        .setRequired(true)
                        .addChoices(...categories))
                .addStringOption(option =>
                    option.setName("link")
                        .setDescription("Le lien du film")
                        .setRequired(true))
                .addAttachmentOption(option =>
                    option.setName("image")
                        .setDescription("L'affiche du film")
                        .setRequired(false));
            done();
        });
    }

    async handle(interaction) {
    }
}