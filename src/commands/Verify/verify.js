const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("verify")
        .setDescription("Start the verification progress"),
    async execute(interaction, client) {
        await interaction.deferReply({ ephemeral: true })
        if (interaction.member.roles.cache.has("892756988335898634")) {
            const embed = new Discord.MessageEmbed()
                .setDescription("<:cross:896045962940780555> You are already verified")
                .setColor("#ff7575")
                .setAuthor(interaction.user.username, interaction.user.displayAvatarURL())
                .setFooter(interaction.guild.name)
                .setTimestamp()
            return await interaction.editReply({ embeds: [embed], ephemeral: true })
        }

        const db = require('../../models/captchas')
        const res = await db.findOne({ userId: interaction.user.id })
        if (res) {
            const embed = new Discord.MessageEmbed()
                .setDescription("<:cross:896045962940780555> You currently have a pending captcha")
                .setColor("#ff7575")
                .setAuthor(interaction.user.username, interaction.user.displayAvatarURL())
                .setFooter(interaction.guild.name)
                .setTimestamp()
            return await interaction.editReply({ embeds: [embed], ephemeral: true })
        } else if (!res) {
            const embed = new Discord.MessageEmbed()
                .setDescription(`<:check:896045976039608320> Starting a captcha in our dm's, if it doesn't work you need to open your dms`)
                .setColor("#43d490")
                .setAuthor(interaction.user.username, interaction.user.displayAvatarURL())
                .setFooter(interaction.guild.name)
                .setTimestamp()
            await interaction.editReply({ embeds: [embed] }).then(() => {
                require('../../events/captcha/captcha')(interaction.member, client)
            })
        }
    }
}