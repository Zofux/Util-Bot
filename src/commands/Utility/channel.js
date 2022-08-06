const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js')
const config = require(`../../../config.json`)
const db = require('../../models/verificationChannels')

module.exports = {
    data: new SlashCommandBuilder()
        .setName(`channel`)
        .setDescription(`Set the verification channel`)
        .addSubcommand(subCommand =>
            subCommand.setName("verification").setDescription("Set the verification channel").addChannelOption(option =>
                option.setName("channel").setDescription("The channel you want as the verification channel").setRequired(true))),
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true })

        if (interaction) {
            if (interaction.options.getSubcommand() === "verification") {
                const channel = interaction.options.getChannel("channel")

                if (channel.type !== "GUILD_TEXT") {
                    const embed = new Discord.MessageEmbed()
                        .setAuthor(interaction.user.username, interaction.user.displayAvatarURL())
                        .setDescription(`${config.crossEmoji} Im afraid the channel needs to be a text channel`)
                        .setColor(config.ErrorHexColor)
                        .setFooter(`Made by Zofux`)
                    return interaction.editReply({ embeds: [embed], ephemeral: true })
                } else if (channel.type === "GUILD_TEXT") {
                    const res = await db.findOne({ guildId: interaction.guild.id })
                    if (!res) {
                        new db({
                            guildId: interaction.guild.id,
                            channelId: channel.id
                        }).save().then(async () => {
                            const logEmbed = new Discord.MessageEmbed()
                                .setDescription(`This is now the current verification channel`)
                                .setColor(config.MainHexColor)
                                .setAuthor(interaction.user.username, interaction.user.displayAvatarURL())
                                .setFooter("Made by Zofux")
                                .setTimestamp()
                            channel.send({ embeds: [logEmbed] })

                            const SuccessEmbed = new Discord.MessageEmbed()
                                .setDescription(`${config.checkEmoji} Successfully set the verification channel to <#${channel.id}>`)
                                .setColor(config.SuccessHexColor)
                                .setAuthor(interaction.user.username, interaction.user.displayAvatarURL())
                                .setFooter("Made by Zofux")
                                .setTimestamp()
                            return await interaction.editReply({ embeds: [SuccessEmbed], ephemeral: true })
                        })
                    } else if (res) {
                        await db.findOneAndUpdate({
                            guildId: interaction.guild.id
                        }, {
                            $set: { channelId: channel.id }
                        }, {
                            upsert: true
                        }).then(async () => {
                            const logEmbed = new Discord.MessageEmbed()
                                .setDescription(`This is now the current verification channel`)
                                .setColor(config.MainHexColor)
                                .setAuthor(interaction.user.username, interaction.user.displayAvatarURL())
                                .setFooter("Made by Zofux")
                                .setTimestamp()
                            channel.send({ embeds: [logEmbed] })

                            const SuccessEmbed = new Discord.MessageEmbed()
                                .setDescription(`${config.checkEmoji} Successfully updated the verification channel to <#${channel.id}>`)
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
    }
}