export class Command {
    /** @type {string} The name of the command */
    name = "";
    /** @type {string} Short description of what command does */
    description = "";

    /**
     * Handle an interaction
     * @param {import("discord.js").Interaction<import("discord.js").CacheType>} interaction
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
