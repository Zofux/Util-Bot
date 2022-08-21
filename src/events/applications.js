const Discord = require('discord.js')
const db = require('../models/currentApplications')
const config = require("../../config.json")
const applications = require("../models/applications")

module.exports = {
    name: 'messageCreate',
    async execute(message, client) {
        if (message.author.bot || message.guild) return;

        const res = await db.findOne({ userId: message.author.id })
        if (!res) return;
        else if (res) {
            const application = await applications.findOne({ name: res.application })
            if (!application) {
                const embed = new Discord.MessageEmbed()
                    .setAuthor(interaction.user.username, interaction.user.displayAvatarURL())
                    .setDescription(`${config.crossEmoji} The **${res.application} application** has been deleted, and therefore can't be used anymore.`)
                    .setColor(config.ErrorHexColor)
                    .setFooter(`Made by Zofux`)
                return interaction.editReply({ embeds: [embed], ephemeral: true }).then(async () => await db.findOneAndDelete({ userId: message.author.id }))
            } else if (application) {
                if ((res.coun + 1) === application.numberOfQuestions) {
                    await db.findOneAndUpdate({ userId: message.author.id }, {
                        $push: { questions: { question: application.questions[res.count], answer: message.content } }
                    }, { upsert: true }).then(() => {
                        const Button = new Discord.MessageActionRow()
                            .addComponents(
                                new Discord.MessageButton()
                                    .setCustomId("submit-app")
                                    .setLabel("Submit")
                                    .setStyle("PRIMARY")
                            )
                            .addComponents(
                                new Discord.MessageButton()
                                    .setCustomId("cancel-app")
                                    .setLabel("Cancel")
                                    .setStyle("DANGER")
                            )

                        let questionEmbed = new Discord.MessageEmbed()
                            .setColor(config.MainHexColor)
                            .setDescription(`Do you wish to **submit** this application?`)
                        return message.author.send({ embeds: [questionEmbed], components: [Button] })
                    })
                    return
                }

                await db.findOneAndUpdate({ userId: message.author.id }, {
                    $inc: { count: 1 },
                    $push: { questions: { question: application.questions[res.count], answer: message.content } }
                }, { upsert: true }).then(() => {
                    let questionEmbed = new Discord.MessageEmbed()
                        .setColor(config.MainHexColor)
                        .setDescription(`**${application.questions[res.count + 1]}**`)
                    return message.author.send({ embeds: [questionEmbed] })
                })
            }
        }
    }
}