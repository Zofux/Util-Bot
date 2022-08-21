const Discord = require('discord.js')
const db = require('../models/modmail')
const config = require("../../config.json")
const applications = require("../models/currentApplications")

module.exports = {
    name: 'messageCreate',
    async execute(message, client) {
        if (message.author.bot) return;

        if (message.guild) {
            const res = await db.findOne({ guildId: message.guild.id, "mail.channelId": message.channel.id })
            if (!res) return;
            else if (res) {
                const array = await res.mail.filter(o => o.channelId === message.channel.id)
                const member = message.guild.members.cache.get(array[0].userId)

                if (!member) {
                    const embed = new Discord.MessageEmbed()
                        .setDescription(`${config.crossEmoji} The user that started this channel has left the server`)
                        .setColor(config.ErrorHexColor)
                        .setAuthor(message.author.username, message.author.displayAvatarURL())
                        .setFooter(message.guild.name)
                        .setTimestamp()
                    return message.reply({ embeds: [embed] })
                }

                const currentApplication = await applications.findOne({ userId: member.user.id })
                if (currentApplication) {
                    const embed = new Discord.MessageEmbed()
                        .setDescription(`${config.crossEmoji} <@${member.user.id}> currently have an active **${currentApplication.application} application** and therefore has there ModMail paused`)
                        .setColor(config.ErrorHexColor)
                        .setAuthor(message.author.username, message.author.displayAvatarURL())
                        .setFooter(message.guild.name)
                        .setTimestamp()
                    return message.reply({ embeds: [embed] })
                }

                const mail = new Discord.MessageEmbed()
                    .setAuthor(message.author.username, message.author.displayAvatarURL())
                    .setThumbnail(message.author.displayAvatarURL())
                    .setColor(config.MainHexColor)
                    .setDescription(message.content)
                member.send({ embeds: [mail] }).then(async () => {
                    await message.delete().then(() => {
                        message.channel.send({ embeds: [mail] })
                    })

                })
            }

        } else if (!message.guild) {
            const guild = client.guilds.cache.get(config.guild)
            const currentApplication = await applications.findOne({ userId: message.author.id })
            if (currentApplication) return;

            const res = await db.findOne({ guildId: guild.id, "mail.userId": message.author.id })

            if (!res) {
                const data = await db.findOne({ guildId: guild.id })
                if (!data) {
                    const embed = new Discord.MessageEmbed()
                        .setDescription(`${config.crossEmoji} **${guild.name}** has not setup the modmail system`)
                        .setColor(config.ErrorHexColor)
                        .setAuthor(message.author.username, message.author.displayAvatarURL())
                        .setFooter("Made by Zofux")
                        .setTimestamp()
                    return message.reply({ embeds: [embed] })
                }

                const embed = new Discord.MessageEmbed()
                    .setAuthor(client.user.username, client.user.displayAvatarURL())
                    .setThumbnail(client.user.displayAvatarURL())
                    .setColor(config.MainHexColor)
                    .setDescription("Thank you for your message, our staff team will be with you shortly. Please send any additional details that could issue")
                message.reply({ embeds: [embed] }).then(async () => {
                    client.guilds.cache.get(config.guild).channels.create(message.author.username, {
                        type: 'GUILD_TEXT',
                        parent: data.categoryId,
                        permissionOverwrites: [
                            {
                                id: config.guild,
                                deny: ["VIEW_CHANNEL"]
                            },
                            {
                                id: config.moderatorRole,
                                allow: ["VIEW_CHANNEL", "READ_MESSAGE_HISTORY", "SEND_MESSAGES"],
                            }
                        ]
                    }).then(async (mailChannel) => {
                        const Button = new Discord.MessageActionRow()
                            .addComponents(
                                new Discord.MessageButton()
                                    .setCustomId("close-mail")
                                    .setLabel("Close ModMail")
                                    .setStyle("DANGER")
                                    .setEmoji("📩")
                            )
                        const infoEmbed = new Discord.MessageEmbed()
                            .setAuthor(`ModMail-${message.author.username}`, message.author.displayAvatarURL())
                            .setDescription(
                                `**User:** <@${message.author.id}>\`(${message.author.id})\`\n` +
                                `*Click the button bellow to close the ModMail*`
                            )
                            .setColor(config.MainHexColor)

                        const mail = new Discord.MessageEmbed()
                            .setAuthor(message.author.username, message.author.displayAvatarURL())
                            .setThumbnail(message.author.displayAvatarURL())
                            .setColor(config.MainHexColor)
                            .setDescription(message.content)
                        mailChannel.send({ content: "@everyone", embeds: [infoEmbed], components: [Button] }).then(() => mailChannel.send({ embeds: [mail] }))

                        await db.findOneAndUpdate({
                            guildId: guild.id
                        }, {
                            $push: { mail: { userId: message.author.id, channelId: mailChannel.id } }
                        }, {
                            upsert: true
                        })
                    })
                })
            } else if (res) {
                const array = await res.mail.filter(o => o.userId === message.author.id)
                const channel = guild.channels.cache.get(array[0].channelId)
                if (!channel) {
                    await db.findOneAndUpdate({
                        guildId: guild.id, "mail.userId": message.author.id
                    }, {
                        $pull: { mail: { userId: message.author.id, channelId: array[0].channelId } }
                    }, {
                        upsert: true
                    }).then(async () => {
                        const embed = new Discord.MessageEmbed()
                            .setDescription(`${config.crossEmoji} It would look like your modmail channel has been deleted in **${guild.name}**, please **try again** while I sort things out.`)
                            .setColor(config.ErrorHexColor)
                            .setAuthor(message.author.username, message.author.displayAvatarURL())
                            .setFooter("Made by Zofux")
                            .setTimestamp()
                        return message.reply({ embeds: [embed] })
                    })
                } else if (channel) {
                    const mail = new Discord.MessageEmbed()
                        .setAuthor(message.author.username, message.author.displayAvatarURL())
                        .setThumbnail(message.author.displayAvatarURL())
                        .setColor(config.MainHexColor)
                        .setDescription(message.content)
                    channel.send({ embeds: [mail] }).then(() => {
                        const embed = new Discord.MessageEmbed()
                            .setAuthor(client.user.username, client.user.displayAvatarURL())
                            .setThumbnail(client.user.displayAvatarURL())
                            .setColor(config.MainHexColor)
                            .setDescription("Your message has been sent")
                        message.reply({ embeds: [embed] })
                    })
                }

            }
        }

    }
}