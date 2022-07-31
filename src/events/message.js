const Discord = require('discord.js')
const db = require('../models/captchas')
const config = require("../../config.json")
const Levels = require("discord-xp")

module.exports = {
    name: 'messageCreate',
    async execute(message, client) {
        if (message.author.bot) return;

        if (message.channel.id === config.verify) return message.delete()
        if (message.guild) {
            const randomXp = Math.floor(Math.random() * 10) + 1;
            const hasLevelUp = await Levels.appendXp(message.author.id, message.guild.id, randomXp);
            if (hasLevelUp) {
                const user = await Levels.fetch(message.author.id, message.guild.id);
                message.channel.send({content: `<@${message.author.id}>, Congrats you levelled up to level **${user.level}**!`}).then(msg => {
                    client.setTimeout(() => msg.delete(), 8000)
                })
            }

        } else {
            console.log(message.author.id)
            const res = await db.findOne({ userId: message.author.id })
            if (!res) {
                const embed = new Discord.MessageEmbed()
                    .setDescription(`${config.crossEmoji} You currently don't have any active captchas. use \`/verfiy\` in <#${config.verify}> to get one`)
                    .setColor("#ff7575")
                    .setAuthor("No active captchas")
                message.author.send({ embeds: [embed] })
            } else if (res) {
                if (message.content !== res.code) {
                    await db.findOneAndDelete({ userId: message.author.id }).then(async () => {
                        const embed = new Discord.MessageEmbed()
                            .setDescription(`${config.crossEmoji} You sent the worng captcha code, plase use \`/verfiy\` in <#${config.verifyChannel}> to get a new one.`)
                            .setColor("#ff7575")
                            .setAuthor("Wrong Code")
                        message.author.send({ embeds: [embed] })
                    })
                } else {
                    await db.findOneAndDelete({ userId: message.author.id }).then(async () => {
                        client.guilds.cache.get(config.guild).members.cache.get(message.author.id).roles.add(config.memberRole).then(() => {
                            const embed = new Discord.MessageEmbed()
                                .setDescription(`${config.checkEmoji} You have been verified`)
                                .setColor("#00ff74")
                                .setAuthor("Thank you!")
                            message.author.send({ embeds: [embed] })
                        })
                    })

                };


            }
        }
    }
}