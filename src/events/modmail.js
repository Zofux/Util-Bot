const Discord = require('discord.js')
const db = require('../models/captchas')
const config = require("../../config.json")

module.exports = {
    name: 'messageCreate',
    async execute(message, client) {
        if (message.author.bot) return;

        if (message.guild) {
            const member = message.guild.members.cache.get(message.channel.name)
            if (!member) {
                const embed = new Discord.MessageEmbed()
                    .setDescription(`${config.crossEmoji} That user isn't in this server`)
                    .setColor(config.ErrorHexColor)
                    .setAuthor(interaction.user.username, interaction.user.displayAvatarURL())
                    .setFooter(interaction.guild.name)
                    .setTimestamp()
                return interaction.editReply({ embeds: [embed], ephemeral: true })
            }

            const mail = new Discord.MessageEmbed()
                .setAuthor(message.author.username, message.author.displayAvatarURL())
                .setThumbnail(message.author.displayAvatarURL())
                .setColor(config.MainHexColor)
                .setDescription(message.content)
            member.send({ embeds: [mail] }).then(async () => {
                await message.delete()
            })

        } else if (!message.guild) {
            const guild = client.guilds.cache.get(config.guild)
            const channel = guild.channels.cache.find(c => c.name === message.author.id)

            if (!channel) {
                const embed = new Discord.MessageEmbed()
                    .setAuthor(client.user.username, client.user.displayAvatarURL())
                    .setThumbnail(client.user.displayAvatarURL())
                    .setColor(config.MainHexColor)
                    .setDescription("Thank you for your message, our staff team will be with you shortly. Please send any additional details that could issue")
                message.author.send({ embeds: [embed] }).then(async () => {
                    client.guilds.cache.get(config.guild).channels.create(message.author.id, {
                        type: 'GUILD_TEXT',
                        parent: config.modMailCategoryId,
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
                    }).then((mailChannel) => {
                        const mail = new Discord.MessageEmbed()
                            .setAuthor(message.author.username, message.author.displayAvatarURL())
                            .setThumbnail(message.author.displayAvatarURL())
                            .setColor(config.MainHexColor)
                            .setDescription(message.content)
                        mailChannel.send({ embeds: [mail] })
                    })
                })
            } else if (channel) {
                const embed = new Discord.MessageEmbed()
                    .setAuthor(client.user.username, client.user.displayAvatarURL())
                    .setThumbnail(client.user.displayAvatarURL())
                    .setColor(config.MainHexColor)
                    .setDescription("Your message has been sent")
                message.author.send({ embeds: [embed] }).then(() => {
                    const mail = new Discord.MessageEmbed()
                        .setAuthor(message.author.username, message.author.displayAvatarURL())
                        .setThumbnail(message.author.displayAvatarURL())
                        .setColor(config.MainHexColor)
                        .setDescription(message.content)
                    channel.send({ embeds: [mail] })
                })

            }
        }

    }
}