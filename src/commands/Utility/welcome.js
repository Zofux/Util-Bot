const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js')
const config = require(`../../../config.json`)
const db = require('../../models/welcome')

module.exports = {
    data: new SlashCommandBuilder()
        .setName(`welcome`)
        .setDescription(`Setup a welcome system for your members`)
        .addSubcommand(subCommand =>
            subCommand.setName("message").setDescription("Make the bot send a simple text message when someone joins the server")
                .addChannelOption(option =>
                    option.setName("channel").setDescription("The channel you want to send welcome messages to").setRequired(true))
                .addStringOption(option =>
                    option.setName("content").setDescription("The content of the message").setRequired(true)))
        .addSubcommand(subCommand =>
            subCommand.setName("embed").setDescription("Make the bot send an embed when someone joins the server")
                .addChannelOption(option =>
                    option.setName("channel").setDescription("The channel you want to send welcome embeds to").setRequired(true))
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
                    option.setName("image").setDescription("The image of the embed (leave empty for no image)"))),
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true })

        if (interaction) {
            const channel = interaction.options.getChannel("channel")
            if (channel.type !== "GUILD_TEXT") {
                const embed = new Discord.MessageEmbed()
                    .setAuthor(interaction.user.username, interaction.user.displayAvatarURL())
                    .setDescription(`${config.crossEmoji} Im afraid the channel needs to be a text channel`)
                    .setColor(config.ErrorHexColor)
                    .setFooter(`Made by Zofux`)
                return interaction.editReply({ embeds: [embed], ephemeral: true })
            } else if (channel.type === "GUILD_TEXT") {

                if (interaction.options.getSubcommand() === "message") {
                    const content = interaction.options.getString("content")
                    if (content.length > 2500) {
                        const embed = new Discord.MessageEmbed()
                            .setAuthor(interaction.user.username, interaction.user.displayAvatarURL())
                            .setDescription(`${config.crossEmoji} The content of the message cannot be longer than **2500** characters`)
                            .setColor(config.ErrorHexColor)
                            .setFooter(`Made by Zofux`)
                        return interaction.editReply({ embeds: [embed], ephemeral: true })
                    }


                    const res = await db.findOne({ guildId: interaction.guild.id })
                    if (res) {
                        await db.findOneAndDelete({ guildId: interaction.guild.id }).then(async () => {
                            new db({
                                guildId: interaction.guild.id,
                                channelId: channel.id,
                                content: content,
                                embed: false,
                            }).save().then(async () => {
                                const embed = new Discord.MessageEmbed()
                                    .setAuthor(interaction.user.username, interaction.user.displayAvatarURL())
                                    .setDescription(`${config.checkEmoji} The **welcome message** has been updated`)
                                    .setColor(config.SuccessHexColor)
                                    .setFooter(`Made by Zofux`)
                                return interaction.editReply({ embeds: [embed], ephemeral: true })
                            })
                        })
                    } else if (!res) {
                        new db({
                            guildId: interaction.guild.id,
                            channelId: channel.id,
                            content: content,
                            embed: false,
                        }).save().then(async () => {
                            const embed = new Discord.MessageEmbed()
                                .setAuthor(interaction.user.username, interaction.user.displayAvatarURL())
                                .setDescription(`${config.checkEmoji} The **welcome message** has been updated`)
                                .setColor(config.SuccessHexColor)
                                .setFooter(`Made by Zofux`)
                            return interaction.editReply({ embeds: [embed], ephemeral: true })
                        })
                    }
                } else if (interaction.options.getSubcommand() === "embed") {
                    const color = interaction.options.getString("color")
                    const footer = interaction.options.getString("footer")
                    const title = interaction.options.getString("title")
                    const thumbnail = interaction.options.getString("thumbnail")
                    const image = interaction.options.getString("image")
                    const timestamp = interaction.options.getBoolean("timestamp")

                    const content = interaction.options.getString("content")
                    if (content.length > 2500) {
                        const embed = new Discord.MessageEmbed()
                            .setAuthor(interaction.user.username, interaction.user.displayAvatarURL())
                            .setDescription(`${config.crossEmoji} The content of the embed cannot be longer than **2500** characters`)
                            .setColor(config.ErrorHexColor)
                            .setFooter(`Made by Zofux`)
                        return interaction.editReply({ embeds: [embed], ephemeral: true })
                    }

                    if (!isHexcolor(color)) {
                        const embed = new Discord.MessageEmbed()
                            .setDescription(`${config.crossEmoji} Make sure the color is a valid [Hexcolor](https://htmlcolorcodes.com/color-picker/)`)
                            .setColor(config.ErrorHexColor)
                            .setAuthor(interaction.user.username, interaction.user.displayAvatarURL())
                            .setFooter("Made by Zofux")
                            .setTimestamp()
                        return interaction.editReply({ embeds: [embed], ephemeral: true })
                    }

                    const res = await db.findOne({ guildId: interaction.guild.id })
                    if (res) {
                        await db.findOneAndDelete({ guildId: interaction.guild.id }).then(async () => {
                            new db({
                                guildId: interaction.guild.id,
                                channelId: channel.id,
                                content: content,
                                embed: true,
                                color: color,
                                timestamp: timestamp,
                                footer: footer,
                                title: title,
                                thumbnail: thumbnail,
                                image: image
                            }).save().then(async () => {
                                const embed = new Discord.MessageEmbed()
                                    .setAuthor(interaction.user.username, interaction.user.displayAvatarURL())
                                    .setDescription(`${config.checkEmoji} The **welcome embed** has been updated`)
                                    .setColor(config.SuccessHexColor)
                                    .setFooter(`Made by Zofux`)
                                return interaction.editReply({ embeds: [embed], ephemeral: true })
                            })
                        })
                    } else if (!res) {
                        new db({
                            guildId: interaction.guild.id,
                            channelId: channel.id,
                            content: content,
                            embed: true,
                            color: color,
                            timestamp: timestamp,
                            footer: footer,
                            title: title,
                            thumbnail: thumbnail,
                            image: image
                        }).save().then(async () => {
                            const embed = new Discord.MessageEmbed()
                                .setAuthor(interaction.user.username, interaction.user.displayAvatarURL())
                                .setDescription(`${config.checkEmoji} The **welcome embed** has been updated`)
                                .setColor(config.SuccessHexColor)
                                .setFooter(`Made by Zofux`)
                            return interaction.editReply({ embeds: [embed], ephemeral: true })
                        })
                    }
                }
            }


        }
    }
}