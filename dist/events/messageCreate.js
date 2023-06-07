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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const createMessage_1 = __importDefault(require("../httpRequest/createMessage"));
const discord_js_1 = require("discord.js");
const voice_1 = require("@discordjs/voice");
const config_json_1 = require("../config.json");
const index_1 = require("../utils/index");
const messageAnalyzeUtils = new index_1.MessageAnalyzeUtils({
    analyzeUserIdTag: config_json_1.messageAnalyze.analyzeUserIdTag,
    analyzeChannelIdTag: config_json_1.messageAnalyze.analyzeChannelIdTag,
    analyzeCustomEmojiTag: config_json_1.messageAnalyze.analyzeCustomEmojiTag,
    analyzeIdTag: config_json_1.messageAnalyze.analyzeIdTag,
    analyzeCustomEmojiIdTag: config_json_1.messageAnalyze.analyzeCustomEmojiIdTag
});
const sendMessageFormatUtils = new index_1.SendMessageFormatUtils({
    formatTag: {
        userId: config_json_1.formatObject.userId,
        userName: config_json_1.formatObject.userName,
        channelId: config_json_1.formatObject.channelId,
        otherMessage: config_json_1.formatObject.otherMessageString
    }
});
const randomMessageUtils = new index_1.RandomMessageUtils();
const luckUtils = new index_1.LuckUtils({
    divinationLevel: Object.values(config_json_1.divination.level)
});
const voiceChannelConnectionUtils = new index_1.VoiceChannelConnectionUtils();
module.exports = {
    name: discord_js_1.Events.MessageCreate,
    execute(message, client) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            if (message.author.bot)
                return;
            // for (const iterator of divination.keywords) {
            //     if (message.content.startsWith(iterator) || message.content.endsWith(iterator)) {
            //         const index = luckUtils.getRandom(0, luckUtils.getDivinationLevel.length - 1);
            //         const divinationValue = luckUtils.getDivination(index);
            //         sandMessageFormatUtils.setOtherMessageString = new Array(message.content, divinationValue);
            //         sandMessageFormatUtils.setMentionsUserId = message.author.id;
            //         await message.channel.send(sandMessageFormatUtils.formatString(divination.message));
            //         return;
            //     };
            // };
            keywordsSearchStartsEndsAndSend(message, config_json_1.divination, () => __awaiter(this, void 0, void 0, function* () {
                const index = luckUtils.getRandom(0, luckUtils.getDivinationLevel.length - 1);
                const divinationValue = luckUtils.getDivination(index);
                sendMessageFormatUtils.setOtherMessageString = new Array(message.content, divinationValue);
                sendMessageFormatUtils.setMentionsUserId = message.author.id;
                yield (0, createMessage_1.default)(message.channelId, sendMessageFormatUtils.formatString(config_json_1.divination.message));
            }));
            keywordsSearchStartsEndsAndSend(message, config_json_1.interesting, (iterator) => __awaiter(this, void 0, void 0, function* () {
                switch (iterator) {
                    case "沒意思":
                        sendMessageFormatUtils.setOtherMessageString =
                            new Array(config_json_1.interesting.emojiPool[randomMessageUtils.getRandom(0, config_json_1.interesting.emojiPool.length - 1)]);
                        break;
                    case "有意思":
                    default:
                        sendMessageFormatUtils.setOtherMessageString = new Array(message.content);
                        break;
                }
                yield (0, createMessage_1.default)(message.channelId, sendMessageFormatUtils.formatString(config_json_1.interesting.message));
            }));
            keywordsSearchStartsEndsAndSend(message, config_json_1.doYouWant, () => {
                sendMessageFormatUtils.setMentionsUserId = message.author.id;
                sendMessageFormatUtils.setOtherMessageString =
                    new Array(config_json_1.doYouWant.sendMessagePool[randomMessageUtils.getRandom(0, config_json_1.doYouWant.sendMessagePool.length - 1)]);
                message.reply(sendMessageFormatUtils.formatString(config_json_1.doYouWant.message));
            });
            if (message.content.startsWith(config_json_1.chatTogether.keywords.chatTogether) || message.content.endsWith(config_json_1.chatTogether.keywords.chatTogether)) {
                voiceChannelConnectionUtils.setClient = client;
                voiceChannelConnectionUtils.setMessage = message;
                const voiceChannel = (_a = message.member) === null || _a === void 0 ? void 0 : _a.voice.channel;
                const guildId = voiceChannelConnectionUtils.getGuildId;
                if (guildId === null || guildId === undefined)
                    return;
                let connection = client.commands.get(guildId);
                voiceChannelConnectionUtils.voiceConnection();
                messageAnalyzeUtils.analyzeString(message.content);
                if (messageAnalyzeUtils.getResultUserId != "") {
                    voiceChannelConnectionUtils.setReceiverUserId = messageAnalyzeUtils.getResultUserId;
                    sendMessageFormatUtils.setMentionsUserId = messageAnalyzeUtils.getResultUserId;
                }
                else {
                    voiceChannelConnectionUtils.setReceiverUserId = message.author.id;
                    sendMessageFormatUtils.setMentionsUserId = message.author.id;
                }
                ;
                if (!connection) {
                    if (!voiceChannel)
                        return yield (0, createMessage_1.default)(message.channelId, config_json_1.chatTogether.message.ErrorMessage);
                    // if not Mentionsed User
                    yield voiceChannelConnectionUtils.voiceReceiver(voice_1.VoiceConnectionStatus.Ready, 20e3);
                    yield (0, createMessage_1.default)(message.channelId, sendMessageFormatUtils.formatString(config_json_1.chatTogether.message.welcome));
                }
                else if (connection) {
                    if (!voiceChannel)
                        return yield (0, createMessage_1.default)(message.channelId, config_json_1.chatTogether.message.ErrorMessage);
                    // if bot status === ready
                    if (connection._state.status === 'ready') {
                        yield (0, createMessage_1.default)(message.channelId, sendMessageFormatUtils.formatString(config_json_1.chatTogether.message.welcome));
                        // if state channel id != now user channel id
                        if (connection.packets.state.channel_id != voiceChannel.id) {
                            voiceChannelConnectionUtils.voiceConnection();
                            yield (0, createMessage_1.default)(message.channelId, sendMessageFormatUtils.formatString(config_json_1.chatTogether.message.welcome));
                        }
                        ;
                    }
                    ;
                    if (connection._state.status === 'disconnected' || connection._state.status === 'signalling') {
                        voiceChannelConnectionUtils.voiceConnection();
                        yield (0, createMessage_1.default)(message.channelId, sendMessageFormatUtils.formatString(config_json_1.chatTogether.message.welcome));
                    }
                    ;
                }
                ;
            }
            ;
            // Connection Destroy
            if (message.content.startsWith(config_json_1.chatTogether.keywords.dontChat) || message.content.endsWith(config_json_1.chatTogether.keywords.dontChat)) {
                if (voiceChannelConnectionUtils.getConnectedVoice === null) {
                    sendMessageFormatUtils.setMentionsUserId = message.author.id;
                    return yield (0, createMessage_1.default)(message.channelId, sendMessageFormatUtils.formatString(config_json_1.chatTogether.message.absent));
                }
                ;
                voiceChannelConnectionUtils.connectionDestroy();
                sendMessageFormatUtils.setMentionsUserId = message.author.id;
                yield (0, createMessage_1.default)(message.channelId, sendMessageFormatUtils.formatString(config_json_1.chatTogether.message.leave));
                sendMessageFormatUtils.setMentionsUserId = "";
            }
            ;
            // /////////////////////
            if (message.content.startsWith("test")) {
            }
        });
    }
};
/**
 *
 * @param message
 * @param messageObject
 * @param callback
 * @returns
 */
function keywordsSearchStartsEndsAndSend(message, messageObject, callback) {
    for (const iterator of messageObject.keywords) {
        if (message.content.startsWith(iterator) || message.content.endsWith(iterator)) {
            callback(iterator);
            return;
        }
        ;
    }
    ;
}
;
