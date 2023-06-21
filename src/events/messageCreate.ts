import createMessage from '../httpRequest/createMessage';
import { Client, Events, Message, VoiceBasedChannel } from 'discord.js';
import { VoiceConnectionStatus } from '@discordjs/voice';
import {
    divination,
    formatObject,
    interesting,
    doYouWant,
    chatTogether,
    messageAnalyze
} from '../config.json';
import {
    MessageAnalyzeUtils,
    SendMessageFormatUtils,
    LuckUtils,
    RandomMessageUtils,
    VoiceReceiverUtils
} from '../utils/index';

const messageAnalyzeUtils = new MessageAnalyzeUtils({
    analyzeUserIdTag: messageAnalyze.analyzeUserIdTag,
    analyzeChannelIdTag: messageAnalyze.analyzeChannelIdTag,
    analyzeCustomEmojiTag: messageAnalyze.analyzeCustomEmojiTag,
    analyzeIdTag: messageAnalyze.analyzeIdTag,
    analyzeCustomEmojiIdTag: messageAnalyze.analyzeCustomEmojiIdTag
});

const sendMessageFormatUtils = new SendMessageFormatUtils({
    formatTag: {
        userId: formatObject.userId,
        userName: formatObject.userName,
        channelId: formatObject.channelId,
        otherMessage: formatObject.otherMessageString
    }
});
const randomMessageUtils = new RandomMessageUtils();
const luckUtils = new LuckUtils({
    divinationLevel: Object.values(divination.level)
});

const voiceReceiverUtils: VoiceReceiverUtils = VoiceReceiverUtils.getInstance();

