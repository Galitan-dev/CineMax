import { Command } from "./command.js";

export default class Search extends Command {
    name = "search"

    /**
     * Configure slash command
     * @param {import("discord.js").SlashCommandBuilder} command
     * @param {() => ()} done
    */
    config(command, done) {
        command.setDescription("Rechercher un film")
            .addStringOption(option =>
                option.setName('query')
                    .setDescription("Votre recherche")
                    .setRequired(true))
        done();
    }

    /**
     * Handle an interaction
     * @param {import("discord.js").CommandInteraction} interaction
     * @returns {Promise<void>}
     */
    async handle(interaction) {
        const query = interaction.options.getString("query");

        const films = [];
        this.db.each("SELECT name, link FROM film WHERE name LIKE ?", `%${query}%`, (_, film) => {
            films.push(film)
        }, async (err) => {
            if (err) {
                console.error(err);
                await interaction.reply({
                    content: "Une erreur s'est produite.",
                    ephemeral: true,
                });
            } else {
                console.log(films)
                await interaction.reply({
                    content: `Votre recherche a renvoyé ${films.length} résultat(s):\n`
                        + films.map(film => `**${film.name}:** ${film.link}`).join('\n'),
                    ephemeral: true
                });
            }
        });
    }
}
