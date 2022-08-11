const Discord = require('discord.js')
const config = require('../../../config.json')
const db = require('../../models/applications')

module.exports = async (interaction, client) => {
    const res = await db.findOne({ channelId: interaction.channel.id, status: "Pending" })
    if (!res) {
        const embed = new Discord.MessageEmbed()
            .setDescription(`${config.crossEmoji} This application **isn't** in my database anymore`)
            .setColor(config.ErrorHexColor)
            .setAuthor(interaction.user.username, interaction.user.displayAvatarURL())
            .setFooter("Made by Zofux")
            .setTimestamp()
        return await interaction.reply({ embeds: [embed] })
    }

    if (interaction.customId === "accept") {
        await db.findOneAndUpdate({
            channelId: interaction.channel.id, status: "Pending"
        }, {
            $set: { status: "Accepted" }
        }, {
            upsert: true
        }).then(async () => {
            const channel = interaction.guild.channels.cache.get(config.applicationStatusChannelId)

            channel.send(`> <@${res.userId}> congratulations! Your \`${res.type} Application\` has been **accepted** by <@${interaction.user.id}>\n> \n> *You should expect instructions soon*`).then(async () => {
                await channel.delete()
            })
        })
    } else if (interaction.customId === "deny") {
        await db.findOneAndUpdate({
            channelId: interaction.channel.id, status: "Pending"
        }, {
            $set: { status: "Denied" }
        }, {
            upsert: true
        }).then(async () => {
            const channel = interaction.guild.channels.cache.get(config.applicationStatusChannelId)

            channel.send(`> <@${res.userId}> Your \`${res.type} Application\` has been **denied** by <@${interaction.user.id}>\n> \n> *Have a issue with this? Contact our modmail*`).then(async () => {
                await channel.delete()
            })
        })
    }
}