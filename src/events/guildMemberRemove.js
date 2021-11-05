const moment = require("moment")
const Discord = require('discord.js')

module.exports = {
    name: 'guildMemberRemove',
    async execute(member) {
        if (member.guild.id === "892751160182730772") {
            const logChannel = member.guild.channels.cache.get("896370391247896616")
            let embed = new Discord.MessageEmbed()
                .setDescription(`:inbox_tray: <@${member.user.id}> Left the server`)
                .addField(`Joined at`, `${moment(member.joinedAt).format('LT')} ${moment(member.joinedAt).format('LL')} ${moment(member.joinedAt).fromNow()}`)
                .setColor('#ff7575')
                .setAuthor(`${member.user.username}`, member.user.displayAvatarURL())
            logChannel.send({ embeds: [embed] })
        }
    }
}