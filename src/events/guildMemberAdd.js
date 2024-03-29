const moment = require("moment")
const Discord = require('discord.js')
const config = require("../../config.json")

module.exports = {
    name: 'guildMemberAdd',
    async execute(member) {
        const memberRole = member.guild.roles.cache.get(config.memberRole)
        member.roles.add(memberRole)
        const logs = require('../models/logChannels')
        const log = await logs.findOne({ guildId: member.guild.id })
        let doLog = false
        let logChannel;
        if (log) {
            doLog = true
        }
        if (doLog) {
            logChannel = member.guild.channels.cache.get(log.channelId)
            if (!logChannel) doLog = false
        }
        let embed = new Discord.MessageEmbed()
            .setDescription(`:inbox_tray: <@${member.user.id}> Joined the server`)
            //.addField(`Account created`, `${moment(member.user.createdTimestamp).format('LT')} ${moment(member.user.createdTimestamp).format('LL')} ${moment(member.user.createdTimestamp).fromNow()}`)
            .setColor(config.SuccessHexColor)
            .setAuthor(`${member.user.username}`, member.user.displayAvatarURL())
        if (doLog) {
            logChannel.send({ embeds: [embed] })
        }

        /*const verificationChannels = require('../models/verificationChannels')
        const verificationChannel = await verificationChannels.findOne({ guildId: member.guild.id })
        if (!verificationChannel) {
            return 
        } else if (verificationChannel) {
            if (!member.guild.channels.cache.get(verificationChannel.channelId)) {
                return await verificationChannels.findOneAndDelete({ guildId: member.guild.id })
            }

            var randomstring = require("randomstring");
            const id = randomstring.generate(6)

            const { Captcha } = require('captcha-canvas')
            const captcha = new Captcha()
            captcha.async = true;
            captcha.addDecoy();
            captcha.drawTrace();
            captcha.drawCaptcha({ text: id });

            const captchaAttachment = new Discord.MessageAttachment(
                await captcha.png,
                "captcha.png"
            )

            const db = require('../models/captchas')
            const res = await db.findOne({ userId: member.user.id })
            const unixTime = require('unix-time');
            let date = new Date()
            date.setHours(date.getHours() + 1)

            if (res) {
                return
            } else if (!res) {
                if (member.roles.cache.some(role => role.id === config.memberRole)) {
                    return
                }
                new db({
                    guildId: member.guild.id,
                    userId: member.user.id,
                    expires: date,
                    code: id
                }).save().then(async () => {
                    const embed = new Discord.MessageEmbed()
                        .setAuthor("Welcome to our server!")
                        .setDescription(`Please send the captcha code back to me (<@${config.clientId}>).\n\n**Why**\nThis is to protect the server against targeted attacks using bots\n\n**Expiers**\n<t:${unixTime(date)}:R>\n\n**Your Captcha:**`)
                        .setImage('attachment://captcha.png')
                        .setColor(config.SuccessHexColor)
                        .setFooter("NOTE: This is Case Sensitive (Made by Zofux)")

                    await member.user.send({
                        files: [captchaAttachment],
                        embeds: [embed]
                    })
                })
            }
        }*/
    }
}