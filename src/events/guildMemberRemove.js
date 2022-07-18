const moment = require("moment")
const Discord = require('discord.js')
const config = require("../../config.json")

module.exports = {
    name: 'guildMemberRemove',
    async execute(member) {
            const logChannel = member.guild.channels.cache.get(config.log)
            let embed = new Discord.MessageEmbed()
                .setDescription(`:inbox_tray: <@${member.user.id}> Left the server`)
                //.addField(`Joined at`, `${moment(member.joinedAt).format('LT')} ${moment(member.joinedAt).format('LL')} ${moment(member.joinedAt).fromNow()}`)
                .setColor('#eb3a34')
                .setAuthor(`${member.user.username}`, member.user.displayAvatarURL())
            logChannel.send({ embeds: [embed] })
    }
}