export class Command {
    name = ""
    needsRefresh = false;

    /**
     * Configure slash command
     * @param {import("discord.js").SlashCommandBuilder} command
     * @param {() => ()} done
    */
    config(command, done) {
        done();
    }

    /**
     * Handle an interaction
     * @param {import("discord.js").CommandInteraction} interaction
     * @returns {Promise<void>}
     */
    async handle(interaction) {}

    /**
     * @param {import("sqlite3").Database} db
     */
    constructor(db) {
        /** @type {import("sqlite3").Database} */
        this.db = db;
    }
};
