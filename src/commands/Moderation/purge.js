const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js')
const config = require(`../../../config.json`)

module.exports = {
    data: new SlashCommandBuilder()
        .setName(`purge`)
        .setDescription(`Delete up to 300 messages at once`)
        .addNumberOption(option =>
            option.setName(`amount`).setDescription(`The amount of messages you want to delete`).setRequired(true)),
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

        const amount = interaction.options.getNumber("amount")

        if (amount <= 100) {
            interaction.channel.bulkDelete(amount, true).then(() => {
                if (doLog) {
                    const logEmbed = new Discord.MessageEmbed()
                        .setColor(config.MainHexColor)
                        .addFields([
                            { name: 'Channel', value: `<#${channel.id}>`, inline: true },
                            { name: 'Amount', value: `\`${amount}\` messages` },
                            { name: 'Moderator', value: `${interaction.user.username}#${interaction.user.discriminator}`, inline: true },
                        ])
                        .setAuthor(`Purge | ${interaction.user.username}#${interaction.user.discriminator}`)
                        .setFooter(interaction.guild.name)
                        .setTimestamp()
                    logChannel.send({ embeds: [logEmbed] });
                }

                const embed = new Discord.MessageEmbed()
                    .setDescription(`${config.checkEmoji} Successfully **purged** \`${amount}\` messages`)
                    .setColor(config.SuccessHexColor)
                    .setAuthor(interaction.user.username, interaction.user.displayAvatarURL())
                    .setFooter(interaction.guild.name)
                    .setTimestamp()
                return await interaction.editReply({ embeds: [embed] })
            })
        } else if (amount <= 200) {
            interaction.channel.bulkDelete(100, true)
            let left = amount - 100
            setTimeout(async () => {
                interaction.channel.bulkDelete(left, true).then(async () => {
                    if (doLog) {
                        const logEmbed = new Discord.MessageEmbed()
                            .setColor(config.MainHexColor)
                            .addFields([
                                { name: 'Channel', value: `<#${channel.id}>`, inline: true },
                                { name: 'Amount', value: `\`${amount}\` messages` },
                                { name: 'Moderator', value: `${interaction.user.username}#${interaction.user.discriminator}`, inline: true },
                            ])
                            .setAuthor(`Purge | ${interaction.user.username}#${interaction.user.discriminator}`)
                            .setFooter(interaction.guild.name)
                            .setTimestamp()
                        logChannel.send({ embeds: [logEmbed] });
                    }

                    const embed = new Discord.MessageEmbed()
                        .setDescription(`${config.checkEmoji} Successfully **purged** \`${amount}\` messages`)
                        .setColor(config.SuccessHexColor)
                        .setAuthor(interaction.user.username, interaction.user.displayAvatarURL())
                        .setFooter(interaction.guild.name)
                        .setTimestamp()
                    return await interaction.editReply({ embeds: [embed] })
                })
            }, 2000)
        } else if (amount <= 300) {
            interaction.channel.bulkDelete(100, true)
            setTimeout(() => {
                interaction.channel.bulkDelete(100, true)
            }, 2000)

            let left = amount - 200
            setTimeout(async () => {
                interaction.channel.bulkDelete(left, true).then(async () => {
                    if (doLog) {
                        const logEmbed = new Discord.MessageEmbed()
                            .setColor(config.MainHexColor)
                            .addFields([
                                { name: 'Channel', value: `<#${channel.id}>`, inline: true },
                                { name: 'Amount', value: `\`${amount}\` messages` },
                                { name: 'Moderator', value: `${interaction.user.username}#${interaction.user.discriminator}`, inline: true },
                            ])
                            .setAuthor(`Purge | ${interaction.user.username}#${interaction.user.discriminator}`)
                            .setFooter(interaction.guild.name)
                            .setTimestamp()
                        logChannel.send({ embeds: [logEmbed] });
                    }

                    const embed = new Discord.MessageEmbed()
                        .setDescription(`${config.checkEmoji} Successfully **purged** \`${amount}\` messages`)
                        .setColor(config.SuccessHexColor)
                        .setAuthor(interaction.user.username, interaction.user.displayAvatarURL())
                        .setFooter(interaction.guild.name)
                        .setTimestamp()
                    return await interaction.editReply({ embeds: [embed] })


                }, 2000)
            })
        }
    }
}