import { ChatInputCommandInteraction, SlashCommandBuilder, AttachmentBuilder } from 'discord.js';
import { MathUtils, SendMessageFormatUtils, sleep } from '../utils/index';
import { formatObject } from '../config.json'
import { commandName, commandDescription, subCommand } from '../config/commands/chooseOne.json'

const mathUtils = new MathUtils();
const sendMessageFormatUtils = new SendMessageFormatUtils({
    formatTag: {
        userId: formatObject.userId,
        userName: formatObject.userName,
        channelId: formatObject.channelId,
        otherMessage: formatObject.otherMessageString
    }
});

module.exports = {
    data: new SlashCommandBuilder()
        .setName(commandName)
        .setDescription(commandDescription)
        .addSubcommand(subcommand =>
            subcommand.setName(subCommand[0].commandName)
                .setDescription(subCommand[0].commandDescription)
                .addStringOption(option =>
                    option.setName(subCommand[0].option[0].optionName)
                        .setDescription(subCommand[0].option[0].optionDescription)
                        .setRequired(true)
                )
                .addStringOption(option =>
                    option.setName(subCommand[0].option[1].optionName)
                        .setDescription(subCommand[0].option[1].optionDescription)
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand.setName(subCommand[1].commandName)
                .setDescription(subCommand[1].commandDescription)
                .addStringOption(option =>
                    option.setName(subCommand[1].option[0].optionName)
                        .setDescription(subCommand[1].option[0].optionDescription)
                        .setRequired(true)
                )
                .addStringOption(option =>
                    option.setName(subCommand[1].option[1].optionName)
                        .setDescription(subCommand[1].option[1].optionDescription)
                        .setRequired(true)
                )
                .addNumberOption(option =>
                    option.setName(subCommand[1].option[2].optionName)
                        .setDescription(subCommand[1].option[2].optionDescription)
                )
                .addNumberOption(option =>
                    option.setName(subCommand[1].option[3].optionName)
                        .setDescription(subCommand[1].option[3].optionDescription)
                )
                .addIntegerOption(option =>
                    option.setName(subCommand[1].option[4].optionName)
                        .setDescription(subCommand[1].option[4].optionDescription)
                        .setMinValue(0)
                        .setMaxValue(12)
                )
        ),
    async execute(interaction: ChatInputCommandInteraction) {
        if (interaction.options.getSubcommand() === subCommand[0].commandName) {
            const decideOne = interaction.options.getString(subCommand[0].option[0].optionName);
            const decideTwo = interaction.options.getString(subCommand[0].option[1].optionName);
            const decideArray = [decideOne, decideTwo];
            const decideResult = decideArray[mathUtils.getRandom(0, 1)];
            if (decideOne && decideTwo && decideResult) {
                sendMessageFormatUtils.setOtherMessageString = [decideOne, decideTwo, decideResult];
            };
            try {
                if (subCommand[0].enableThinkImage) {
                    const attachmentImages = new AttachmentBuilder(subCommand[0].thinkImage);
                    await interaction.reply({
                        content: subCommand[0].thinkMessage,
                        files: [attachmentImages]
                    });
                    await sleep(subCommand[0].thinkTime);
                    (await interaction.editReply(
                        sendMessageFormatUtils.formatString(subCommand[0].reply)
                    )).removeAttachments();
                } else {
                    await interaction.reply(subCommand[0].thinkMessage);
                    await sleep(subCommand[0].thinkTime);
                    await interaction.editReply(sendMessageFormatUtils.formatString(subCommand[0].reply));
                };
            } catch (error) {
                console.error(error);
            };
        } else if (interaction.options.getSubcommand() === subCommand[1].commandName) {
            const decideOne = interaction.options.getString(subCommand[1].option[0].optionName);
            const decideTwo = interaction.options.getString(subCommand[1].option[1].optionName);
            let probabilityOne = interaction.options.getNumber(subCommand[1].option[2].optionName);
            let probabilityTwo = interaction.options.getNumber(subCommand[1].option[3].optionName);
            const decimal = interaction.options.getInteger(subCommand[1].option[4].optionName) ?? 3;
            // 其中一個機率不為空
            if (probabilityOne != null && probabilityTwo === null) probabilityTwo = mathUtils.round(100 - probabilityOne, decimal);
            if (probabilityTwo != null && probabilityOne === null) probabilityOne = mathUtils.round(100 - probabilityTwo, decimal);
            // 機率都為空
            if (probabilityOne === null) probabilityOne = 50;
            if (probabilityTwo === null) probabilityTwo = 50;
            const totalProbability = probabilityOne + probabilityTwo;
            // 輸入機率不等於100時
            if (totalProbability != 100) {
                // 計算輸入機率占比，重設符合100%的機率
                probabilityOne = mathUtils.round(probabilityOne / totalProbability * 100, decimal);
                probabilityTwo = mathUtils.round(probabilityTwo / totalProbability * 100, decimal);
            };
            const decideArray = [decideOne, decideTwo];
            try {
                const decideResult = decideArray[mathUtils.getProbabilityRandom(decimal, probabilityOne, probabilityTwo)];
                if (decideOne && decideTwo && decideResult) {
                    sendMessageFormatUtils.setOtherMessageString = [
                        decideOne, String(probabilityOne),
                        decideTwo, String(probabilityTwo),
                        decideResult
                    ];
                };
                if (subCommand[0].enableThinkImage) {
                    const attachmentImages = new AttachmentBuilder(subCommand[1].thinkImage);
                    await interaction.reply({
                        content: subCommand[0].thinkMessage,
                        files: [attachmentImages]
                    });
                    await sleep(subCommand[1].thinkTime);
                    (await interaction.editReply(
                        sendMessageFormatUtils.formatString(subCommand[1].reply)
                    )).removeAttachments();
                } else {
                    await interaction.reply(subCommand[1].thinkMessage);
                    await sleep(subCommand[1].thinkTime);
                    await interaction.editReply(sendMessageFormatUtils.formatString(subCommand[1].reply));
                };
            } catch (error) {
                console.error(error);
            };
        };
    }
};