module.exports = {
    name: Events.MessageCreate,
    async execute(message: Message, client: Client) {
        if (message.author.bot) return;
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
        keywordsSearchStartsEndsAndSend(message, divination, async () => {
            const index = luckUtils.getRandom(0, luckUtils.getDivinationLevel.length - 1);
            const divinationValue = luckUtils.getDivination(index);
            sendMessageFormatUtils.setOtherMessageString = new Array(message.content, divinationValue);
            sendMessageFormatUtils.setMentionsUserId = message.author.id;
            await createMessage(message.channelId, sendMessageFormatUtils.formatString(divination.message));
        });
        keywordsSearchStartsEndsAndSend(message, interesting, async (iterator: string) => {
            switch (iterator) {
                case "沒意思":
                    sendMessageFormatUtils.setOtherMessageString =
                        new Array(interesting.emojiPool[randomMessageUtils.getRandom(0, interesting.emojiPool.length - 1)]);
                    break;
                case "有意思":
                default:
                    sendMessageFormatUtils.setOtherMessageString = [message.content];
                    break;
            }
            await createMessage(message.channelId, sendMessageFormatUtils.formatString(interesting.message));
        });
        keywordsSearchStartsEndsAndSend(message, doYouWant, () => {
            sendMessageFormatUtils.setMentionsUserId = message.author.id;
            sendMessageFormatUtils.setOtherMessageString =
                [doYouWant.sendMessagePool[randomMessageUtils.getRandom(0, doYouWant.sendMessagePool.length - 1)]];
            message.reply(sendMessageFormatUtils.formatString(doYouWant.message));
        });


        if (message.content.startsWith(chatTogether.keywords.chatTogether)
            || message.content.endsWith(chatTogether.keywords.chatTogether)) {

            // Set guildId
            if (!message.guildId) return;
            voiceReceiverUtils.setGuildId = message.guildId;

            // Set bot client
            voiceReceiverUtils.setClient = client;

            // Analyze message content.
            messageAnalyzeUtils.analyzeString(message.content);

            // Get voiceChannel
            const voiceChannel =
                message.guild?.voiceStates.cache.get(messageAnalyzeUtils.getResultUserId)?.channel
                || message.member?.voice.channel
                || (message.guild?.channels.cache.get(messageAnalyzeUtils.getResultChannelId)?.isVoiceBased() ?
                    message.guild?.channels.cache.get(messageAnalyzeUtils.getResultChannelId) as VoiceBasedChannel : false);

            // if not voice Channel
            if (!voiceChannel) {
                let errorMessage = "";
                if (messageAnalyzeUtils.getResultUserId != "") {
                    errorMessage = chatTogether.message.errorMessage.mentionedUser;
                    sendMessageFormatUtils.setMentionsUserId = messageAnalyzeUtils.getResultUserId;
                }
                if (messageAnalyzeUtils.getResultChannelId != "") {
                    errorMessage = chatTogether.message.errorMessage.mentionedChannel;
                    sendMessageFormatUtils.setMentionsChannel = messageAnalyzeUtils.getResultChannelId;
                };
                if (errorMessage === "") errorMessage = chatTogether.message.errorMessage.notInVoiceChannel;
                return await createMessage(message.channelId, sendMessageFormatUtils.formatString(errorMessage));
            };
            voiceReceiverUtils.setVoiceChannel = voiceChannel;

            let analyzeChannelId = "";
            let analyzeUserlId = "";
            // if mentioned channel
            if (messageAnalyzeUtils.getResultChannelId != "") {
                if (message.guild?.channels.cache.get(messageAnalyzeUtils.getResultChannelId)?.isVoiceBased()) {
                    analyzeChannelId = messageAnalyzeUtils.getResultChannelId;
                } else {
                    // if mentioned channel not voice channel
                    sendMessageFormatUtils.setMentionsChannel = messageAnalyzeUtils.getResultChannelId;
                    // if mentioned content include user
                    if (messageAnalyzeUtils.getResultUserId != "") {
                        sendMessageFormatUtils.setMentionsUserId = messageAnalyzeUtils.getResultUserId;
                    } else {
                        sendMessageFormatUtils.setMentionsUserId = message.author.id;
                    };
                    await createMessage(message.channelId,
                        sendMessageFormatUtils.formatString(chatTogether.message.errorMessage.mentionedChannel_2));
                };
            };

            // if mentioned user
            if (messageAnalyzeUtils.getResultUserId != "") {
                // user's channel is voice channel, to set receiver user id
                if (message.guild?.voiceStates.cache.get(messageAnalyzeUtils.getResultUserId)?.channel) {
                    analyzeUserlId = messageAnalyzeUtils.getResultUserId;
                };
                sendMessageFormatUtils.setMentionsUserId = messageAnalyzeUtils.getResultUserId;
            };
            if (analyzeUserlId === "") {
                analyzeUserlId = message.author.id;
                sendMessageFormatUtils.setMentionsUserId = message.author.id;
            };
            voiceReceiverUtils.setReceiverChannelId = analyzeChannelId;
            voiceReceiverUtils.setReceiverUserId = analyzeUserlId;


            // connection to voice channel
            voiceReceiverUtils.voiceConnection();
            let connection = client.commands.get(voiceReceiverUtils.getGuildId);
            const welcomeMessage = await createMessage(message.channelId, sendMessageFormatUtils.formatString(chatTogether.message.welcome));
            // bot not in voice channel.
            if (!connection) {
                // if not Mentionsed User
                await voiceReceiverUtils.voiceReceiver(VoiceConnectionStatus.Ready, 20e3);
                return welcomeMessage;
            } else if (connection) {

                // bot status
                if (connection._state.status === 'ready') return welcomeMessage;
                if (connection._state.status === 'signalling') return welcomeMessage;
                if (connection._state.status === 'disconnected') return welcomeMessage;
            };
        };


        // Connection Destroy
        if (message.content.startsWith(chatTogether.keywords.dontChat) || message.content.endsWith(chatTogether.keywords.dontChat)) {
            if (voiceReceiverUtils.getConnectedVoice === null) {
                sendMessageFormatUtils.setMentionsUserId = message.author.id;
                return await createMessage(message.channelId, sendMessageFormatUtils.formatString(chatTogether.message.absent));
            };
            voiceReceiverUtils.connectionDestroy();

            sendMessageFormatUtils.setMentionsUserId = message.author.id;
            await createMessage(message.channelId, sendMessageFormatUtils.formatString(chatTogether.message.leave));
            sendMessageFormatUtils.setMentionsUserId = "";
        };

        // /////////////////////
        if (message.content.startsWith("test")) {
            console.log(message.content);


        };
    }
};

interface MessageObject {
    keywords: Array<string>,
    message: string
}

/**
 * 
 * @param message 
 * @param messageObject 
 * @param callback 
 * @returns 
 */
function keywordsSearchStartsEndsAndSend(message: Message, messageObject: MessageObject, callback: (data: any) => void): void {
    for (const iterator of messageObject.keywords) {
        if (message.content.startsWith(iterator) || message.content.endsWith(iterator)) {
            callback(iterator);
            return;
        };
    };
};

