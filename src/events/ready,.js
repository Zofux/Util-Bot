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
    }
}