import { Client, GatewayIntentBits, REST } from 'discord.js';
import { Commands } from './commands/index.js';
import sqlite3 from 'sqlite3';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { readFileSync } from 'fs';

const { Database } = sqlite3.verbose();
process.chdir(fileURLToPath(new URL("..", import.meta.url)));

dotenv.config();

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
const db = new Database("db/database.sqlite");

db.serialize(() => {
  db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='films';", (err, row) => {
    if (row?.name === 'films') return;

    const queries = readFileSync('db/schema.sql', 'utf8').split('\n');
    for (const query of queries) {
      if (query.length == 0) continue;
      db.run(query, (err) => {
        if (err) throw err;
      });
    }
  });
});

const commands = new Commands(db);
commands.refresh(rest);

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('interactionCreate', interaction => commands.handle(interaction));
client.login(process.env.TOKEN);

process.on('beforeExit', () => {
  db.close();
});
