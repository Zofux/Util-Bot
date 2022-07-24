const { MessageAttachment, MessageActionRow, MessageButton, MessageEmbed } = require('discord.js')
const config = require("../../config.json")

module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
        console.log("Ready!")
        client.user.setPresence({ activities: [{ name: `${config.yourName}`, type: "LISTENING" }] })

        await require('./intervals/mutes')(client)
        await require('./intervals/autos')(client)

        const { Player } = require("discord-player")
        const player = new Player(client)
        player.on("trackStart", (queue, track) => {
            const embed = new MessageEmbed()
                .setColor("#f23a3a")
                .setAuthor("Now Playing")
                .setDescription(`[${track.title}](${track.url}) by ${track.author} [${track.duration}]`)
            queue.metadata.channel.send({ embeds: [embed] })
        })
    }
}