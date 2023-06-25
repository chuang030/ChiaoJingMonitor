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
const chooseOne_json_1 = require("../config/commands/chooseOne.json");
const mathUtils = new index_1.MathUtils();
const sendMessageFormatUtils = new index_1.SendMessageFormatUtils({
    formatTag: {
        userId: config_json_1.formatObject.userId,
        userName: config_json_1.formatObject.userName,
        channelId: config_json_1.formatObject.channelId,
        otherMessage: config_json_1.formatObject.otherMessageString
    }
});
module.exports = {
    data: new discord_js_1.SlashCommandBuilder()
        .setName(chooseOne_json_1.commandName)
        .setDescription(chooseOne_json_1.commandDescription)
        .addSubcommand(subcommand => subcommand.setName(chooseOne_json_1.subCommand[0].commandName)
        .setDescription(chooseOne_json_1.subCommand[0].commandDescription)
        .addStringOption(option => option.setName(chooseOne_json_1.subCommand[0].option[0].optionName)
        .setDescription(chooseOne_json_1.subCommand[0].option[0].optionDescription)
        .setRequired(true))
        .addStringOption(option => option.setName(chooseOne_json_1.subCommand[0].option[1].optionName)
        .setDescription(chooseOne_json_1.subCommand[0].option[1].optionDescription)
        .setRequired(true)))
        .addSubcommand(subcommand => subcommand.setName(chooseOne_json_1.subCommand[1].commandName)
        .setDescription(chooseOne_json_1.subCommand[1].commandDescription)
        .addStringOption(option => option.setName(chooseOne_json_1.subCommand[1].option[0].optionName)
        .setDescription(chooseOne_json_1.subCommand[1].option[0].optionDescription)
        .setRequired(true))
        .addStringOption(option => option.setName(chooseOne_json_1.subCommand[1].option[1].optionName)
        .setDescription(chooseOne_json_1.subCommand[1].option[1].optionDescription)
        .setRequired(true))
        .addNumberOption(option => option.setName(chooseOne_json_1.subCommand[1].option[2].optionName)
        .setDescription(chooseOne_json_1.subCommand[1].option[2].optionDescription))
        .addNumberOption(option => option.setName(chooseOne_json_1.subCommand[1].option[3].optionName)
        .setDescription(chooseOne_json_1.subCommand[1].option[3].optionDescription))
        .addIntegerOption(option => option.setName(chooseOne_json_1.subCommand[1].option[4].optionName)
        .setDescription(chooseOne_json_1.subCommand[1].option[4].optionDescription)
        .setMinValue(0)
        .setMaxValue(12))),
    execute(interaction) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            if (interaction.options.getSubcommand() === chooseOne_json_1.subCommand[0].commandName) {
                const decideOne = interaction.options.getString(chooseOne_json_1.subCommand[0].option[0].optionName);
                const decideTwo = interaction.options.getString(chooseOne_json_1.subCommand[0].option[1].optionName);
                const decideArray = [decideOne, decideTwo];
                const decideResult = decideArray[mathUtils.getRandom(0, 1)];
                if (decideOne && decideTwo && decideResult) {
                    sendMessageFormatUtils.setOtherMessageString = [decideOne, decideTwo, decideResult];
                }
                ;
                try {
                    if (chooseOne_json_1.subCommand[0].enableThinkImage) {
                        const attachmentImages = new discord_js_1.AttachmentBuilder(chooseOne_json_1.subCommand[0].thinkImage);
                        yield interaction.reply({
                            content: chooseOne_json_1.subCommand[0].thinkMessage,
                            files: [attachmentImages]
                        });
                        yield (0, index_1.sleep)(chooseOne_json_1.subCommand[0].thinkTime);
                        (yield interaction.editReply(sendMessageFormatUtils.formatString(chooseOne_json_1.subCommand[0].reply))).removeAttachments();
                    }
                    else {
                        yield interaction.reply(chooseOne_json_1.subCommand[0].thinkMessage);
                        yield (0, index_1.sleep)(chooseOne_json_1.subCommand[0].thinkTime);
                        yield interaction.editReply(sendMessageFormatUtils.formatString(chooseOne_json_1.subCommand[0].reply));
                    }
                    ;
                }
                catch (error) {
                    console.error(error);
                }
                ;
            }
            else if (interaction.options.getSubcommand() === chooseOne_json_1.subCommand[1].commandName) {
                const decideOne = interaction.options.getString(chooseOne_json_1.subCommand[1].option[0].optionName);
                const decideTwo = interaction.options.getString(chooseOne_json_1.subCommand[1].option[1].optionName);
                let probabilityOne = interaction.options.getNumber(chooseOne_json_1.subCommand[1].option[2].optionName);
                let probabilityTwo = interaction.options.getNumber(chooseOne_json_1.subCommand[1].option[3].optionName);
                const decimal = (_a = interaction.options.getInteger(chooseOne_json_1.subCommand[1].option[4].optionName)) !== null && _a !== void 0 ? _a : 3;
                // 其中一個機率不為空
                if (probabilityOne != null && probabilityTwo === null)
                    probabilityTwo = mathUtils.round(100 - probabilityOne, decimal);
                if (probabilityTwo != null && probabilityOne === null)
                    probabilityOne = mathUtils.round(100 - probabilityTwo, decimal);
                // 機率都為空
                if (probabilityOne === null)
                    probabilityOne = 50;
                if (probabilityTwo === null)
                    probabilityTwo = 50;
                const totalProbability = probabilityOne + probabilityTwo;
                // 輸入機率不等於100時
                if (totalProbability != 100) {
                    // 計算輸入機率占比，重設符合100%的機率
                    probabilityOne = mathUtils.round(probabilityOne / totalProbability * 100, decimal);
                    probabilityTwo = mathUtils.round(probabilityTwo / totalProbability * 100, decimal);
                }
                ;
                const decideArray = [decideOne, decideTwo];
                try {
                    const decideResult = decideArray[mathUtils.getProbabilityRandom(decimal, probabilityOne, probabilityTwo)];
                    if (decideOne && decideTwo && decideResult) {
                        sendMessageFormatUtils.setOtherMessageString = [
                            decideOne, String(probabilityOne),
                            decideTwo, String(probabilityTwo),
                            decideResult
                        ];
                    }
                    ;
                    if (chooseOne_json_1.subCommand[0].enableThinkImage) {
                        const attachmentImages = new discord_js_1.AttachmentBuilder(chooseOne_json_1.subCommand[1].thinkImage);
                        yield interaction.reply({
                            content: chooseOne_json_1.subCommand[0].thinkMessage,
                            files: [attachmentImages]
                        });
                        yield (0, index_1.sleep)(chooseOne_json_1.subCommand[1].thinkTime);
                        (yield interaction.editReply(sendMessageFormatUtils.formatString(chooseOne_json_1.subCommand[1].reply))).removeAttachments();
                    }
                    else {
                        yield interaction.reply(chooseOne_json_1.subCommand[1].thinkMessage);
                        yield (0, index_1.sleep)(chooseOne_json_1.subCommand[1].thinkTime);
                        yield interaction.editReply(sendMessageFormatUtils.formatString(chooseOne_json_1.subCommand[1].reply));
                    }
                    ;
                }
                catch (error) {
                    console.error(error);
                }
                ;
            }
            ;
        });
    }
};
