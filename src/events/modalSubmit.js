const Discord = require("discord.js")
const db = require('../models/applications')
const unixTime = require('unix-time');
const config = require("../../config.json")

module.exports = {
    name: 'modalSubmit',
    async execute(modal, client) {

        const res = await db.findOne({ userId: modal.user.id, status: "Pending"})
        if (res) {
            const embed = new Discord.MessageEmbed()
                .setDescription(`${config.crossEmoji} You currently have an active \`<@${res.type} Application>\` with id \`${res.id}\`. \n\n*Please wait for our management team to review it before you apply again.*`)
                .setColor(config.ErrorHexColor)
                .setAuthor(modal.user.username, modal.user.displayAvatarURL())
                .setFooter("Made by Zofux")
                .setTimestamp()
            return modal.reply({ embeds: [embed], ephemeral: true })
        }

        if (modal.customId === "staff") {
            const id = Math.floor(Math.random() * 90000) + 10000;
            client.guilds.cache.get(modal.guild.id).channels.create(`${id}-${modal.customId}`, {
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
            }).then((channel) => {
                const age = modal.getSelectMenuValues('age')
                const timeZone = modal.getTextInputValue('time-zone')
                const part = modal.getTextInputValue('part')
                const goal = modal.getTextInputValue('goal')
                const why = modal.getTextInputValue('why')

                const embed = new Discord.MessageEmbed()
                    .setAuthor(`Info-${modal.user.username}`, modal.user.displayAvatarURL())
                    .setDescription(
                        `**User:** <@${modal.user.id}>\`(${modal.user.id})\`\n` +
                        `**Joined the server:** <t:${Math.floor((modal.member.joinedTimestamp) / 1000)}:R>\n`
                        `**Created Account:** <t:${Math.floor((modal.user.createdTimestamp) / 1000)}:R>\n`
                    )
                    .setColor(config.MainHexColor)
                const embed1 = new Discord.MessageEmbed()
                    .setColor(config.MainHexColor)
                    .setAuthor("Are you above the age of 16?")
                    .setDescription(age[0])

                const embed2 = new Discord.MessageEmbed()
                    .setColor(config.MainHexColor)
                    .setAuthor("What time zone are you in")
                    .setDescription(timeZone)

                const embed3 = new Discord.MessageEmbed()
                    .setColor(config.MainHexColor)
                    .setAuthor("Why do you want to become a moderator")
                    .setDescription(part)

                const embed4 = new Discord.MessageEmbed()
                    .setColor(config.MainHexColor)
                    .setAuthor("What are you goals as a moderator")
                    .setDescription(goal)

                const embed5 = new Discord.MessageEmbed()
                    .setColor(config.MainHexColor)
                    .setAuthor("Why should we choose you?")
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

                channel.send({ embeds: [embed, embed1, embed2, embed3, embed4, embed5], components: [Button] }).then(() => {
                    new db({
                        userId: modal.user.id,
                        date: new Date(),
                        id: id,
                        channelId: channel.id,
                        type: "Staff",
                        status: "Pending"
                    }).save()
                    const reply = new Discord.MessageEmbed()
                        .setDescription(`Great <@${modal.user.id}>! Your \`Staff Application\` with the id \`${id}\` has been submitted.`)
                        .setFooter("You are now awaiting a response from our management team")
                        .setColor(config.MainHexColor)
                        .setAuthor(modal.user.username, modal.user.displayAvatarURL())
                    modal.reply({ embeds: [reply], ephemeral: true })
                })

            })
        }
    }
}