import createMessage from '../httpRequest/createMessage';
import { Client, Events, Message } from 'discord.js';
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
    VoiceChannelConnectionUtils,
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
const voiceChannelConnectionUtils = new VoiceChannelConnectionUtils();

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
                    sendMessageFormatUtils.setOtherMessageString = new Array(message.content);
                    break;
            }
            await createMessage(message.channelId, sendMessageFormatUtils.formatString(interesting.message));
        });
        keywordsSearchStartsEndsAndSend(message, doYouWant, () => {
            sendMessageFormatUtils.setMentionsUserId = message.author.id;
            sendMessageFormatUtils.setOtherMessageString =
                new Array(doYouWant.sendMessagePool[randomMessageUtils.getRandom(0, doYouWant.sendMessagePool.length - 1)]);
            message.reply(sendMessageFormatUtils.formatString(doYouWant.message));
        });


        if (message.content.startsWith(chatTogether.keywords.chatTogether) || message.content.endsWith(chatTogether.keywords.chatTogether)) {
            voiceChannelConnectionUtils.setClient = client;
            voiceChannelConnectionUtils.setMessage = message;
            const voiceChannel = message.member?.voice.channel;
            const guildId = voiceChannelConnectionUtils.getGuildId;

            if (guildId === null || guildId === undefined) return;
            let connection = client.commands.get(guildId);

            voiceChannelConnectionUtils.voiceConnection();
            messageAnalyzeUtils.analyzeString(message.content);

            if (messageAnalyzeUtils.getResultUserId != "") {
                voiceChannelConnectionUtils.setReceiverUserId = messageAnalyzeUtils.getResultUserId;
                sendMessageFormatUtils.setMentionsUserId = messageAnalyzeUtils.getResultUserId;
            } else {
                voiceChannelConnectionUtils.setReceiverUserId = message.author.id;
                sendMessageFormatUtils.setMentionsUserId = message.author.id;
            };

            if (!connection) {
                if (!voiceChannel) return await createMessage(message.channelId, chatTogether.message.ErrorMessage);
                // if not Mentionsed User
                await voiceChannelConnectionUtils.voiceReceiver(VoiceConnectionStatus.Ready, 20e3);
                await createMessage(message.channelId, sendMessageFormatUtils.formatString(chatTogether.message.welcome));
            } else if (connection) {
                if (!voiceChannel) return await createMessage(message.channelId, chatTogether.message.ErrorMessage);
                // if bot status === ready
                if (connection._state.status === 'ready') {
                    await createMessage(message.channelId, sendMessageFormatUtils.formatString(chatTogether.message.welcome));
                    // if state channel id != now user channel id
                    if (connection.packets.state.channel_id != voiceChannel.id) {
                        voiceChannelConnectionUtils.voiceConnection();
                        await createMessage(message.channelId, sendMessageFormatUtils.formatString(chatTogether.message.welcome));
                    };
                };
                if (connection._state.status === 'disconnected' || connection._state.status === 'signalling') {
                    voiceChannelConnectionUtils.voiceConnection();
                    await createMessage(message.channelId, sendMessageFormatUtils.formatString(chatTogether.message.welcome));
                };
            };
        };
        // Connection Destroy
        if (message.content.startsWith(chatTogether.keywords.dontChat) || message.content.endsWith(chatTogether.keywords.dontChat)) {
            if (voiceChannelConnectionUtils.getConnectedVoice === null) {
                sendMessageFormatUtils.setMentionsUserId = message.author.id;
                return await createMessage(message.channelId, sendMessageFormatUtils.formatString(chatTogether.message.absent));
            };
            voiceChannelConnectionUtils.connectionDestroy();
            sendMessageFormatUtils.setMentionsUserId = message.author.id;
            await createMessage(message.channelId, sendMessageFormatUtils.formatString(chatTogether.message.leave));
            sendMessageFormatUtils.setMentionsUserId = "";
        };

        // /////////////////////
        if (message.content.startsWith("test")) {
        }
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

