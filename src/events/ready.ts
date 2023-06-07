import { ActivityType, Client, Events } from 'discord.js';
import { activityOption } from '../config.json'
const { Playing, Streaming, Listening, Watching, Custom, Competing } = ActivityType;

module.exports = {
    name: Events.ClientReady,
    once: true,
    execute(client: Client) {
        let status: any;
        switch (activityOption.status) {
            case 'online':
                status = 'online';
                break;
            case 'idle':
                status = 'idle';
                break;
            case 'dnd':
                status = 'dnd';
                break;
            case 'invisible':
                status = 'invisible';
                break;
            default:
                status = 'online';
        };
        client.user?.setStatus(status);

        let type: any;
        switch (activityOption.activityType) {
            case Playing:
                type = Playing;
                break;
            case Streaming:
                type = Streaming;
                break;
            case Listening:
                type = Listening;
                break;
            case Watching:
                type = Watching;
                break;
            case Custom:
                type = Custom;
                break;
            case Competing:
                type = Competing;
                break;
            default:
                type = Playing;
        };
        client.user?.setActivity(activityOption.activityMessage, { type: type });
        console.log(`Ready! Logged in as ${client.user?.tag}`);
    }
}