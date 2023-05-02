import { Command } from "./command.js";
import { EmbedBuilder } from "discord.js";

export default class Catalogue extends Command {
    name = "catalogue"

    /**
     * Configure slash command
     * @param {import("discord.js").SlashCommandBuilder} command
     * @param {() => ()} done
    */
    config(command, done) {
        const categories = [];
        this.db.each("SELECT id, name FROM category", (_, category) => {
            categories.push({
                name: category.name,
                value: category.id.toString(),
            })
        }, () => {
            command.setDescription("Consulter le catalogue de films")
                .addStringOption(option =>
                    option.setName("category")
                        .setDescription("La catégorie à consulter")
                        .setRequired(false)
                        .addChoices(...categories));
            done();
        });
    }

    /**
     * Handle an interaction
     * @param {import("discord.js").CommandInteraction} interaction
     * @returns {Promise<void>}
     */
    async handle(interaction) {
        const categoryId = interaction.options.getString("category");
        const category = categoryId ? await new Promise((resolve) => this.db.get(
            "SELECT name FROM category WHERE id = ?", categoryId, (err, category) => resolve(category.name))) : null;

        const films = [];
        this.db.each(`SELECT name, link FROM film ${categoryId ? `WHERE categoryid = ${categoryId} ` : ""}LIMIT ?`,
        20, (_, film) => {
            films.push(film);
        }, async () => {
            await interaction.reply({
                embeds: [new EmbedBuilder()
                    .setTitle(`Catalogue${categoryId ? ` - ${category}` : ''}`)
                    .setColor("Red")
                    .setDescription(films.length !== 0 ? films.map((film) => `• [${film.name}](${film.link})`).join('\n') : "Il n'y a aucun film")
                ],
                ephemeral: true,
            });
        });
    }
}
