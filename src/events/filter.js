const Discord = require("discord.js")
const db = require('../models/autoInfractions')
const unixTime = require('unix-time');
const config = require("../../config.json")

module.exports = {
    name: 'messageCreate',
    async execute(message, client) {
        if (message.author.bot || !message.guild) return;

        const wordFilter = require('../models/filter')
        const filter = await wordFilter.findOne({ guildId: message.guild })
        if (!filter || !filter.words) return;
        const blacklisted = filter.words

        let found = false
        for (let i in blacklisted) {
            if (message.content.toLowerCase().includes(blacklisted[i])) found = true
        }

        if (found) {
            await message.delete()

            const infractions = await db.find({ userId: message.author.id })
            if (infractions.length >= 2) {
                const muted = message.guild.roles.cache.get(config.muteRole)
                const member = message.guild.roles.cache.get(config.memberRole)

                await db.deleteMany({ userId: message.author.id })
                const mute = require('../models/mutes')
                let date = new Date()
                date.setHours(date.getHours() + 3)

                var randomstring = require("randomstring");
                const id = randomstring.generate(7)

                new mute({
                    userId: message.author.id,
                    expires: date,
                }).save().then(async () => {
                    const warns = require('../models/infractions')
                    const res = await warns.findOne({ userId: message.author.id, guildId: message.guild.id })
                    if (!res) {
                        new warns({
                            userId: message.author.id,
                            guildId: message.guild.id,
                            infractions: [
                                { type: "mute", date: unixTime(new Date()), reason: "Continues infractions", id: id, moderator: `${client.user.username}#${client.user.discriminator}` }
                            ]
                        }).save()
                    } else {
                        const infraction = {
                            type: "mute", date: unixTime(new Date()), reason: "Continues infractions", id: id, moderator: `${client.user.username}#${client.user.discriminator}`
                        }
                        await warns.findOneAndUpdate({
                            guildId: message.guild.id, userId: message.author.id
                        }, {
                            $push: { infractions: infraction }
                        }, {
                            new: true,
                            upsert: true
                        })
                    }

                    message.member.roles.add(muted)
                    message.member.roles.remove(member)

                    const logChannel = message.guild.channels.cache.get(config.log)
                    const logEmbed = new Discord.MessageEmbed()
                        .setColor("#ffdd33")
                        .addFields([
                            { name: 'User', value: `${message.author.username}#${message.author.discriminator} (<@${message.author.id}>)`, inline: true },
                            { name: 'Moderator', value: `${client.user.username}#${client.user.discriminator}`, inline: true },
                            { name: 'Reason', value: "Continues infractions" },
                            { name: "Expiers", value: `<t:${unixTime(date)}:R>` }
                        ])
                        .setAuthor(`Mute | ${message.author.username}#${message.author.discriminator}`)
                        .setFooter(message.guild.name)
                        .setTimestamp()
                    logChannel.send({ embeds: [logEmbed] });
                })

            } else {
                let reason = "Swearing and/or Toxic behavior"
                let date = new Date()
                date.setHours(date.getHours() + 24)

                new db({
                    userId: message.author.id,
                    expires: date,
                    reason: reason
                }).save().then(async () => {
                    const logChannel = message.guild.channels.cache.get(config.log)
                    const logEmbed = new Discord.MessageEmbed()
                        .setColor("#ffdd33")
                        .addFields([
                            { name: 'User', value: `${message.author.username}#${message.author.discriminator} (<@${message.author.id}>)`, inline: true },
                            { name: 'Moderator', value: `${client.user.username}#${client.user.discriminator}`, inline: true },
                            { name: 'Reason', value: reason },
                            { name: "Expiers", value: `<t:${unixTime(date)}:R>` }
                        ])
                        .setAuthor(`Auto Warn | ${message.author.username}#${message.author.discriminator}`)
                        .setFooter(message.guild.name)
                        .setTimestamp()
                    logChannel.send({ embeds: [logEmbed] });
                })
            }

        } else {
            return;
        }
    }
}