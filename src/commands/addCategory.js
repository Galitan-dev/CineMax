import { Command } from "./command.js";

export default class AddCategory extends Command {
    name = "addcategory";
    needsRefresh = true;

    /**
     * Configure slash command
     * @param {import("discord.js").SlashCommandBuilder} command
     * @param {() => ()} done
    */
    config(command, done) {
        command.setName("addcategory")
            .setDescription("Ajouter une categorie à la base de données")
            .addStringOption(option =>
                option.setName("name")
                    .setDescription("Le nom de la catégorie")
                    .setRequired(true))
        done();
    }

    /**
     * @param {import("discord.js").CommandInteraction} interaction
     */
    async handle(interaction) {
        const name = interaction.options.getString("name");
        this.db.run("INSERT INTO category (name) VALUES (?)", name, async (err) => {
            if (err) {
                console.error(err);
                await interaction.reply({
                    body: "Une erreur s'est produite.",
                    ephemeral: true,
                });
            } else {
                await interaction.reply(`La categorie "${name}" a bien été ajoutée !`);
            }
        })
    }
}
