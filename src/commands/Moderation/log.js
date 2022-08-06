const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js')
const config = require(`../../../config.json`)
const db = require('../../models/logChannels')

module.exports = {
    data: new SlashCommandBuilder()
        .setName(`log`)
        .setDescription(`Setup a log channel in a server`)
        .addSubcommand(subCommand =>
            subCommand.setName("set")
                .setDescription("Setup a log channel in a server")
                .addChannelOption(option =>
                    option.setName("channel").setDescription("The channel you want as the log channel").setRequired(true)))
        .addSubcommand(subCommand =>
            subCommand.setName("display")
                .setDescription("Display the current log channel")),
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true })
        if (interaction) {
            if (!interaction.member.permissions.has(Discord.Permissions.FLAGS.MANAGE_GUILD)) {
                const embed = new Discord.MessageEmbed()
                    .setDescription(`${config.crossEmoji} You can't use this command`)
                    .setColor(config.ErrorHexColor)
                    .setAuthor(interaction.user.username, interaction.user.displayAvatarURL())
                    .setFooter(interaction.guild.name)
                    .setTimestamp()
                return interaction.editReply({ embeds: [embed], ephemeral: true })
            }

            if (interaction.options.getSubcommand() === "set") {
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
                            const SuccessEmbed = new Discord.MessageEmbed()
                                .setDescription(`${config.checkEmoji} Successfully set the log channel to <#${channel.id}>`)
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
                            const SuccessEmbed = new Discord.MessageEmbed()
                                .setDescription(`${config.checkEmoji} Successfully updated the log channel to <#${channel.id}>`)
                                .setColor(config.SuccessHexColor)
                                .setAuthor(interaction.user.username, interaction.user.displayAvatarURL())
                                .setFooter("Made by Zofux")
                                .setTimestamp()
                            return await interaction.editReply({ embeds: [SuccessEmbed], ephemeral: true })
                        })
                    }
                }
            } else if (interaction.options.getSubcommand() === "display") {
                const res = await db.findOne({ guildId: interaction.guild.id })
                if (!res) {
                    const embed = new Discord.MessageEmbed()
                        .setAuthor(interaction.user.username, interaction.user.displayAvatarURL())
                        .setDescription(`${config.crossEmoji} This server doesn't have a current channel`)
                        .setColor(config.ErrorHexColor)
                        .setFooter(`Made by Zofux`)
                    return interaction.editReply({ embeds: [embed], ephemeral: true })
                } else if (res) {
                    const channel = interaction.guild.channels.cache.get(res.channelId)
                    if (!channel) {
                        await db.findOneAndDelete({ guildId: interaction.guild.id }).then(() => {
                            const embed = new Discord.MessageEmbed()
                                .setAuthor(interaction.user.username, interaction.user.displayAvatarURL())
                                .setDescription(`${config.crossEmoji} This server doesn't have a current channel`)
                                .setColor(config.ErrorHexColor)
                                .setFooter(`Made by Zofux`)
                            return interaction.editReply({ embeds: [embed], ephemeral: true })
                        })

                    } else if (channel) {
                        const SuccessEmbed = new Discord.MessageEmbed()
                            .setDescription(`The current log channel in this server is <#${channel.id}>`)
                            .setColor(config.MainHexColor)
                            .setAuthor(interaction.user.username, interaction.user.displayAvatarURL())
                            .setFooter("Made by Zofux")
                            .setTimestamp()
                        return await interaction.editReply({ embeds: [SuccessEmbed], ephemeral: true })
                    }


                }
            }

        }
    }
}