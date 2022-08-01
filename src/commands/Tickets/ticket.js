const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js')
const config = require(`../../../config.json`)
const db = require('../../models/joinToCreate')

module.exports = {
    data: new SlashCommandBuilder()
        .setName(`ticket`)
        .setDescription(`Control tickets`)
        .addSubcommand(subCommand =>
            subCommand
                .setName("create")
                .setDescription("Create a ticket tool in the current channel")
                .addChannelOption(option =>
                    option.setName(`category`).setDescription(`The category the tickets should be created under`).setRequired(true)
                ),
        ),
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true })

        if (interaction) {
            if (interaction.options.getSubcommand() === "create") {
                if (!interaction.member.permissions.has(Discord.Permissions.FLAGS.MANAGE_GUILD)) {
                    const embed = new Discord.MessageEmbed()
                        .setDescription(`${config.crossEmoji} You can't use this command`)
                        .setColor(config.ErrorHexColor)
                        .setAuthor(interaction.user.username, interaction.user.displayAvatarURL())
                        .setFooter(interaction.guild.name)
                        .setTimestamp()
                    return interaction.editReply({ embeds: [embed], ephemeral: true })
                }

                const channel = interaction.options.getChannel("category")
                if (!channel.type === "GUILD_CATEGORY") {
                    console.log("NOT")
                } else {
                    console.log(channel.id)
                }
            }
        }
    }
}