const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js')
const config = require(`../../../config.json`)
const ms = require("ms")

module.exports = {
    data: new SlashCommandBuilder()
        .setName(`slowmode`)
        .setDescription(`change the slowmode in a channel`)
        .addChannelOption(option =>
            option.setName(`channel`).setDescription(`The channel the slowmode should get changed in`).setRequired(true))
        .addStringOption(option =>
            option.setName(`slowmode`).setDescription(`The new slowmode (ex: 3h)`).setRequired(true)),
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true })

        const logs = require('../../models/logChannels')
        const log = await logs.findOne({ guildId: interaction.guild.id })
        let doLog = false
        let logChannel;
        if (log) {
            doLog = true
        }
        if (doLog) {
            logChannel = interaction.guild.channels.cache.get(log.channelId)
            if (!logChannel) doLog = false
        }



        const rawTime = interaction.options.getString(`slowmode`)
        const channel = interaction.options.getChannel(`channel`)

        if (channel.type !== "GUILD_TEXT") {
            const embed = new Discord.MessageEmbed()
                .setAuthor(interaction.user.username, interaction.user.displayAvatarURL())
                .setDescription(`${config.crossEmoji} Im afraid the channel needs to be a text channel`)
                .setColor(config.ErrorHexColor)
                .setFooter(`Made by Zofux`)
            return interaction.editReply({ embeds: [embed], ephemeral: true })
        } else if (channel.type === "GUILD_TEXT") {

            if (!interaction.member.permissions.has(Discord.Permissions.FLAGS.MANAGE_CHANNELS)) {
                const embed = new Discord.MessageEmbed()
                    .setDescription(`${config.crossEmoji} You can't use this command`)
                    .setColor(config.ErrorHexColor)
                    .setAuthor(interaction.user.username, interaction.user.displayAvatarURL())
                    .setFooter(interaction.guild.name)
                    .setTimestamp()
                return interaction.editReply({ embeds: [embed], ephemeral: true })
            }

            const time = (ms(rawTime)) / 1000

            if (time > 21600 || time < 0) {
                const embed = new Discord.MessageEmbed()
                    .setAuthor(`No log channel`)
                    .setDescription(`${config.crossEmoji} Can only set the slowmode between 0 and 6 hours`)
                    .setColor(config.ErrorHexColor)
                    .setFooter(`Made by Zofux`)
                return interaction.editReply({ embeds: [embed], ephemeral: true })
            }

            await channel.setRateLimitPerUser(time).then(async () => {
                if (doLog) {
                    const logEmbed = new Discord.MessageEmbed()
                        .setColor(config.MainHexColor)
                        .addFields([
                            { name: 'Channel', value: `<#${channel.id}>`, inline: true },
                            { name: 'New slowmode', value: `\`${time}\` seconds` },
                            { name: 'Moderator', value: `${interaction.user.username}#${interaction.user.discriminator}`, inline: true },
                        ])
                        .setAuthor(`Slowmode | ${interaction.user.username}#${interaction.user.discriminator}`)
                        .setFooter(interaction.guild.name)
                        .setTimestamp()
                    logChannel.send({ embeds: [logEmbed] });
                }

                const embed = new Discord.MessageEmbed()
                    .setDescription(`${config.checkEmoji} Successfully set the slowmode in <#${channel.id}> to **${time}** seconds`)
                    .setColor(config.SuccessHexColor)
                    .setAuthor(interaction.user.username, interaction.user.displayAvatarURL())
                    .setFooter("Made by Zofux")
                    .setTimestamp()
                await interaction.editReply({ embeds: [embed] })
            });
        }

    }
}