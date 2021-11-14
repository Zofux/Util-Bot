const { Captcha, CaptchaGenerator } = require('captcha-canvas');
const { MessageAttachment, MessageEmbed } = require('discord.js')
const unixTime = require("unix-time")

module.exports = async (member, client) => {
    const random = require('randomstring')
    const id = random.generate(7)

    const captcha = new CaptchaGenerator()
        .setDimension(70, 250)
        .setCaptcha({ text: id, size: 45, color: "#00ff74" })
        .setDecoy({ opacity: 0.7 })
        .setTrace({ color: "#00ff74" })
    const image = captcha.generateSync();

    const attachment = new MessageAttachment()
        .setFile(await image)
        .setName("captcha.png")

    const date = new Date()
    date.setMinutes(date.getMinutes() + 15)

    const db = require('../../models/captchas')
    await db.findOneAndDelete({ userId: member.user.id }).then(async () => {
        new db({
            userId: member.user.id,
            code: captcha.text,
            expires: date
        }).save().then(() => {
            let embed = new MessageEmbed()
                .setAuthor("Welcome to Cactus Craft")
                .setDescription('Please send the captcha code here.\n\n**Why?**\nThis is to protect the server against targeted attacks using bots\n\n**Expiers**\n<t:' + unixTime(date) + ':R>\n\n**Your Captcha:**')
                .setFooter("NOTE: This is Case Sensitive")
                .setColor("#00ff74")
                .setImage("attachment://captcha.png")
            member.send({ embeds: [embed], files: [attachment] })
        })
    })

}