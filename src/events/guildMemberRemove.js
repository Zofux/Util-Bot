const moment = require("moment")
const Discord = require('discord.js')
const config = require("../../config.json")

module.exports = {
    name: 'guildMemberRemove',
    async execute(member) {
        const logs = require('../models/logChannels')
        const log = await logs.findOne({ guildId: interaction.guild.id })
        let doLog = false
        let logChannel;
        if (log) {
            doLog = true
        }
        if (doLog) {
            logChannel = interaction.guild.channels.cache.get(log.channelId)
            if (!logChannel) doLog = false
        }

        let embed = new Discord.MessageEmbed()
            .setDescription(`:outbox_tray: <@${member.user.id}> Left the server`)
            //.addField(`Joined at`, `${moment(member.joinedAt).format('LT')} ${moment(member.joinedAt).format('LL')} ${moment(member.joinedAt).fromNow()}`)
            .setColor(config.ErrorHexColor)
            .setAuthor(`${member.user.username}`, member.user.displayAvatarURL())
        if (doLog) {
            logChannel.send({ embeds: [embed] })
        }

    }
}