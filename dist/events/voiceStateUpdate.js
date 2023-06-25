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
const config_json_1 = require("../config.json");
const index_1 = require("../utils/index");
const index_2 = require("../httpRequest/index");
const dataCheckUtils = new index_1.DataCheckUtils;
const voiceStateUpdateSendMessageUtils = new index_1.VoiceStateUpdateSendMessageUtils({
    sendMessageFormatUtilsOption: {
        formatTag: {
            userId: config_json_1.formatObject.userId,
            userName: config_json_1.formatObject.userName,
            channelId: config_json_1.formatObject.channelId,
            emoji: config_json_1.formatObject.emoji,
            otherMessage: config_json_1.formatObject.otherMessageString
        }
    }
});
const randomMessageUtils = new index_1.RandomMessageUtils();
module.exports = {
    name: discord_js_1.Events.VoiceStateUpdate,
    execute(oldState, newState) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
        return __awaiter(this, void 0, void 0, function* () {
            if (newState.guild.channels.guild.systemChannelId === null)
                return;
            for (const channelListenerIterator of config_json_1.channelListener) {
                // whether mentions user
                //if newState.id and mainListenerUserId is the same, and disableMainListenerUser is false
                if (newState.id === channelListenerIterator.mainListenerUserId && !channelListenerIterator.disableMainListenerUser) {
                    // if disableMainMentionsUser is false, to set mainMentionsUserId
                    if (!channelListenerIterator.disableMainMentionsUser)
                        voiceStateUpdateSendMessageUtils.setMentionsUserId = channelListenerIterator.mainMentionsUserId;
                }
                else {
                    // if newState.id is not mainListenerUserId, to set setMentionsUserId = ""
                    voiceStateUpdateSendMessageUtils.setMentionsUserId = "";
                }
                ;
                // let channelId = "";
                // if (whitelist.guild) {
                //     if (newState.guild.id != channelListenerIterator.guildId) continue;
                //     channelId =
                //         dataCheckUtils.judgedDataIsNull(channelListenerIterator.channelId) ?
                //             newState.guild.channels.guild.systemChannelId : channelListenerIterator.channelId;
                // };
                // channelId = newState.guild.channels.guild.systemChannelId;
                if (newState.guild.id != channelListenerIterator.guildId)
                    continue;
                const channelId = dataCheckUtils.judgedDataIsNull(channelListenerIterator.channelId) ?
                    newState.guild.channels.guild.systemChannelId : channelListenerIterator.channelId;
                for (const userListenerIterator of config_json_1.userListener) {
                    // if (whitelist.user) {
                    //     // determine whether the user is in the listener list
                    //     if (!userListenerIterator.id.includes(newState.id)) continue;
                    // };
                    if (!userListenerIterator.id.includes(newState.id))
                        continue;
                    // judged user and set username
                    if (userListenerIterator.id === newState.id) {
                        if (userListenerIterator.name != "") {
                            voiceStateUpdateSendMessageUtils.setMentionsUserName = userListenerIterator.name;
                        }
                        else {
                            // if there is not set username
                            if (oldState.channelId === null) {
                                const userId = ((_a = newState.member) === null || _a === void 0 ? void 0 : _a.user.id) ? (_b = newState.member) === null || _b === void 0 ? void 0 : _b.user.id : "";
                                // set username to server nickname
                                let userName = (_c = newState.guild.members.cache.get(userId)) === null || _c === void 0 ? void 0 : _c.nickname;
                                // if nickname is null
                                if (userName === null)
                                    userName = (_d = newState.guild.members.cache.get(userListenerIterator.id)) === null || _d === void 0 ? void 0 : _d.user.username;
                                // if not found username
                                voiceStateUpdateSendMessageUtils.setMentionsUserName = userName ? userName : channelListenerIterator.defaultUserName;
                            }
                            else if (newState.channelId === null) {
                                const userId = ((_e = oldState.member) === null || _e === void 0 ? void 0 : _e.user.id) ? (_f = oldState.member) === null || _f === void 0 ? void 0 : _f.user.id : "";
                                let userName = (_g = oldState.guild.members.cache.get(userId)) === null || _g === void 0 ? void 0 : _g.nickname;
                                if (userName === null)
                                    userName = (_h = newState.guild.members.cache.get(userListenerIterator.id)) === null || _h === void 0 ? void 0 : _h.user.username;
                                voiceStateUpdateSendMessageUtils.setMentionsUserName = userName ? userName : channelListenerIterator.defaultUserName;
                            }
                            else {
                                const userId = ((_j = newState.member) === null || _j === void 0 ? void 0 : _j.user.id) ? (_k = newState.member) === null || _k === void 0 ? void 0 : _k.user.id : "";
                                let userName = (_l = newState.guild.members.cache.get(userId)) === null || _l === void 0 ? void 0 : _l.nickname;
                                if (userName === null)
                                    userName = (_m = newState.guild.members.cache.get(userListenerIterator.id)) === null || _m === void 0 ? void 0 : _m.user.username;
                                voiceStateUpdateSendMessageUtils.setMentionsUserName = userName ? userName : channelListenerIterator.defaultUserName;
                            }
                            ;
                        }
                        ;
                    }
                    ;
                    // join voice
                    if (oldState.channelId === null) {
                        randomMessageUtils.setEmojiPool = [...config_json_1.sendMessage.randomEmoji.join, ...channelListenerIterator.specialEmoji.join];
                        randomMessageUtils.setMessagePool = [...config_json_1.sendMessage.randomMessage.join, ...channelListenerIterator.randomMessage.join];
                        voiceStateUpdateSendMessageUtils.setRandomMessageOption(randomMessageUtils);
                        yield (0, index_2.createMessage)(channelId, voiceStateUpdateSendMessageUtils.getSendMessage(config_json_1.sendMessage.join));
                        return;
                    }
                    ;
                    // leave voice
                    if (newState.channelId === null) {
                        randomMessageUtils.setEmojiPool = [...config_json_1.sendMessage.randomEmoji.leave, ...channelListenerIterator.specialEmoji.leave];
                        randomMessageUtils.setMessagePool = [...config_json_1.sendMessage.randomMessage.leave, ...channelListenerIterator.randomMessage.leave];
                        voiceStateUpdateSendMessageUtils.setRandomMessageOption(randomMessageUtils);
                        yield (0, index_2.createMessage)(channelId, voiceStateUpdateSendMessageUtils.getSendMessage(config_json_1.sendMessage.leave));
                        return;
                    }
                    ;
                    // change channel
                    if (dataCheckUtils.judgedBooleanResult(index_1.LogicalOperators['&&'], oldState.channelId != null, newState.channelId != null, oldState.channelId != newState.channelId)) {
                        randomMessageUtils.setEmojiPool = [...config_json_1.sendMessage.randomEmoji.changeChannel, ...channelListenerIterator.specialEmoji.changeChannel];
                        randomMessageUtils.setMessagePool = [...config_json_1.sendMessage.randomMessage.changeChannel, ...channelListenerIterator.randomMessage.changeChannel];
                        voiceStateUpdateSendMessageUtils.setRandomMessageOption(randomMessageUtils);
                        voiceStateUpdateSendMessageUtils.setMentionsChannel = newState.channelId;
                        yield (0, index_2.createMessage)(channelId, voiceStateUpdateSendMessageUtils.getSendMessage(config_json_1.sendMessage.changeChannel));
                        return;
                    }
                    ;
                    // user streaming is on
                    if (newState.streaming && !oldState.streaming) {
                        randomMessageUtils.setEmojiPool = [...config_json_1.sendMessage.randomEmoji.streamingOn, ...channelListenerIterator.specialEmoji.streamingOn];
                        randomMessageUtils.setMessagePool = [...config_json_1.sendMessage.randomMessage.streamingOn, ...channelListenerIterator.randomMessage.streamingOn];
                        voiceStateUpdateSendMessageUtils.setRandomMessageOption(randomMessageUtils);
                        yield (0, index_2.createMessage)(channelId, voiceStateUpdateSendMessageUtils.getSendMessage(config_json_1.sendMessage.streamingOn));
                        return;
                    }
                    // user streaming is off
                    if (!newState.streaming && oldState.streaming) {
                        randomMessageUtils.setEmojiPool = [...config_json_1.sendMessage.randomEmoji.streamingOff, ...channelListenerIterator.specialEmoji.streamingOff];
                        randomMessageUtils.setMessagePool = [...config_json_1.sendMessage.randomMessage.streamingOff, ...channelListenerIterator.randomMessage.streamingOff];
                        voiceStateUpdateSendMessageUtils.setRandomMessageOption(randomMessageUtils);
                        yield (0, index_2.createMessage)(channelId, voiceStateUpdateSendMessageUtils.getSendMessage(config_json_1.sendMessage.streamingOff));
                        return;
                    }
                    // user self mute is on
                    if (newState.selfMute) {
                        randomMessageUtils.setEmojiPool = [...config_json_1.sendMessage.randomEmoji.muteOn, ...channelListenerIterator.specialEmoji.muteOn];
                        randomMessageUtils.setMessagePool = [...config_json_1.sendMessage.randomMessage.muteOn, ...channelListenerIterator.randomMessage.muteOn];
                        voiceStateUpdateSendMessageUtils.setRandomMessageOption(randomMessageUtils);
                        yield (0, index_2.createMessage)(channelId, voiceStateUpdateSendMessageUtils.getSendMessage(config_json_1.sendMessage.muteOn));
                        return;
                    }
                    ;
                    // user self mute is off
                    if (!newState.selfMute) {
                        randomMessageUtils.setEmojiPool = [...config_json_1.sendMessage.randomEmoji.muteOff, ...channelListenerIterator.specialEmoji.muteOff];
                        randomMessageUtils.setMessagePool = [...config_json_1.sendMessage.randomMessage.muteOff, ...channelListenerIterator.randomMessage.muteOff];
                        voiceStateUpdateSendMessageUtils.setRandomMessageOption(randomMessageUtils);
                        yield (0, index_2.createMessage)(channelId, voiceStateUpdateSendMessageUtils.getSendMessage(config_json_1.sendMessage.muteOff));
                        return;
                    }
                    ;
                }
                ;
            }
            ;
        });
    }
};
