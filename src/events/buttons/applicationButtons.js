const Discord = require('discord.js')
const config = require('../../../config.json')
const db = require('../../models/currentApplications')
const unixTime = require('unix-time')

module.exports = async (interaction, client) => {
    if (interaction.customId === "cancel-app") {
        const res = await db.findOne({ userId: interaction.user.id })
        if (res) {
            await db.findOneAndDelete({ userId: interaction.user.id }).then(async () => {
                let responseEmbed = new Discord.MessageEmbed()
                    .setColor(config.MainHexColor)
                    .setDescription("This application has been **Stopped**")
                return interaction.reply({ embeds: [responseEmbed] })
            })
        } else if (!res) {
            const embed = new Discord.MessageEmbed()
                .setAuthor(interaction.user.username, interaction.user.displayAvatarURL())
                .setDescription(`${config.crossEmoji} This application is not active anymore`)
                .setColor(config.ErrorHexColor)
                .setFooter(`Made by Zofux`)
            return interaction.reply({ embeds: [embed] })
        }
    } else if (interaction.customId === "submit-app") {
        const res = await db.findOne({ userId: interaction.user.id })
        if (res) {
            const applications = require('../../models/applications')
            const application = await applications.findOne({ name: res.application })
            if (!application) {
                const embed = new Discord.MessageEmbed()
                    .setAuthor(interaction.user.username, interaction.user.displayAvatarURL())
                    .setDescription(`${config.crossEmoji} There is no longer a application with the name **${res.application}** in that server, you can therefore not submit your application`)
                    .setColor(config.ErrorHexColor)
                    .setFooter(`Made by Zofux`)
                return interaction.reply({ embeds: [embed] })
            } else if (application) {
                const id = Math.floor(Math.random() * 90000) + 10000;
                client.guilds.cache.get(config.guild).channels.create(`application-${id}`, {
                    type: 'GUILD_TEXT',
                    parent: application.category,
                    permissionOverwrites: [
                        {
                            id: config.guild,
                            deny: ["VIEW_CHANNEL"]
                        },
                        {
                            id: config.applicationsRole,
                            allow: ["VIEW_CHANNEL", "READ_MESSAGE_HISTORY", "SEND_MESSAGES"],
                        }
                    ]
                }).then(async (channel) => {
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

                    const member = client.guilds.cache.get(config.guild).members.cache.get(interaction.user.id)

                    const embed = new Discord.MessageEmbed()
                        .setAuthor(`Info-${interaction.user.username}`, interaction.user.displayAvatarURL())
                        .setDescription(
                            `**User:** <@${interaction.user.id}>\`(${interaction.user.id})\`\n` +
                            `**Joined the server:** <t:${unixTime(member.joinedTimestamp)}:R>\n` +
                            `**Created Account:** <t:${unixTime(interaction.user.createdTimestamp)}:R>`
                        )
                        .setColor(config.MainHexColor)
                    channel.send({ embeds: [embed], components: [Button] })

                    res.questions.forEach(object => {
                        const responseEmbed = new Discord.MessageEmbed()
                            .setColor(config.MainHexColor)
                            .setAuthor(object.question)
                            .setDescription(object.answer)
                        channel.send({ embeds: [responseEmbed] })
                    })

                    await applications.findOneAndUpdate({ name: res.application }, {
                        $push: { applications: interaction.user.id }
                    }, { upsert: true }).then(async () => {
                        await db.findOneAndDelete({ userId: interaction.user.id }).then(() => {
                            const confirmEmbed = new Discord.MessageEmbed()
                                .setAuthor(interaction.user.username, interaction.user.displayAvatarURL())
                                .setDescription(`${config.checkEmoji} You have **submitted** your application, you are now awaiting a response!`)
                                .setColor(config.SuccessHexColor)
                                .setFooter(`Made by Zofux`)
                            return interaction.reply({ embeds: [confirmEmbed] })
                        })
                    })
                })
            }
        } else if (!res) {
            const embed = new Discord.MessageEmbed()
                .setAuthor(interaction.user.username, interaction.user.displayAvatarURL())
                .setDescription(`${config.crossEmoji} This application is not active anymore`)
                .setColor(config.ErrorHexColor)
                .setFooter(`Made by Zofux`)
            return interaction.reply({ embeds: [embed] })
        }
    }
}