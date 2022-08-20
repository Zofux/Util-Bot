const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js')
const config = require(`../../../config.json`)
const { Modal, TextInputComponent, SelectMenuComponent, showModal } = require('discord-modals'); // Import all

module.exports = {
    data: new SlashCommandBuilder()
        .setName(`apply`)
        .setDescription(`Apply for different posistions in our team!`)
        .addSubcommand(subCommand => 
            subCommand.setName("staff").setDescription("Apply for a posistion in our staff team")),
    async execute(interaction, client) {
        if (interaction.options.getSubcommand() === "staff") {
            const modal = new Modal()
                .setCustomId("staff")
                .setTitle("Staff Application")
                .addComponents(
                    new TextInputComponent()
                        .setCustomId("time-zone")
                        .setLabel("What time zone are you in?")
                        .setStyle("SHORT")
                        .setRequired(true),

                        new TextInputComponent()
                        .setCustomId("age")
                        .setLabel("How old are you?")
                        .setStyle("SHORT")
                        .setRequired(true),

                        new TextInputComponent()
                        .setCustomId("part")
                        .setLabel("Why do you want to become a moderator")
                        .setStyle("LONG")
                        .setRequired(true),

                        new TextInputComponent()
                        .setCustomId("goal")
                        .setLabel("What are your goals as a moderator")
                        .setStyle("LONG")
                        .setRequired(true),

                        new TextInputComponent()
                        .setCustomId("why")
                        .setLabel("Why should we choose you?")
                        .setStyle("LONG")
                        .setRequired(true),
                )
                showModal(modal, {
                    client: client,
                    interaction: interaction,
                });
        }
    }
}