const Discord = require('discord.js')

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

                const guild = client.guilds.cache.get('892751160182730772')
                const member = (await guild.members.fetch()).get(userId)
                if (member) {
                    const muted = guild.roles.cache.get("903991654074167357")
                    const main = guild.roles.cache.get("892756988335898634")

                    member.roles.add(main)
                    member.roles.remove(muted)


                    const logChannel = guild.channels.cache.get("896697011255017493")
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