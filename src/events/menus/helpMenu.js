const Discord = require('discord.js')
const config = require('../../../config.json')

module.exports = async (interaction, client) => {
    if (interaction.customId === 'select') {
        if (interaction.values.includes("information")) {
            const embed = new Discord.MessageEmbed()
            .setAuthor(`${client.user.username} - Commands [Information]`, client.user.displayAvatarURL())
            .setColor(config.MainHexColor)
            .setDescription()
            .setFooter("Made by Zofux")

        await interaction.update({ embeds: [embed]})
        }

        if (interaction.values.includes("moderation")) {
        const embed = new Discord.MessageEmbed()
            .setAuthor(`${client.user.username} - Commands [Moderation]`, client.user.displayAvatarURL())
            .setColor(config.MainHexColor)
            .setDescription()
            .setFooter("Made by Zofux")

        await interaction.editReply({ embeds: [embed], ephemeral: true })
    }

    if (interaction.values.includes("music")) {
        const embed = new Discord.MessageEmbed()
            .setAuthor(`${client.user.username} - Commands [Musci]`, client.user.displayAvatarURL())
            .setColor(config.MainHexColor)
            .setDescription()
            .setFooter("Made by Zofux")

        await interaction.editReply({ embeds: [embed], ephemeral: true })
    }

    if (interaction.values.includes("voice_channels")) {
        const embed = new Discord.MessageEmbed()
            .setAuthor(`${client.user.username} - Commands [Information]`, client.user.displayAvatarURL())
            .setColor(config.MainHexColor)
            .setDescription()
            .setFooter("Made by Zofux")

        await interaction.editReply({ embeds: [embed], ephemeral: true })
    }

    if (interaction.values.includes("suggestions")) {
        const embed = new Discord.MessageEmbed()
            .setAuthor(`${client.user.username} - Commands [suggestions]`, client.user.displayAvatarURL())
            .setColor(config.MainHexColor)
            .setDescription()
            .setFooter("Made by Zofux")

        await interaction.editReply({ embeds: [embed], ephemeral: true })
    }
    }

   
}