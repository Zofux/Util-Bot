const Discord = require('discord.js')
const db = require('../models/count')
const config = require("../../config.json")

module.exports = {
    name: 'messageCreate',
    async execute(message, client) {
        if (!message.guild || message.author.bot) return
        const res = await db.findOne({ guildId: message.guild.id })
        if (!res) return
        else if (res) {
            if (message.channel.id !== res.channelId) return
            else if (message.channe.id === res.channelId) {
                if (parseInt(message.content) !== (res.count + 1)) return
                else if (parseInt(message.content) === (res.count + 1)) {

                    const webhooks = await message.channel.fetchWebhooks();
                    const webhook = webhooks.find(wh => wh.token)

                    if (!webhook) {
                        const embed = new Discord.MessageEmbed()
                            .setAuthor(interaction.user.username, interaction.user.displayAvatarURL())
                            .setDescription(`${config.crossEmoji} This channel doesn't have a working webhook yet`)
                            .setColor(config.ErrorHexColor)
                            .setFooter(`Made by Zofux`)
                        return message.reply({ embeds: [embed] })
                    }

                    await webhook.send({
                        content: message.content,
                        username: message.author.username,
                        avatarURL: message.author.displayAvatarURL()
                    }).then(async () => {
                        await message.delete()
                        await db.findOneAndUpdate({
                            guildId: message.guild.id
                        }, {
                            $inc: { count: 1 }
                        }, {
                            upsert: true
                        })
                    })

                }
            }
        }

    }
}