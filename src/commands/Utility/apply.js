const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js')
const config = require(`../../../config.json`)
const db = require('../../models/applications')

module.exports = {
    data: new SlashCommandBuilder()
        .setName(`apply`)
        .setDescription(`Start an application`)
        .addStringOption(option =>
            option.setName("application").setDescription("The name of the application you want to apply for").setRequired(true)),
    async execute(interaction, client) {
        await interaction.deferReply({ ephemeral: true })

        const application = interaction.options.getString("application")
        const res = await db.findOne({ name: application.toLowerCase(), guildId: interaction.guild.id })
        if (!res) {
            const embed = new Discord.MessageEmbed()
                .setAuthor(interaction.user.username, interaction.user.displayAvatarURL())
                .setDescription(`${config.crossEmoji} There is no application with that name in this server`)
                .setColor(config.ErrorHexColor)
                .setFooter(`Made by Zofux`)
            return interaction.editReply({ embeds: [embed], ephemeral: true })
        } else if (res) {
            const currentApplications = require('../../models/currentApplications')
            const current = await currentApplications.findOne({ userId: interaction.user.id })
            if (current) {
                const embed = new Discord.MessageEmbed()
                    .setAuthor(interaction.user.username, interaction.user.displayAvatarURL())
                    .setDescription(`${config.crossEmoji} Sorry but you currently have an active **${current.application} application**, send me **"cancel"** in my dm's to cancel the current application`)
                    .setColor(config.ErrorHexColor)
                    .setFooter(`Made by Zofux`)
                return interaction.editReply({ embeds: [embed], ephemeral: true })
            } else if (!current) {
                const underReview = await db.findOne({ guildId: interaction.guild.id, applications: interaction.user.id })
                if (underReview) {
                    const embed = new Discord.MessageEmbed()
                        .setAuthor(interaction.user.username, interaction.user.displayAvatarURL())
                        .setDescription(`${config.crossEmoji} You currently have an application under review`)
                        .setColor(config.ErrorHexColor)
                        .setFooter(`Made by Zofux`)
                    return interaction.editReply({ embeds: [embed], ephemeral: true })
                }

                let date = new Date()
                date.setHours(date.getHours() + 2)

                new currentApplications({
                    userId: interaction.user.id,
                    guildId: interaction.guild.id,
                    application: application.toLowerCase(),
                    count: 0,
                    expires: date,
                    questions: []
                }).save().then(async () => {
                    let questionEmbed = new Discord.MessageEmbed()
                        .setColor(config.MainHexColor)
                        .setAuthor(`Application Started - Type "Cancel" to cancel the application`)
                        .setDescription(`**${res.questions[0]}**`)
                        .setFooter("You have two hours to complete the application")
                    interaction.user.send({ embeds: [questionEmbed] }).then(() => {
                        const embed = new Discord.MessageEmbed()
                            .setAuthor(interaction.user.username, interaction.user.displayAvatarURL())
                            .setDescription(`${config.checkEmoji} I have started the application process in your dm's`)
                            .setColor(config.SuccessHexColor)
                            .setFooter(`Made by Zofux`)
                        return interaction.editReply({ embeds: [embed], ephemeral: true })
                    }).catch(() => {
                        const embed = new Discord.MessageEmbed()
                            .setAuthor(interaction.user.username, interaction.user.displayAvatarURL())
                            .setDescription(`${config.crossEmoji} I am not able to send you a dm, please enable them and try again`)
                            .setColor(config.ErrorHexColor)
                            .setFooter(`Made by Zofux`)
                        return interaction.editReply({ embeds: [embed], ephemeral: true })
                    })
                })
            }
        }
    }
}