module.exports = (interaction, client) => {
    if (interaction.customId === 'information') {

        const embed = new Discord.MessageEmbed()
        .setAuthor(`${client.user.username} - Commands [Information]`, client.user.displayAvatarURL())
        .setColor(config.MainHexColor)
        .setDescription()
        .setFooter("Made by Zofux")

        await interaction.update({ embeds: [embed] })
    }

    if (interaction.customId === 'moderation') {

        const embed = new Discord.MessageEmbed()
        .setAuthor(`${client.user.username} - Commands [Moderation]`, client.user.displayAvatarURL())
        .setColor(config.MainHexColor)
        .setDescription()
        .setFooter("Made by Zofux")

        await interaction.update({ embeds: [embed] })
    }

    if (interaction.customId === 'music') {

        const embed = new Discord.MessageEmbed()
        .setAuthor(`${client.user.username} - Commands [Musci]`, client.user.displayAvatarURL())
        .setColor(config.MainHexColor)
        .setDescription()
        .setFooter("Made by Zofux")

        await interaction.update({ embeds: [embed] })
    }

    if (interaction.customId === 'voice_channels') {

        const embed = new Discord.MessageEmbed()
        .setAuthor(`${client.user.username} - Commands [Information]`, client.user.displayAvatarURL())
        .setColor(config.MainHexColor)
        .setDescription()
        .setFooter("Made by Zofux")

        await interaction.update({ embeds: [embed] })
    }

    if (interaction.customId === 'suggestions') {

        const embed = new Discord.MessageEmbed()
        .setAuthor(`${client.user.username} - Commands [suggestions]`, client.user.displayAvatarURL())
        .setColor(config.MainHexColor)
        .setDescription()
        .setFooter("Made by Zofux")

        await interaction.update({ embeds: [embed] })
    }
}