const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js')
const config = require(`../../../config.json`)

module.exports = {
    data: new SlashCommandBuilder()
        .setName(`verify`)
        .setDescription(`Verifiser deg, slik at du kan bruke serveren!`),
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true })
        var randomstring = require(`randomstring`);
        const id = randomstring.generate(6)
        const user = interaction.user

        const { Captcha } = require('captcha-canvas')
        const captcha = new Captcha()
        captcha.async = true;
        captcha.addDecoy();
        captcha.drawTrace();
        captcha.drawCaptcha({ text: id });

        const captchaAttachment = new Discord.MessageAttachment(
            await captcha.png,
            `captcha.png`
        )

        const db = require('../../models/captchas')
        const res = await db.findOne({ userId: user.id })
        const unixTime = require('unix-time');
        const date = new Date()
        date.setHours(date.getHours() + 1)

        if (res) {
            const embed = new Discord.MessageEmbed()
                .setAuthor(`Captcha Active`)
                .setDescription(`${config.crossEmoji} You already have a active captcha code waiting for you in your dm's`)
                .setColor(`#ff7575`)
                .setFooter(`Made by Zofux`)
            return interaction.editReply({ embeds: [embed], ephemeral: true })
        } else if (!res) {
            if (interaction.member.roles.cache.some(role => role.id === config.memberRole)) {
                const embed = new Discord.MessageEmbed()
                    .setAuthor(`Already verified`)
                    .setDescription(`${config.crossEmoji} You are currently verified`)
                    .setColor(`#ff7575`)
                    .setFooter(`Made by Zofux`)
                return interaction.editReply({ embeds: [embed], ephemeral: true })
            }
            new db({
                userId: user.id,
                expiers: date,
                code: id
            }).save().then(async () => {
                const embed = new Discord.MessageEmbed()
                    .setAuthor(`Welcome to ${interaction.guild.name}!`)
                    .setDescription(`Please send the captcha code back to me (<@${config.clientId}>).\n\n**Why**\nThis is to protect the server against targeted attacks using bots\n\n**Expiers**\n<t:${unixTime(date)}:R>\n\n**Your Captcha:**`)
                    .setImage('attachment://captcha.png')
                    .setColor('#43d490')
                    .setFooter(`NOTE: This is Case Sensitive (Made by Zofux)`)

                await user.send({
                    files: [captchaAttachment],
                    embeds: [embed]
                }).then(() => {
                    const answerEmbed = new Discord.MessageEmbed()
                        .setAuthor(`Captcha Control`)
                        .setDescription(`${config.checkEmoji}  I've gone ahead and sent you a captcha code in your dm's`)
                        .setColor('#43d490')
                        .setFooter(`Made by Zofux`)
                    return interaction.editReply({ embeds: [answerEmbed], ephemeral: true })
                })
            })
        }



    }
}