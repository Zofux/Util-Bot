const Discord = require('discord.js')
const config = require('../../../config.json')
const db = require('../../models/modmail')

module.exports = async (interaction, client) => {
    if (interaction.customId === "close-mail") {
        const res = await db.findOne({ guildId: interaction.guild.id, "mail.channelId": interaction.channel.id })
        if (!res) {
            const embed = new Discord.MessageEmbed()
                .setDescription(`${config.crossEmoji} This modmail channel is not in my database anymore`)
                .setColor(config.ErrorHexColor)
                .setAuthor(interaction.user.username, interaction.user.displayAvatarURL())
                .setFooter("Made by Zofux")
                .setTimestamp()
            return await interaction.reply({ embeds: [embed] })
        } else if (res) {
            const array = await res.mail.filter(o => o.channelId === interaction.channel.id)
            const member = interaction.guild.members.cache.get(array[0].userId)

            await db.findOneAndUpdate({
                guildId: interaction.guild.id, "mail.channelId": interaction.channel.id
            }, {
                $pull: { mail: { userId: array[0].userId, channelId: array[0].channelId } }
            }, {
                upsert: true
            }).then(async () => {
                await interaction.channel.delete().then(async () => {
                    const logs = require('../../models/logChannels')
                    const log = await logs.findOne({ guildId: interaction.guild.id })
                    let doLog = false
                    let logChannel;
                    if (log) {
                        doLog = true
                    }
                    if (doLog) {
                        logChannel = interaction.guild.channels.cache.get(log.channelId)
                        if (!logChannel) return;
                        else if (logChannel) {
                            const logEmbed = new Discord.MessageEmbed()
                                .setAuthor(`ModMail Closed | ${interaction.channel.id}`)
                                .setColor(config.MainHexColor)
                                .addField("Channel", `\`${interaction.channel.id}\``)
                                .addField("User", `\`${array[0].userId}\``)
                                .addField("Moderator", `<@${interaction.user.id}>`)
                            logChannel.send({ embeds: [logEmbed] })
                        }
                    }

                    if (member) {
                        const embed = new Discord.MessageEmbed()
                            .setAuthor(client.user.username, client.user.displayAvatarURL())
                            .setThumbnail(client.user.displayAvatarURL())
                            .setColor(config.MainHexColor)
                            .setDescription("Your current modmail has been closed by our staff team, simply send another message to me if you still need help")
                        member.send({ embeds: [embed] })
                    }
                })
            })
        }
    }
}
