import { Client, GatewayIntentBits, REST } from 'discord.js';
import { Commands } from './commands/index.js';
import 'dotenv/config';

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const commands = new Commands();
commands.refresh(rest);

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('interactionCreate', interaction => commands.handle(interaction));
client.login(process.env.TOKEN);
