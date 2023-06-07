"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const index_1 = require("../utils/index");
const config_json_1 = require("../config.json");
const sendMessageFormatUtils = new index_1.SendMessageFormatUtils({
    formatTag: {
        userId: config_json_1.formatObject.userId,
        userName: config_json_1.formatObject.userName,
        channelId: config_json_1.formatObject.channelId,
        otherMessage: config_json_1.formatObject.otherMessageString
    }
});
const luckUtils = new index_1.LuckUtils;
luckUtils.setDivinationLevel = Object.values(config_json_1.divination.level);
module.exports = {
    data: new discord_js_1.SlashCommandBuilder()
        .setName('運勢')
        .setDescription('今日運勢'),
    execute(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            const index = luckUtils.getRandom(0, luckUtils.getDivinationLevel.length - 1);
            const divinationValue = luckUtils.getDivination(index);
            sendMessageFormatUtils.setMentionsUserId = interaction.user.id;
            sendMessageFormatUtils.setOtherMessageString = new Array("運勢", divinationValue);
            yield interaction.reply(sendMessageFormatUtils.formatString(config_json_1.divination.message));
        });
    }
};
