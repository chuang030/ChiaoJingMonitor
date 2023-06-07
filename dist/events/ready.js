"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const config_json_1 = require("../config.json");
const { Playing, Streaming, Listening, Watching, Custom, Competing } = discord_js_1.ActivityType;
module.exports = {
    name: discord_js_1.Events.ClientReady,
    once: true,
    execute(client) {
        var _a, _b, _c;
        let status;
        switch (config_json_1.activityOption.status) {
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
        }
        ;
        (_a = client.user) === null || _a === void 0 ? void 0 : _a.setStatus(status);
        let type;
        switch (config_json_1.activityOption.activityType) {
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
        }
        ;
        (_b = client.user) === null || _b === void 0 ? void 0 : _b.setActivity(config_json_1.activityOption.activityMessage, { type: type });
        console.log(`Ready! Logged in as ${(_c = client.user) === null || _c === void 0 ? void 0 : _c.tag}`);
    }
};
