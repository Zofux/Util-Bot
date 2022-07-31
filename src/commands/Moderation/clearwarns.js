const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js')
const config = require(`../../../config.json`)

module.exports = {
    data: new SlashCommandBuilder()
        .setName(`clearwarns`)
        .setDescription(`Remove all warnings from a user`)
        .addUserOption(option =>
            option.setName(`user`).setDescription(`The user that should get their warnings removed`).setRequired(true)),
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true })

        if (!config.log) {
            const embed = new Discord.MessageEmbed()
                .setAuthor(`No verify channel`)
                .setDescription(`${config.crossEmoji} I currently have no valid value for the \`log\` in my \`config.json\``)
                .addField("Valid format (in the config.json)", "```log: \"#ID of the Text channel\"```")
                .setColor(config.ErrorHexColor)
                .setFooter(`Made by Zofux`)
            return interaction.editReply({ embeds: [embed], ephemeral: true })
        } else if (config.log) {
            const logChannel = interaction.guild.channels.cache.get(config.log)
            if (!logChannel) {
                const embed = new Discord.MessageEmbed()
                    .setAuthor(`No log channel`)
                    .setDescription(`${config.crossEmoji} The given \`log\` in my \`config.json\` is not a channel in this server`)
                    .addField("Valid format (in the config.json)", "```log: \"#ID of the Text channel\"```")
                    .setColor(config.ErrorHexColor)
                    .setFooter(`Made by Zofux`)
                return interaction.editReply({ embeds: [embed], ephemeral: true })
            }
        }
        const user = interaction.options.getUser(`user`)

        if (interaction.guild.roles.cache.get(config.moderatorRole).position > interaction.member.roles.highest.position) {
            const embed = new Discord.MessageEmbed()
                .setDescription(`${config.crossEmoji} You can't use this command`)
                .setColor(config.ErrorHexColor)
                .setAuthor(interaction.user.username, interaction.user.displayAvatarURL())
                .setFooter(interaction.guild.name)
                .setTimestamp()
            return interaction.editReply({ embeds: [embed], ephemeral: true })
        }

        const db = require('../../models/infractions')
        const res = await db.findOne({ guildId: interaction.guild.id, userId: user.id })
        if (!res) {
            const embed = new Discord.MessageEmbed()
                .setDescription(`${config.crossEmoji} <@${user.id}> doesn't have any warnings to remove`)
                .setColor(config.ErrorHexColor)
                .setAuthor(interaction.user.username, interaction.user.displayAvatarURL())
                .setFooter(interaction.guild.name)
                .setTimestamp()
            return interaction.editReply({ embeds: [embed], ephemeral: true })
        } else if (res) {
            await db.findOneAndDelete({ guildId: interaction.guild.id, userId: user.id }).then(async () => {
                const embed = new Discord.MessageEmbed()
                    .setDescription(`${config.checkEmoji} Successfully **cleared** <@${user.id}>'s warnings`)
                    .setColor(config.SuccessHexColor)
                    .setAuthor(interaction.user.username, interaction.user.displayAvatarURL())
                    .setFooter(interaction.guild.name)
                    .setTimestamp()
                await interaction.editReply({ embeds: [embed] })

                const logChannel = interaction.guild.channels.cache.get(`896697011255017493`)
                const logEmbed = new Discord.MessageEmbed()
                    .setColor(config.SuccessHexColor)
                    .addFields([
                        { name: 'User', value: `${user.username}#${user.discriminator} (<@${user.id}>)`, inline: true },
                        { name: 'Moderator', value: `${interaction.user.username}#${interaction.user.discriminator}`, inline: true },
                    ])
                    .setAuthor(`Cleared Warnings | ${user.username}#${user.discriminator}`)
                    .setFooter(interaction.guild.name)
                    .setTimestamp()
                logChannel.send({ embeds: [logEmbed] });
            })
        }
    },
}