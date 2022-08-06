const db = require('../models/welcome')
const Discord = require('discord.js')
const config = require("../../config.json")

module.exports = {
    name: 'guildMemberAdd',
    async execute(member) {
        const res = await db.findOne({ guildId: member.guild.id })
        if (!res) return
        else if (res) {
            const channel = member.guild.channels.cache.get(res.channelId)
            if (!channel) {
                await db.findOneAndDelete({ guildId: member.guild.id })
            } else if (channel) {
                if (res.embed === false) {
                    let message = res.content;
                    message = message.replaceAll(`{user.username}`, member.user.username)
                    message = message.replaceAll(`{user.tag}`, `<@${member.user.id}>`)
                    message = message.replaceAll(`{user.discriminator}`, member.user.discriminator)
                    message = message.replaceAll(`{server.name}`, member.guild.name)
                    message = message.replaceAll(`{server.members}`, member.guild.memberCount)
                    channel.send({ content: message })
                } else if (res.embed === true) {
                    let embed = new Discord.MessageEmbed()
                    embed.setColor(res.color)

                    let description = res.content;
                    description = description.replaceAll(`{user.username}`, member.user.username)
                    description = description.replaceAll(`{user.tag}`, `<@${member.user.id}>`)
                    description = description.replaceAll(`{user.discriminator}`, member.user.discriminator)
                    description = description.replaceAll(`{server.name}`, member.guild.name)
                    description = description.replaceAll(`{server.members}`, member.guild.memberCount)
                    embed.setDescription(description)
                    if (res.timestamp) embed.setTimestamp()

                    if (res.title) {
                        let title = res.title;
                        title = title.replaceAll(`{user.username}`, member.user.username)
                        title = title.replaceAll(`{user.discriminator}`, member.user.discriminator)
                        title = title.replaceAll(`{server.name}`, member.guild.name)
                        title = title.replaceAll(`{server.members}`, member.guild.memberCount)
                        embed.setAuthor(title)
                    }

                    if (res.footer) {
                        let footer = res.footer;
                        footer = footer.replaceAll(`{user.username}`, member.user.username)
                        footer = footer.replaceAll(`{user.discriminator}`, member.user.discriminator)
                        footer = footer.replaceAll(`{server.name}`, member.guild.name)
                        footer = footer.replaceAll(`{server.members}`, member.guild.memberCount)
                        embed.setFooter(footer)
                    }

                    if (res.image) {
                        if (res.image === "{user.avatar}") embed.setImage(member.user.displayAvatarURL())
                        if (res.image === "{server.icon}") embed.setImage(member.guild.iconURL())
                        if (res.image === "{bot.avatar}") embed.setImage(client.user.displayAvatarURL())
                    }

                    if (res.thumbnail) {
                        if (res.thumbnail === "{user.avatar}") embed.setThumbnail(member.user.displayAvatarURL())
                        if (res.thumbnail === "{server.icon}") embed.setThumbnail(member.guild.iconURL())
                        if (res.thumbnail === "{bot.avatar}") embed.setThumbnail(client.user.displayAvatarURL())
                    }

                    await channel.send({ embeds: [embed] })
                }
            }

        }
    }
}