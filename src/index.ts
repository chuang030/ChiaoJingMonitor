import fs from 'node:fs';
import path from 'node:path';
import { env } from 'node:process';
import {
    Awaitable, Client, ClientEvents, Collection, ChatInputCommandInteraction,
    GatewayIntentBits, SlashCommandBuilder
} from 'discord.js';

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates,
    ],
    allowedMentions: { parse: ['users', 'roles'], repliedUser: true }
});

/* ---------------commands--------------- */

type commandType = { data: SlashCommandBuilder, execute: (Interaction: ChatInputCommandInteraction) => Promise<void> };

client.commands = new Collection();
const commandsPath = path.posix.join(__dirname.replace(/\\/g, "/"), 'commands');
const commandsFile = fs.readdirSync(commandsPath).filter(file => file.endsWith('js'));
for (const file of commandsFile) {
    const filePath = path.join(commandsPath, file);
    const command: commandType = require(filePath);

    if ('data' in command && 'execute' in command) {
        client.commands.set(command.data.name, command);
    } else {
        console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
    }
}

/* ---------------events--------------- */

type eventType = { name: keyof ClientEvents, once?: boolean, execute: (...args: any) => Awaitable<void> };

const eventsPath = path.posix.join(__dirname.replace(/\\/g, "/"), 'events');
const eventsFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('js'));
for (const file of eventsFiles) {
    const filePath = path.join(eventsPath, file);
    const event: eventType = require(filePath);

    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    } else {
        client.on(event.name, (...args) => event.execute(...args, client));
    }
}

client.login(env.BOT_TOKEN);
