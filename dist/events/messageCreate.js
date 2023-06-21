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
const voiceReceiverUtils = index_1.VoiceReceiverUtils.getInstance();
module.exports = {
    name: discord_js_1.Events.MessageCreate,
    execute(message, client) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
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
                        sendMessageFormatUtils.setOtherMessageString = [message.content];
                        break;
                }
                yield (0, createMessage_1.default)(message.channelId, sendMessageFormatUtils.formatString(config_json_1.interesting.message));
            }));
            keywordsSearchStartsEndsAndSend(message, config_json_1.doYouWant, () => {
                sendMessageFormatUtils.setMentionsUserId = message.author.id;
                sendMessageFormatUtils.setOtherMessageString =
                    [config_json_1.doYouWant.sendMessagePool[randomMessageUtils.getRandom(0, config_json_1.doYouWant.sendMessagePool.length - 1)]];
                message.reply(sendMessageFormatUtils.formatString(config_json_1.doYouWant.message));
            });
            if (message.content.startsWith(config_json_1.chatTogether.keywords.chatTogether)
                || message.content.endsWith(config_json_1.chatTogether.keywords.chatTogether)) {
                // Set guildId
                if (!message.guildId)
                    return;
                voiceReceiverUtils.setGuildId = message.guildId;
                // Set bot client
                voiceReceiverUtils.setClient = client;
                // Analyze message content.
                messageAnalyzeUtils.analyzeString(message.content);
                // Get voiceChannel
                const voiceChannel = ((_b = (_a = message.guild) === null || _a === void 0 ? void 0 : _a.voiceStates.cache.get(messageAnalyzeUtils.getResultUserId)) === null || _b === void 0 ? void 0 : _b.channel)
                    || ((_c = message.member) === null || _c === void 0 ? void 0 : _c.voice.channel)
                    || (((_e = (_d = message.guild) === null || _d === void 0 ? void 0 : _d.channels.cache.get(messageAnalyzeUtils.getResultChannelId)) === null || _e === void 0 ? void 0 : _e.isVoiceBased()) ?
                        (_f = message.guild) === null || _f === void 0 ? void 0 : _f.channels.cache.get(messageAnalyzeUtils.getResultChannelId) : false);
                // if not voice Channel
                if (!voiceChannel) {
                    let errorMessage = "";
                    if (messageAnalyzeUtils.getResultUserId != "") {
                        errorMessage = config_json_1.chatTogether.message.errorMessage.mentionedUser;
                        sendMessageFormatUtils.setMentionsUserId = messageAnalyzeUtils.getResultUserId;
                    }
                    if (messageAnalyzeUtils.getResultChannelId != "") {
                        errorMessage = config_json_1.chatTogether.message.errorMessage.mentionedChannel;
                        sendMessageFormatUtils.setMentionsChannel = messageAnalyzeUtils.getResultChannelId;
                    }
                    ;
                    if (errorMessage === "")
                        errorMessage = config_json_1.chatTogether.message.errorMessage.notInVoiceChannel;
                    return yield (0, createMessage_1.default)(message.channelId, sendMessageFormatUtils.formatString(errorMessage));
                }
                ;
                voiceReceiverUtils.setVoiceChannel = voiceChannel;
                let analyzeChannelId = "";
                let analyzeUserlId = "";
                // if mentioned channel
                if (messageAnalyzeUtils.getResultChannelId != "") {
                    if ((_h = (_g = message.guild) === null || _g === void 0 ? void 0 : _g.channels.cache.get(messageAnalyzeUtils.getResultChannelId)) === null || _h === void 0 ? void 0 : _h.isVoiceBased()) {
                        analyzeChannelId = messageAnalyzeUtils.getResultChannelId;
                    }
                    else {
                        // if mentioned channel not voice channel
                        sendMessageFormatUtils.setMentionsChannel = messageAnalyzeUtils.getResultChannelId;
                        // if mentioned content include user
                        if (messageAnalyzeUtils.getResultUserId != "") {
                            sendMessageFormatUtils.setMentionsUserId = messageAnalyzeUtils.getResultUserId;
                        }
                        else {
                            sendMessageFormatUtils.setMentionsUserId = message.author.id;
                        }
                        ;
                        yield (0, createMessage_1.default)(message.channelId, sendMessageFormatUtils.formatString(config_json_1.chatTogether.message.errorMessage.mentionedChannel_2));
                    }
                    ;
                }
                ;
                // if mentioned user
                if (messageAnalyzeUtils.getResultUserId != "") {
                    // user's channel is voice channel, to set receiver user id
                    if ((_k = (_j = message.guild) === null || _j === void 0 ? void 0 : _j.voiceStates.cache.get(messageAnalyzeUtils.getResultUserId)) === null || _k === void 0 ? void 0 : _k.channel) {
                        analyzeUserlId = messageAnalyzeUtils.getResultUserId;
                    }
                    ;
                    sendMessageFormatUtils.setMentionsUserId = messageAnalyzeUtils.getResultUserId;
                }
                ;
                if (analyzeUserlId === "") {
                    analyzeUserlId = message.author.id;
                    sendMessageFormatUtils.setMentionsUserId = message.author.id;
                }
                ;
                voiceReceiverUtils.setReceiverChannelId = analyzeChannelId;
                voiceReceiverUtils.setReceiverUserId = analyzeUserlId;
                // connection to voice channel
                voiceReceiverUtils.voiceConnection();
                let connection = client.commands.get(voiceReceiverUtils.getGuildId);
                const welcomeMessage = yield (0, createMessage_1.default)(message.channelId, sendMessageFormatUtils.formatString(config_json_1.chatTogether.message.welcome));
                // bot not in voice channel.
                if (!connection) {
                    // if not Mentionsed User
                    yield voiceReceiverUtils.voiceReceiver(voice_1.VoiceConnectionStatus.Ready, 20e3);
                    return welcomeMessage;
                }
                else if (connection) {
                    // bot status
                    if (connection._state.status === 'ready')
                        return welcomeMessage;
                    if (connection._state.status === 'signalling')
                        return welcomeMessage;
                    if (connection._state.status === 'disconnected')
                        return welcomeMessage;
                }
                ;
            }
            ;
            // Connection Destroy
            if (message.content.startsWith(config_json_1.chatTogether.keywords.dontChat) || message.content.endsWith(config_json_1.chatTogether.keywords.dontChat)) {
                if (voiceReceiverUtils.getConnectedVoice === null) {
                    sendMessageFormatUtils.setMentionsUserId = message.author.id;
                    return yield (0, createMessage_1.default)(message.channelId, sendMessageFormatUtils.formatString(config_json_1.chatTogether.message.absent));
                }
                ;
                voiceReceiverUtils.connectionDestroy();
                sendMessageFormatUtils.setMentionsUserId = message.author.id;
                yield (0, createMessage_1.default)(message.channelId, sendMessageFormatUtils.formatString(config_json_1.chatTogether.message.leave));
                sendMessageFormatUtils.setMentionsUserId = "";
            }
            ;
            // /////////////////////
            if (message.content.startsWith("test")) {
                console.log(message.content);
            }
            ;
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
