const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js')
const config = require("../../../config.json")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("clearwarns")
        .setDescription("Remove all warnings from a user")
        .addUserOption(option =>
            option.setName("user").setDescription("The user that should get their warnings removed").setRequired(true)),
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true })
        const user = interaction.options.getUser("user")

        if (interaction.guild.roles.cache.get(config.moderatorRole).position > interaction.member.roles.highest.position) {
            const embed = new Discord.MessageEmbed()
                .setDescription("<:cross:896045962940780555> You can't use this command")
                .setColor("#ff7575")
                .setAuthor(interaction.user.username, interaction.user.displayAvatarURL())
                .setFooter(interaction.guild.name)
                .setTimestamp()
            return interaction.editReply({ embeds: [embed], ephemeral: true })
        }

        const db = require('../../models/infractions')
        const res = await db.findOne({ guildId: interaction.guild.id, userId: user.id })
        if (!res) {
            const embed = new Discord.MessageEmbed()
                .setDescription(`<:cross:896045962940780555> <@${user.id}> doesn't have any warnings to remove`)
                .setColor("#ff7575")
                .setAuthor(interaction.user.username, interaction.user.displayAvatarURL())
                .setFooter(interaction.guild.name)
                .setTimestamp()
            return interaction.editReply({ embeds: [embed], ephemeral: true })
        } else if (res) {
            await db.findOneAndDelete({ guildId: interaction.guild.id, userId: user.id }).then(async () => {
                const embed = new Discord.MessageEmbed()
                    .setDescription(`<:check:896045976039608320> Successfully **cleared** <@${user.id}>'s warnings`)
                    .setColor("#43d490")
                    .setAuthor(interaction.user.username, interaction.user.displayAvatarURL())
                    .setFooter(interaction.guild.name)
                    .setTimestamp()
                await interaction.editReply({ embeds: [embed] })

                const logChannel = interaction.guild.channels.cache.get("896697011255017493")
                const logEmbed = new Discord.MessageEmbed()
                    .setColor("#43d490")
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