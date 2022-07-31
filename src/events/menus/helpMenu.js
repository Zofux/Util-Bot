const Discord = require('discord.js')
const config = require('../../../config.json')

module.exports = async (interaction, client) => {
    if (interaction.customId === 'select') {
        if (interaction.values === "information") {
            const embed = new Discord.MessageEmbed()
            .setAuthor(`${client.user.username} - Commands [Information]`, client.user.displayAvatarURL())
            .setColor(config.MainHexColor)
            .setDescription()
            .setFooter("Made by Zofux")

        await interaction.update({ embeds: [embed]})
        }

        if (interaction.values === 'moderation') {

        const embed = new Discord.MessageEmbed()
            .setAuthor(`${client.user.username} - Commands [Moderation]`, client.user.displayAvatarURL())
            .setColor(config.MainHexColor)
            .setDescription()
            .setFooter("Made by Zofux")

        await interaction.editReply({ embeds: [embed], ephemeral: true })
    }

    if (interaction.values === 'music') {

        const embed = new Discord.MessageEmbed()
            .setAuthor(`${client.user.username} - Commands [Musci]`, client.user.displayAvatarURL())
            .setColor(config.MainHexColor)
            .setDescription()
            .setFooter("Made by Zofux")

        await interaction.editReply({ embeds: [embed], ephemeral: true })
    }

    if (interaction.values === 'voice_channels') {

        const embed = new Discord.MessageEmbed()
            .setAuthor(`${client.user.username} - Commands [Information]`, client.user.displayAvatarURL())
            .setColor(config.MainHexColor)
            .setDescription()
            .setFooter("Made by Zofux")

        await interaction.editReply({ embeds: [embed], ephemeral: true })
    }

    if (interaction.values === 'suggestions') {

        const embed = new Discord.MessageEmbed()
            .setAuthor(`${client.user.username} - Commands [suggestions]`, client.user.displayAvatarURL())
            .setColor(config.MainHexColor)
            .setDescription()
            .setFooter("Made by Zofux")

        await interaction.editReply({ embeds: [embed], ephemeral: true })
    }
    }

   
}