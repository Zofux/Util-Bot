const Discord = require('discord.js')
const config = require("../../../config.json")

module.exports = async (client) => {

    const chechMutes = async () => {
        const now = new Date()

        const conditional = {
            expires: {
                $lt: now
            },
        }

        const muteSchema = require('../../models/mutes');
        const results = await muteSchema.find(conditional);

        if (results && results.length) {
            for (const result of results) {
                const { userId } = result

                const guild = client.guilds.cache.get(config.guild)
                const member = (await guild.members.fetch()).get(userId)
                if (member) {
                    const muted = guild.roles.cache.get(config.muteRole)
                    const main = guild.roles.cache.get(config.memberRole)

                    member.roles.add(main)
                    member.roles.remove(muted)


                    const logChannel = guild.channels.cache.get(config.log)
                    const logEmbed = new Discord.MessageEmbed()
                        .setColor("#43d490")
                        .addFields([
                            { name: 'User', value: `${member.user.username}#${member.user.discriminator} (<@${member.user.id}>)`, inline: true },
                            { name: 'Moderator', value: `${client.user.username}#${client.user.discriminator}`, inline: true },
                            { name: 'Reason', value: "Times Up" }
                        ])
                        .setAuthor(`Unmute | ${member.user.username}#${member.user.discriminator}`)
                        .setFooter(guild.name)
                        .setTimestamp()
                    logChannel.send({ embeds: [logEmbed] });
                }
            }
            await muteSchema.deleteMany(conditional)
        }

        setTimeout(chechMutes, 1000 * 60)
    }
    chechMutes()
}