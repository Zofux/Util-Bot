const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js')
const config = require(`../../../config.json`)
const db = require('../../models/count');

module.exports = {
    data: new SlashCommandBuilder()
        .setName(`count`)
        .setDescription(`Count to infinity!`)
        .addSubcommand(subCommand =>
            subCommand.setName("channel").setDescription("Set the count channel")
                .addChannelOption(option =>
                    option.setName("channel").setDescription("The channel you want as the counting channel").setRequired(true)))
        .addSubcommand(subCommand =>
            subCommand.setName("current").setDescription("Display the current count")),
    async execute(interaction, client) {
        if (interaction.options.getSubcommand() === "channel") {
            const channel = interaction.options.getChannel("channel")

            if (channel.type !== "GUILD_TEXT") {
                const embed = new Discord.MessageEmbed()
                    .setAuthor(interaction.user.username, interaction.user.displayAvatarURL())
                    .setDescription(`${config.crossEmoji} Im afraid the channel needs to be a text channel`)
                    .setColor(config.ErrorHexColor)
                    .setFooter(`Made by Zofux`)
                return interaction.editReply({ embeds: [embed], ephemeral: true })
            } else if (channel.type === "GUILD_TEXT") {
                await db.findOneAndUpdate({ guildId: interaction.guild.id }, {
                    guildId: interaction.guild.id,
                    count: 0,
                    channelId: channel.id
                }, {
                    upsert: true,
                    new: true
                }).then(async () => {
                    const countingEmbed = new Discord.MessageEmbed()
                        .setDescription(`This is now the current counting channel, the current count is **0**`)
                        .setColor(config.MainHexColor)
                        .setAuthor(interaction.user.username, interaction.user.displayAvatarURL())
                        .setFooter("Made by Zofux")
                        .setTimestamp()
                    channel.send({ embeds: [countingEmbed] })

                    const SuccessEmbed = new Discord.MessageEmbed()
                        .setDescription(`${config.checkEmoji} Successfully set the counting channel to <#${channel.id}>`)
                        .setColor(config.SuccessHexColor)
                        .setAuthor(interaction.user.username, interaction.user.displayAvatarURL())
                        .setFooter("Made by Zofux")
                        .setTimestamp()
                    return await interaction.editReply({ embeds: [SuccessEmbed], ephemeral: true })
                })
            }
        }
    }
}