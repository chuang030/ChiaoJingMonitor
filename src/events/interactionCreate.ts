import { ChatInputCommandInteraction, Events, SlashCommandBuilder } from 'discord.js';

type commandType = { data: SlashCommandBuilder, execute: (Interaction: ChatInputCommandInteraction) => unknown };

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction: ChatInputCommandInteraction) {
        if (!interaction.isChatInputCommand()) return;

        const command: commandType | undefined = interaction.client.commands.get(interaction.commandName);

        if (!command) {
            console.error(`No command matching ${interaction.commandName} was found.`);
            return;
        }

        try {
            await command.execute(interaction);
        } catch (error) {
            await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
        }
    }
}