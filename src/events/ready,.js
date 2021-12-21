const { MessageAttachment, MessageActionRow, MessageButton, MessageEmbed } = require('discord.js')

module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
        console.log("Ready!")

        await require('./intervals/mutes')(client)
        await require('./intervals/autos')(client)
    }
}