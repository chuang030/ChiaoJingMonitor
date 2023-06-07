"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_fs_1 = __importDefault(require("node:fs"));
const node_path_1 = __importDefault(require("node:path"));
const node_process_1 = require("node:process");
const discord_js_1 = require("discord.js");
const client = new discord_js_1.Client({
    intents: [
        discord_js_1.GatewayIntentBits.Guilds,
        discord_js_1.GatewayIntentBits.GuildMessages,
        discord_js_1.GatewayIntentBits.MessageContent,
        discord_js_1.GatewayIntentBits.GuildVoiceStates,
    ],
    allowedMentions: { parse: ['users', 'roles'], repliedUser: true }
});
client.commands = new discord_js_1.Collection();
const commandsPath = node_path_1.default.posix.join(__dirname.replace(/\\/g, "/"), 'commands');
const commandsFile = node_fs_1.default.readdirSync(commandsPath).filter(file => file.endsWith('js'));
for (const file of commandsFile) {
    const filePath = node_path_1.default.join(commandsPath, file);
    const command = require(filePath);
    if ('data' in command && 'execute' in command) {
        client.commands.set(command.data.name, command);
    }
    else {
        console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
    }
}
const eventsPath = node_path_1.default.posix.join(__dirname.replace(/\\/g, "/"), 'events');
const eventsFiles = node_fs_1.default.readdirSync(eventsPath).filter(file => file.endsWith('js'));
for (const file of eventsFiles) {
    const filePath = node_path_1.default.join(eventsPath, file);
    const event = require(filePath);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    }
    else {
        client.on(event.name, (...args) => event.execute(...args, client));
    }
}
client.login(node_process_1.env.BOT_TOKEN);
