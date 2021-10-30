const moment = require("moment")
const Discord = require('discord.js')

module.exports = {
    name: 'guildMemberAdd',
    async execute(member) {
        if (member.guild.id === "892751160182730772") {
            member.roles.add("892756988335898634")

            const logChannel = member.guild.channels.cache.get("896370391247896616")
            let embed = new Discord.MessageEmbed()
                .setDescription(`:inbox_tray: <@${member.user.id}> Joined the server`)
                .addField(`Account created`, `${moment(member.user.createdTimestamp).format('LT')} ${moment(member.user.createdTimestamp).format('LL')} ${moment(member.user.createdTimestamp).fromNow()}`)
                .setColor('#43d490')
                .setAuthor(`${member.user.username}`, member.user.displayAvatarURL())
            logChannel.send({ embeds: [embed] })
        }
    }
}