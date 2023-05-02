import { Command } from "./command.js";
import { EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } from "discord.js";

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

    render(categoryId, offset = 0) {
        const filmPerPage = 10;

        return new Promise(async (resolve) => {
            const category = categoryId ? await new Promise((res) => this.db.get(
                "SELECT name FROM category WHERE id = ?", categoryId, (_, category) => res(category.name))) : null;

            const count = await new Promise((res) => this.db.get(
                `SELECT COUNT(*) AS count FROM film${categoryId ? ` WHERE categoryid = ${categoryId} ` : ""}`,
                (_, row) => res(row.count)));

            const films = [];
            this.db.each(`SELECT name, link FROM film ${categoryId ? `WHERE categoryid = ${categoryId} ` : ""}LIMIT ? OFFSET ?`,
            filmPerPage, offset, (_, film) => {
                films.push(film);
            }, async () => {
                resolve({
                    embeds: [new EmbedBuilder()
                        .setTitle(`Catalogue${categoryId ? ` - ${category}` : ''}`)
                        .setColor("Red")
                        .setDescription(films.length !== 0 ? films.map((film) => `• [${film.name}](${film.link})`).join('\n') : "Il n'y a aucun film")
                    ],
                    ephemeral: true,
                    components: [new ActionRowBuilder().addComponents(
                        new ButtonBuilder()
                            .setCustomId(`catalogue-paginate(${categoryId},${offset - filmPerPage})`)
                            .setDisabled(offset - filmPerPage < 0)
                            .setStyle(ButtonStyle.Primary)
                            .setEmoji({ name: "◀" }),
                        new ButtonBuilder()
                            .setCustomId(`catalogue-paginate(${categoryId},${offset + filmPerPage})`)
                            .setDisabled(offset + filmPerPage >= count)
                            .setStyle(ButtonStyle.Primary)
                            .setEmoji({ name: "▶" })
                    )]
                });
            });
        });
    }

    /**
     * Handle an interaction
     * @param {import("discord.js").CommandInteraction} interaction
     * @returns {Promise<void>}
     */
    async handle(interaction) {
        const categoryId = interaction.options.getString("category");

        await interaction.reply(await this.render(categoryId));
    }

    /**
     *
     * @param {import("discord.js").ButtonInteraction} interaction
     * @param {string} categoryId
     * @param {string} offset
     */
    async paginate(interaction, categoryId, offset) {
        offset = parseInt(offset);
        categoryId = isNaN(categoryId) ? null : parseInt(categoryId);
        await interaction.deferUpdate();
        await interaction.editReply(await this.render(categoryId, offset))
    }
}
