const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js')
const config = require("../../../config.json")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("warnings")
        .setDescription("Get a list over all the warnings a user has")
        .addUserOption(option =>
            option.setName("user").setDescription("The user you want the warnings for (Leave empty for your own)").setRequired(false)),
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true })
        const user = interaction.options.getUser("user")
        const target = interaction.options.getMember("user")
        const db = require('../../models/infractions')

        if (!user) {

            const res = await db.findOne({ guildId: interaction.guild.id, userId: interaction.user.id })
            if (!res) {
                const embed = new Discord.MessageEmbed()
                    .setDescription(`<:cross:896045962940780555> <@${interaction.user.id}>, you don't have any warnings at this time`)
                    .setColor("#ff7575")
                    .setAuthor(interaction.user.username, interaction.user.displayAvatarURL())
                    .setFooter(interaction.guild.name)
                    .setTimestamp()
                return interaction.editReply({ embeds: [embed], ephemeral: true })
            } else {
                const embed = new Discord.MessageEmbed()
                    .setDescription(`All punishments for <@${interaction.user.id}>` + res.infractions.map(warning => `\n\n**ID: \`${warning.id}\` | Moderator: \`${warning.moderator}\`**\n **${warning.type} - ** ${warning.reason} - <t:${warning.date}:R>`))
                    .setColor("#5999ff")
                    .setAuthor(interaction.user.username, interaction.user.displayAvatarURL())
                    .setFooter(interaction.guild.name)
                    .setTimestamp()
                return interaction.editReply({ embeds: [embed], ephemeral: true })
            }

        } else if (user) {
            if (interaction.guild.roles.cache.get(config.moderatorRole).position > interaction.member.roles.highest.position) {
                const embed = new Discord.MessageEmbed()
                    .setDescription("<:cross:896045962940780555> Only **moderators** can check other users warnings")
                    .setColor("#ff7575")
                    .setAuthor(interaction.user.username, interaction.user.displayAvatarURL())
                    .setFooter(interaction.guild.name)
                    .setTimestamp()
                return interaction.editReply({ embeds: [embed], ephemeral: true })
            }

            const res = await db.findOne({ guildId: interaction.guild.id, userId: user.id })
            if (!res) {
                const embed = new Discord.MessageEmbed()
                    .setDescription(`<:cross:896045962940780555> <@${user.id}> Doesn't have any warnings at this time`)
                    .setColor("#ff7575")
                    .setAuthor(interaction.user.username, interaction.user.displayAvatarURL())
                    .setFooter(interaction.guild.name)
                    .setTimestamp()
                return interaction.editReply({ embeds: [embed], ephemeral: true })
            } else {
                const embed = new Discord.MessageEmbed()
                    .setDescription(`All punishments for <@${user.id}>` + res.infractions.map(warning => `\n\n**ID: \`${warning.id}\` | Moderator: \`${warning.moderator}\`**\n **${warning.type} - ** ${warning.reason} - <t:${warning.date}:R>`))
                    .setColor("#5999ff")
                    .setAuthor(user.username, user.displayAvatarURL())
                    .setFooter(interaction.guild.name)
                    .setTimestamp()
                return interaction.editReply({ embeds: [embed], ephemeral: true })
            }
        }
    },
}