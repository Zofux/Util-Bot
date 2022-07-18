const Discord = require('discord.js')
const db = require('../models/captchas')
const config = require("../../config.json")

module.exports = {
    name: 'messageCreate',
    async execute(message, client) {
        if (message.author.bot) return;

        if (message.channel.id === config.verify) return message.delete()
        if (message.guild) return;
        console.log(message.author.id)
        const res = await db.findOne({ userId: message.author.id })
        if (!res) {
            const embed = new Discord.MessageEmbed()
                .setDescription(`<:cross:896045962940780555> You currently don't have any active captchas. use \`/verfiy\` in <#${config.verify}> to get one`)
                .setColor("#ff7575")
                .setAuthor("No active captchas")
            message.author.send({ embeds: [embed] })
        } else if (res) {
            if (message.content !== res.code) {
                await db.findOneAndDelete({ userId: message.author.id }).then(async () => {
                    const embed = new Discord.MessageEmbed()
                        .setDescription(`<:cross:896045962940780555> You sent the worng captcha code, plase use \`/verfiy\` in <#${config.verify}> to get a new one.`)
                        .setColor("#ff7575")
                        .setAuthor("Wrong Code")
                    message.author.send({ embeds: [embed] })
                })
            } else {
                await db.findOneAndDelete({ userId: message.author.id }).then(async () => {
                    client.guilds.cache.get(config.guild).members.cache.get(message.author.id).roles.add(config.memberRole).then(() => {
                        const embed = new Discord.MessageEmbed()
                            .setDescription(`<:check:896045976039608320> You have been verified`)
                            .setColor("#00ff74")
                            .setAuthor("Thank you!")
                        message.author.send({ embeds: [embed] })
                    })
                })

            }
        }
    }
}