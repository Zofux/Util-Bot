const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("verify")
        .setDescription("Verifiser deg, slik at du kan bruke serveren!"),
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true })
        var randomstring = require("randomstring");
        const id = randomstring.generate(7)
        const user = interaction.user

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

        const db = require('../../models/captchas')
        const res = await db.findOne({ userId: user.id })
        const unixTime = require('unix-time');
        const date = new Date()
        date.setHours(date.getHours + 1)

        if (res) {
            const embed = new Discord.MessageEmbed()
                .setAuthor("Captcha Active")
                .setDescription("<:cross:896045962940780555> You already have a active captcha code waiting for you in your dm's")
                .setColor("#ff7575")
                .setFooter("Made by Zofux")
            return interaction.editReply({ embeds: [embed], ephemeral: true })
        } else if (!res) {
            new db({
                userId: user.id,
                expiers: date,
                code: id
            }).save().then(async () => {
                const embed = new Discord.MessageEmbed()
                    .setAuthor("Welcome to our server!")
                    .setDescription(`Please send the captcha code back to me (<@892754578162982922>).\n\n**Why**\nThis is to protect the server against targeted attacks using bots\n\n**Expiers**\n<t:${unixTime(date)}:R>\n\n**Your Captcha:**`)
                    .setImage('attachment://captcha.png')
                    .setColor('#34eb3a')
                    .setFooter("NOTE: This is Case Sensitive (Made by Zofux)")

                await user.send({
                    files: [captchaAttachment],
                    embeds: [embed]
                }).then(() => {
                    const answerEmbed = new Discord.MessageEmbed()
                    .setAuthor("Captcha Control")
                    .setDescription(`<:check:896045976039608320> I've gone ahead and sent you a captcha code in your dm's`)
                    .setColor('#34eb3a')
                    .setFooter("Made by Zofux")
                    return interaction.editReply({ embeds: [answerEmbed], ephemeral: true })
                })
            })
        }



    }
}