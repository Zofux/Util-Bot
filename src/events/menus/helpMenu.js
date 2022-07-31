const Discord = require('discord.js')
const config = require('../../../config.json')

module.exports = async (interaction, client) => {
    if (interaction.customId === 'select') {
        console.log(interaction)
        if (interaction.value === "information") {
            const embed = new Discord.MessageEmbed()
            .setAuthor(`${client.user.username} - Commands [Information]`, client.user.displayAvatarURL())
            .setColor(config.MainHexColor)
            .setDescription()
            .setFooter("Made by Zofux")

        await interaction.update({ embeds: [embed]})
        }

        if (interaction.value === 'moderation') {

        const embed = new Discord.MessageEmbed()
            .setAuthor(`${client.user.username} - Commands [Moderation]`, client.user.displayAvatarURL())
            .setColor(config.MainHexColor)
            .setDescription()
            .setFooter("Made by Zofux")

        await interaction.editReply({ embeds: [embed], ephemeral: true })
    }

    if (interaction.value === 'music') {

        const embed = new Discord.MessageEmbed()
            .setAuthor(`${client.user.username} - Commands [Musci]`, client.user.displayAvatarURL())
            .setColor(config.MainHexColor)
            .setDescription()
            .setFooter("Made by Zofux")

        await interaction.editReply({ embeds: [embed], ephemeral: true })
    }

    if (interaction.value === 'voice_channels') {

        const embed = new Discord.MessageEmbed()
            .setAuthor(`${client.user.username} - Commands [Information]`, client.user.displayAvatarURL())
            .setColor(config.MainHexColor)
            .setDescription()
            .setFooter("Made by Zofux")

        await interaction.editReply({ embeds: [embed], ephemeral: true })
    }

    if (interaction.value === 'suggestions') {

        const embed = new Discord.MessageEmbed()
            .setAuthor(`${client.user.username} - Commands [suggestions]`, client.user.displayAvatarURL())
            .setColor(config.MainHexColor)
            .setDescription()
            .setFooter("Made by Zofux")

        await interaction.editReply({ embeds: [embed], ephemeral: true })
    }
    }

   
}