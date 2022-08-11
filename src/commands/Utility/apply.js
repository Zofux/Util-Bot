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

                    new SelectMenuComponent()
                        .setCustomId("age")
                        .setPlaceholder("How old are you?")
                        .addOptions(
                            {
                                label: "Above 16",
                                description: "You are above the age of 16 years",
                                value: "true",
                            },
                            {
                                label: "Under 16",
                                description: "You are under the age of 16 years",
                                value: "false",
                            }
                        ),

                        new TextInputComponent()
                        .setCustomId("part")
                        .setLabel("Why do you want to be a part of our staff team?")
                        .setStyle("LONG")
                        .setRequired(true),

                        new TextInputComponent()
                        .setCustomId("goal")
                        .setLabel("What do you believe the goal of a staff team is?")
                        .setStyle("LONG")
                        .setRequired(true),

                        new TextInputComponent()
                        .setCustomId("goal")
                        .setLabel("What are your strengths and weaknesses?")
                        .setStyle("LONG")
                        .setRequired(true),

                        new TextInputComponent()
                        .setCustomId("goal")
                        .setLabel("Why should we choose you over other applications")
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