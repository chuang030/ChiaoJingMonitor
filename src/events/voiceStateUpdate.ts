import { Events, VoiceState } from 'discord.js';
import {
    channelListener,
    sendMessage,
    userListener,
    formatObject,
} from '../config.json';
import {
    DataCheckUtils,
    LogicalOperators,
    RandomMessageUtils,
    VoiceStateUpdateSendMessageUtils,
} from '../utils/index';
import createMessage from '../httpRequest/createMessage';

const dataCheckUtils = new DataCheckUtils;
const voiceStateUpdateSandMessageUtils = new VoiceStateUpdateSendMessageUtils({
    sendMessageFormatUtilsOption: {
        formatTag: {
            userId: formatObject.userId,
            userName: formatObject.userName,
            channelId: formatObject.channelId,
            emoji: formatObject.emoji,
            otherMessage: formatObject.otherMessageString
        }
    }
});
const randomMessageUtils = new RandomMessageUtils();

module.exports = {
    name: Events.VoiceStateUpdate,
    async execute(oldState: VoiceState, newState: VoiceState) {

        if (newState.guild.channels.guild.systemChannelId === null) return;
        for (const channelListenerIterator of channelListener) {
            // whether mentions user
            //if newState.id and mainListenerUserId is the same, and disableMainListenerUser is false
            if (newState.id === channelListenerIterator.mainListenerUserId && !channelListenerIterator.disableMainListenerUser) {
                // if disableMainMentionsUser is false, to set mainMentionsUserId
                if (!channelListenerIterator.disableMainMentionsUser)
                    voiceStateUpdateSandMessageUtils.setMentionsUserId = channelListenerIterator.mainMentionsUserId;
            } else {
                // if newState.id is not mainListenerUserId, to set setMentionsUserId = ""
                voiceStateUpdateSandMessageUtils.setMentionsUserId = "";
            };
            // let channelId = "";
            // if (whitelist.guild) {
            //     if (newState.guild.id != channelListenerIterator.guildId) continue;
            //     channelId =
            //         dataCheckUtils.judgedDataIsNull(channelListenerIterator.channelId) ?
            //             newState.guild.channels.guild.systemChannelId : channelListenerIterator.channelId;
            // };
            // channelId = newState.guild.channels.guild.systemChannelId;

            if (newState.guild.id != channelListenerIterator.guildId) continue;
            const channelId =
                dataCheckUtils.judgedDataIsNull(channelListenerIterator.channelId) ?
                    newState.guild.channels.guild.systemChannelId : channelListenerIterator.channelId;
            for (const userListenerIterator of userListener) {

                // if (whitelist.user) {
                //     // determine whether the user is in the listener list
                //     if (!userListenerIterator.id.includes(newState.id)) continue;
                // };
                if (!userListenerIterator.id.includes(newState.id)) continue;

                // judged user and set username
                if (userListenerIterator.id === newState.id) {
                    if (userListenerIterator.name != "") {
                        voiceStateUpdateSandMessageUtils.setMentionsUserName = userListenerIterator.name;
                    } else {
                        // if there is not set username
                        if (oldState.channelId === null) {
                            const userId = newState.member?.user.id ? newState.member?.user.id : "";
                            // set username to server nickname
                            let userName = newState.guild.members.cache.get(userId)?.nickname;
                            // if nickname is null
                            if (userName === null) userName = newState.guild.members.cache.get(userListenerIterator.id)?.user.username;
                            // if not found username
                            voiceStateUpdateSandMessageUtils.setMentionsUserName = userName ? userName : channelListenerIterator.defaultUserName;
                        } else if (newState.channelId === null) {
                            const userId = oldState.member?.user.id ? oldState.member?.user.id : "";
                            let userName = oldState.guild.members.cache.get(userId)?.nickname;
                            if (userName === null) userName = newState.guild.members.cache.get(userListenerIterator.id)?.user.username;
                            voiceStateUpdateSandMessageUtils.setMentionsUserName = userName ? userName : channelListenerIterator.defaultUserName;
                        } else {
                            const userId = newState.member?.user.id ? newState.member?.user.id : "";
                            let userName = newState.guild.members.cache.get(userId)?.nickname;
                            if (userName === null) userName = newState.guild.members.cache.get(userListenerIterator.id)?.user.username;
                            voiceStateUpdateSandMessageUtils.setMentionsUserName = userName ? userName : channelListenerIterator.defaultUserName;
                        };
                    };
                };
                // join voice
                if (oldState.channelId === null) {
                    randomMessageUtils.setEmojiPool = [...sendMessage.randomEmoji.join, ...channelListenerIterator.specialEmoji.join];
                    randomMessageUtils.setMessagePool = [...sendMessage.randomMessage.join, ...channelListenerIterator.randomMessage.join];
                    voiceStateUpdateSandMessageUtils.setRandomMessageOption(randomMessageUtils);
                    await createMessage(channelId, voiceStateUpdateSandMessageUtils.getSendMessage(sendMessage.join));
                    return;
                };
                // leave voice
                if (newState.channelId === null) {
                    randomMessageUtils.setEmojiPool = [...sendMessage.randomEmoji.leave, ...channelListenerIterator.specialEmoji.leave];
                    randomMessageUtils.setMessagePool = [...sendMessage.randomMessage.leave, ...channelListenerIterator.randomMessage.leave];
                    voiceStateUpdateSandMessageUtils.setRandomMessageOption(randomMessageUtils);
                    await createMessage(channelId, voiceStateUpdateSandMessageUtils.getSendMessage(sendMessage.leave));
                    return;
                };
                // change channel
                if (dataCheckUtils.judgedBooleanResult(
                    LogicalOperators['&&'],
                    oldState.channelId != null,
                    newState.channelId != null,
                    oldState.channelId != newState.channelId
                )) {
                    randomMessageUtils.setEmojiPool = [...sendMessage.randomEmoji.changeChannel, ...channelListenerIterator.specialEmoji.changeChannel];
                    randomMessageUtils.setMessagePool = [...sendMessage.randomMessage.changeChannel, ...channelListenerIterator.randomMessage.changeChannel];
                    voiceStateUpdateSandMessageUtils.setRandomMessageOption(randomMessageUtils);
                    voiceStateUpdateSandMessageUtils.setMentionsChannel = newState.channelId;
                    await createMessage(channelId, voiceStateUpdateSandMessageUtils.getSendMessage(sendMessage.changeChannel));
                    return;
                };
                // user streaming is on
                if (newState.streaming && !oldState.streaming) {
                    randomMessageUtils.setEmojiPool = [...sendMessage.randomEmoji.streamingOn, ...channelListenerIterator.specialEmoji.streamingOn];
                    randomMessageUtils.setMessagePool = [...sendMessage.randomMessage.streamingOn, ...channelListenerIterator.randomMessage.streamingOn];
                    voiceStateUpdateSandMessageUtils.setRandomMessageOption(randomMessageUtils);
                    await createMessage(channelId, voiceStateUpdateSandMessageUtils.getSendMessage(sendMessage.streamingOn));
                    return;
                }
                // user streaming is off
                if (!newState.streaming && oldState.streaming) {
                    randomMessageUtils.setEmojiPool = [...sendMessage.randomEmoji.streamingOff, ...channelListenerIterator.specialEmoji.streamingOff];
                    randomMessageUtils.setMessagePool = [...sendMessage.randomMessage.streamingOff, ...channelListenerIterator.randomMessage.streamingOff];
                    voiceStateUpdateSandMessageUtils.setRandomMessageOption(randomMessageUtils);
                    await createMessage(channelId, voiceStateUpdateSandMessageUtils.getSendMessage(sendMessage.streamingOff));
                    return;
                }
                // user self mute is on
                if (newState.selfMute) {
                    randomMessageUtils.setEmojiPool = [...sendMessage.randomEmoji.muteOn, ...channelListenerIterator.specialEmoji.muteOn];
                    randomMessageUtils.setMessagePool = [...sendMessage.randomMessage.muteOn, ...channelListenerIterator.randomMessage.muteOn];
                    voiceStateUpdateSandMessageUtils.setRandomMessageOption(randomMessageUtils);
                    await createMessage(channelId, voiceStateUpdateSandMessageUtils.getSendMessage(sendMessage.muteOn));
                    return;
                };
                // user self mute is off
                if (!newState.selfMute) {
                    randomMessageUtils.setEmojiPool = [...sendMessage.randomEmoji.muteOff, ...channelListenerIterator.specialEmoji.muteOff];
                    randomMessageUtils.setMessagePool = [...sendMessage.randomMessage.muteOff, ...channelListenerIterator.randomMessage.muteOff];
                    voiceStateUpdateSandMessageUtils.setRandomMessageOption(randomMessageUtils);
                    await createMessage(channelId, voiceStateUpdateSandMessageUtils.getSendMessage(sendMessage.muteOff));
                    return;
                };
            };
        };
    }
};