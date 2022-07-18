const moment = require("moment")
const Discord = require('discord.js')
const config = require("../../config.json")

module.exports = {
    name: 'guildMemberAdd',
    async execute(member) {
        const logChannel = member.guild.channels.cache.get(config.log)
        let embed = new Discord.MessageEmbed()
            .setDescription(`:inbox_tray: <@${member.user.id}> Joined the server`)
            //.addField(`Account created`, `${moment(member.user.createdTimestamp).format('LT')} ${moment(member.user.createdTimestamp).format('LL')} ${moment(member.user.createdTimestamp).fromNow()}`)
            .setColor('#43d490')
            .setAuthor(`${member.user.username}`, member.user.displayAvatarURL())
        logChannel.send({ embeds: [embed] })

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
        const date = new Date()
        date.setHours(date.getHours() + 1)

        if (res) {
            return
        } else if (!res) {
            if (member.roles.cache.some(role => role.id === config.memberRole)) {
                return
            }
            new db({
                userId: member.user.id,
                expiers: date,
                code: id
            }).save().then(async () => {
                const embed = new Discord.MessageEmbed()
                    .setAuthor("Welcome to our server!")
                    .setDescription(`Please send the captcha code back to me (<@${config.clientId}>).\n\n**Why**\nThis is to protect the server against targeted attacks using bots\n\n**Expiers**\n<t:${unixTime(date)}:R>\n\n**Your Captcha:**`)
                    .setImage('attachment://captcha.png')
                    .setColor('#43d490')
                    .setFooter("NOTE: This is Case Sensitive (Made by Zofux)")

                await member.user.send({
                    files: [captchaAttachment],
                    embeds: [embed]
                })
            })
        }
    }
}