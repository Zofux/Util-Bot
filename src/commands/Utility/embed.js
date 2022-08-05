const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js')
const config = require(`../../../config.json`)
const isHexcolor = require('is-hexcolor')


module.exports = {
    data: new SlashCommandBuilder()
        .setName(`embed`)
        .setDescription(`Make the bot send an embed in the current channel`)
        .addStringOption(option =>
            option.setName("content").setDescription("The content of the embed").setRequired(true))
        .addStringOption(option =>
            option.setName("color").setDescription("The color of the embed").setRequired(true))
        .addBooleanOption(option =>
            option.setName("timestamp").setDescription("Should the embed display a timestamp").setRequired(true))
        .addStringOption(option =>
            option.setName("footer").setDescription("The footer of the embed (Leave empty for no footer)"))
        .addStringOption(option =>
            option.setName("title").setDescription("The title of the embed (Leave empty for no title)"))
        .addStringOption(option =>
            option.setName("thumbnail").setDescription("The thumbnail of the embed (leave empty for no thumbnail)"))
        .addStringOption(option =>
            option.setName("image").setDescription("The image of the embed (leave empty for no image)")),
    async execute(interaction, client) {
        await interaction.deferReply({ ephemeral: true })

        if (!interaction.member.permissions.has(Discord.Permissions.FLAGS.MANAGE_GUILD)) {
            const embed = new Discord.MessageEmbed()
                .setDescription(`${config.crossEmoji} You can't use this command, you need the \`Manage Server\` permission`)
                .setColor(config.ErrorHexColor)
                .setAuthor(interaction.user.username, interaction.user.displayAvatarURL())
                .setFooter("Made by Zofux")
                .setTimestamp()
            return interaction.editReply({ embeds: [embed], ephemeral: true })
        }

        const content = interaction.options.getString("content")
        const color = interaction.options.getString("color")
        const footer = interaction.options.getString("footer")
        const title = interaction.options.getString("title")
        const thumbnail = interaction.options.getString("thumbnail")
        const image = interaction.options.getString("image")
        const timestamp = interaction.options.getBoolean("timestamp")

        const embed = new Discord.MessageEmbed()

        embed.setDescription(content)

        if (!isHexcolor(color)) {
            const embed = new Discord.MessageEmbed()
                .setDescription(`${config.crossEmoji} Make sure the color is a valid [Hexcolor](https://htmlcolorcodes.com/color-picker/)`)
                .setColor(config.ErrorHexColor)
                .setAuthor(interaction.user.username, interaction.user.displayAvatarURL())
                .setFooter("Made by Zofux")
                .setTimestamp()
            return interaction.editReply({ embeds: [embed], ephemeral: true })
        }

        embed.setColor(color)

        if (footer) {
            embed.setFooter(footer)
        }
        if (thumbnail) {
            embed.setThumbnail(thumbnail)
        }
        if (image) {
            embed.setImage(image)
        }
        if (title) {
            embed.setAuthor(title)
        }
        if (timestamp) embed.setTimestamp()

        await interaction.channel.send({ embeds: [embed] }).then(async () => {
            const confirmEmbed = new Discord.MessageEmbed()
                .setAuthor(`Embed Sent`)
                .setDescription(`${config.checkEmoji} I've created and sent your embed in the current channel`)
                .setColor(config.SuccessHexColor)
                .setFooter(`Made by Zofux`)
            return await interaction.editReply({ embeds: [confirmEmbed], ephemeral: true })
        })
    }
}