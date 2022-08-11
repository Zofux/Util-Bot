const Discord = require("discord.js")
const db = require('../models/applications')
const unixTime = require('unix-time');
const config = require("../../config.json")

module.exports = {
    name: 'modalSubmit',
    async execute(modal, client) {
        function createChannel(id) {
            client.guilds.cache.get(newState.guild.id).channels.create(`${id}-${modal.customId}`, {
                type: 'GUILD_TEXT',
                parent: config.applicationCategoryId,
                permissionOverwrites: [
                    {
                        id: modal.guild.id,
                        deny: ["VIEW_CHANNEL"]
                    },
                    {
                        id: config.applicationsRole,
                        allow: ["VIEW_CHANNEL", "READ_MESSAGE_HISTORY", "SEND_MESSAGES"],
                    }
                ]
            })
        }

        if (modal.customId === "staff") {

            const id = Math.floor(Math.random() * 90000) + 10000;
            const channel = createChannel(id)

            const age = modal.getSelectMenyValues('age')
            const timeZone = modal.getTextInputValue('time-zone')
            const part = modal.getTextInputValue('part')
            const goal = modal.getTextInputValue('goal')
            const why = modal.getTextInputValue('why')

            const embed = new Discord.MessageEmbed()
                .setAuthor(`Info-${modal.user.username}`, modal.user.displayAvatarURL())
                .setDescription(
                    `**User:** <@${modal.user.id}>\`(${modal.user.id})\`` +
                    `**Joined:** <t:${unixTime(modal.joinedTimestamp)}:R>`
                    )
                .setColor(config.MainHexColor)
            const embed1 = new Discord.MessageEmbed()
                .setColor(config.MainHexColor)
                .setDescription(age)

            const embed2 = new Discord.MessageEmbed()
                .setColor(config.MainHexColor)
                .setDescription(timeZone)

            const embed3 = new Discord.MessageEmbed()
                .setColor(config.MainHexColor)
                .setDescription(part)

            const embed4 = new Discord.MessageEmbed()
                .setColor(config.MainHexColor)
                .setDescription(goal)

            const embed5 = new Discord.MessageEmbed()
                .setColor(config.MainHexColor)
                .setDescription(why)
                .setTimestamp()

                const Button = new Discord.MessageActionRow()
                .addComponents(
                    new Discord.MessageButton()
                        .setCustomId("accept")
                        .setLabel("Accept")
                        .setStyle("PRIMARY")
                )
                .addComponents(
                    new Discord.MessageButton()
                        .setCustomId("deny")
                        .setLabel("Deny")
                        .setStyle("DANGER")
                )

            channel.send({ embeds: [embed, embed1, embed2, embed3, embed4, embed5], components: [Button] })
            modal.reply({ content: "Thx <3", ephemeral: true })
        }
    }
}