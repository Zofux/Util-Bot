const moment = require("moment")
const Discord = require('discord.js')
const config = require("../../config.json")

module.exports = {
    name: 'guildMemberRemove',
    async execute(member) {
        if (!config.log) {
            return console.log(`I currently have no valid value for the "log" in my "config.json"`)
        } else if (config.log) {
            const logChannel = member.guild.channels.cache.get(config.log)
            if (!logChannel) {
                return console.log(`The given "log" in my "config.json" is not a channel in this server`)
            } else {
                let embed = new Discord.MessageEmbed()
                    .setDescription(`:outbox_tray: <@${member.user.id}> Left the server`)
                    //.addField(`Joined at`, `${moment(member.joinedAt).format('LT')} ${moment(member.joinedAt).format('LL')} ${moment(member.joinedAt).fromNow()}`)
                    .setColor(config.ErrorHexColor)
                    .setAuthor(`${member.user.username}`, member.user.displayAvatarURL())
                logChannel.send({ embeds: [embed] })
            }
        }
    }
}