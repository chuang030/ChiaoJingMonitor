import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { SendMessageFormatUtils, LuckUtils } from '../utils/index'
import { divination, formatObject } from '../config.json'

const sendMessageFormatUtils = new SendMessageFormatUtils({
    formatTag: {
        userId: formatObject.userId,
        userName: formatObject.userName,
        channelId: formatObject.channelId,
        otherMessage: formatObject.otherMessageString
    }
});
const luckUtils = new LuckUtils;
luckUtils.setDivinationLevel = Object.values(divination.level);

module.exports = {
    data: new SlashCommandBuilder()
        .setName('運勢')
        .setDescription('今日運勢'),
    async execute(interaction: ChatInputCommandInteraction) {
        const index = luckUtils.getRandom(0, luckUtils.getDivinationLevel.length - 1);
        const divinationValue = luckUtils.getDivination(index);
        sendMessageFormatUtils.setMentionsUserId = interaction.user.id;
        sendMessageFormatUtils.setOtherMessageString = new Array("運勢", divinationValue);
        await interaction.reply(sendMessageFormatUtils.formatString(divination.message));
    }
};