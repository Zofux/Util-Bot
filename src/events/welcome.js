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
            if (!channel) await db.findOneAndDelete({ guildId: member.guild.id })
            if (res.embed === false) {
                let message = res.content;
                message = message.replaceAll(`{user.username}`, member.user.username)
                message = message.replaceAll(`{user.tag}`, `<@${member.user.id}>`)
                message = message.replaceAll(`{user.discriminator}`, member.user.discriminator)
                message = message.replaceAll(`{server.name}`, member.guild.name)
                message = message.replaceAll(`{server.members}`, member.guild.memberCount)
                channel.send({ content: message })
            } else if (res.embed === true) {

            }
        }
    }
}