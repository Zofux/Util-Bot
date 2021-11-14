const Discord = require('discord.js')
const db = require('../models/captchas')

module.exports = {
    name: 'messageCreate',
    async execute(message, client) {
        if (message.guild) return;
        await db.findOne({ userId: message.author.id }, async (err, res) => {
            if (err) return
            else if (!res) {
                const embed = new Discord.MessageEmbed()
                    .setDescription(`<:cross:896045962940780555> You currently don't have any active captchas. use \`/verfiy\` in <#909502038516326500> to get one`)
                    .setColor("#ff7575")
                    .setAuthor("No active captchas")
                message.author.send({ embeds: [embed] })
            } else if (res) {
                if (message.content !== res.code) {
                    await db.findOneAndDelete({ userId: message.author.id }).then(async () => {
                        const embed = new Discord.MessageEmbed()
                            .setDescription(`<:cross:896045962940780555> You sent the worng captcha code, plase use \`/verfiy\` in <#909502038516326500> to get a new one.`)
                            .setColor("#ff7575")
                            .setAuthor("Wrong Code")
                        message.author.send({ embeds: [embed] })
                    })
                } else {
                    const member = client.guilds.cache.get("892751160182730772").members.get(message.author.id)
                    member.roles.add("892756988335898634").then(() => {
                        const embed = new Discord.MessageEmbed()
                            .setDescription(`<:check:896045976039608320> You have been verified`)
                            .setColor("#5797ff")
                            .setAuthor("Thank you!")
                        message.author.send({ embeds: [embed] })
                    })
                }
            }
        })
    }
}