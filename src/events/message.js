const Discord = require('discord.js')
const db = require('../models/captchas')
const config = require("../../config.json")
const Levels = require("discord-xp")

module.exports = {
    name: 'messageCreate',
    async execute(message, client) {
        if (message.author.bot) return;

        if (message.guild) {
            const verificationChannels = require('../models/verificationChannels')
            const verificationChannel = await verificationChannels.findOne({ guildId: message.guild.id })
            if (verificationChannel) {
                if (!message.member.permissions.has(Discord.Permissions.FLAGS.MANAGE_GUILD)) {
                    if (message.channel.id === verificationChannel.channelId) return message.delete()
                }

            }

            if (message.content === `<@${client.user.id}>`) return message.channel.send({ content: "All you need to do to get started using my commands is to run `/help`" })

            const randomXp = Math.floor(Math.random() * 10) + 1;
            const hasLevelUp = await Levels.appendXp(message.author.id, message.guild.id, randomXp);
            if (hasLevelUp) {
                const user = await Levels.fetch(message.author.id, message.guild.id);
                message.reply({ content: `<@${message.author.id}>, Congrats you levelled up to level **${user.level}**!` }).then(msg => {
                    setTimeout(() => msg.delete(), 8000)
                })
            }

        } else {
            const res = await db.findOne({ userId: message.author.id })
            if (!res) {
                const embed = new Discord.MessageEmbed()
                    .setDescription(`${config.crossEmoji} You currently don't have any active captchas. use \`/verfiy\` in **verification channel** to get one`)
                    .setColor(config.ErrorHexColor)
                    .setAuthor("No active captchas")
                message.author.send({ embeds: [embed] })
            } else if (res) {
                if (message.content !== res.code) {
                    const verificationChannels = require('../models/verificationChannels')
                    const verificationChannel = await verificationChannels.findOne({ guildId: res.guildId })

                    const server = client.guilds.cache.get(res.guildId)
                    if (!verificationChannel) {
                        const embed = new Discord.MessageEmbed()
                            .setDescription(`${config.crossEmoji} **${server.name}** doesn't have a verification channel`)
                            .setColor(config.ErrorHexColor)
                            .setAuthor("No Channel")
                        message.author.send({ embeds: [embed] })
                    }

                    await db.findOneAndDelete({ userId: message.author.id }).then(async () => {
                        const embed = new Discord.MessageEmbed()
                            .setDescription(`${config.crossEmoji} You sent the worng captcha code, plase use \`/verfiy\` in <#${verificationChannel.channelId}> to get a new one.`)
                            .setColor(config.ErrorHexColor)
                            .setAuthor("Wrong Code")
                        message.author.send({ embeds: [embed] })
                    })
                } else {
                    await db.findOneAndDelete({ userId: message.author.id }).then(async () => {
                        client.guilds.cache.get(verificationChannel.guildId).members.cache.get(message.author.id).roles.add(config.memberRole).then(() => {
                            const embed = new Discord.MessageEmbed()
                                .setDescription(`${config.checkEmoji} You have been verified`)
                                .setColor(config.SuccessHexColor)
                                .setAuthor("Thank you!")
                            message.author.send({ embeds: [embed] })
                        })
                    })

                };


            }
        }
    }
}