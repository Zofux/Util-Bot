const Discord = require("discord.js")
const db = require('../models/suggestions')
const config = require("../../config.json")

module.exports = {
    name: 'messageCreate',
    async execute(message, client) {
        if (!message.guild || message.author.bot) return
        if (!config.suggestionChannel) return
        else if (!message.channel.id === config.suggestionChannel) return
        
        const randomstring = require(`randomstring`);
        const id = randomstring.generate(7)

        let embed = new Discord.MessageEmbed()
            .setDescription(`**Submitter**\n<@${message.author.id}>\n\n**Suggestion**\n${message.content}`)
            .setColor(config.MainHexColor)
            .setAuthor(message.author.username, message.author.displayAvatarURL())
            .setThumbnail(message.author.displayAvatarURL())
            .setFooter(`User ID: ${message.author.id} | sID: ${id}`)
            .setTimestamp()
        message.channel.send({ embeds: [embed] }).then(async msg => {
            msg.react("👍").then(() => msg.react("👎").then(async () => {
                await message.delete()
                new db({
                    userId: message.author.id,
                    id: id,
                    messageId: message.id,
                    suggestion: message.content
                }).save()
            }))
        })
    }
}