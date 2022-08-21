const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js')
const config = require(`../../../config.json`)
const db = require('../../models/applications')

module.exports = {
    data: new SlashCommandBuilder()
        .setName(`application`)
        .setDescription(`Manage applications in your server`)
        .addSubcommand(subCommand =>
            subCommand.setName("create").setDescription("Create a new application")
                .addChannelOption(option => option.setName("category").setDescription("The category you want all applications to be saved under").setRequired(true))
                .addStringOption(option => option.setName("name").setDescription("The name you want to give your application").setRequired(true)))
        .addSubcommand(subCommand =>
            subCommand.setName("delete").setDescription("Delete a application in the server")
                .addStringOption(option => option.setName("name").setDescription("The name of the application you want to delete").setRequired(true)))
        .addSubcommand(subCommand =>
            subCommand.setName("list").setDescription("Get a list of all the applications in the current server")),
    async execute(interaction, client) {
        await interaction.deferReply()
        if (interaction.options.getSubcommand() === "create") {
            if (!interaction.member.permissions.has(Discord.Permissions.FLAGS.MANAGE_GUILD)) {
                const embed = new Discord.MessageEmbed()
                    .setDescription(`${config.crossEmoji} You cannot use this command, as you do not have the \`MANAGE_GUILD\` permission in this server.`)
                    .setColor(config.ErrorHexColor)
                    .setAuthor(interaction.user.username, interaction.user.displayAvatarURL())
                    .setTimestamp()
                return interaction.editReply({ embeds: [embed], ephemeral: true })
            }
            const channel = interaction.options.getChannel("category")

            if (channel.type !== "GUILD_CATEGORY") {
                const embed = new Discord.MessageEmbed()
                    .setAuthor(interaction.user.username, interaction.user.displayAvatarURL())
                    .setDescription(`${config.crossEmoji} Im afraid the category you gave isn't of the type \`Category\``)
                    .setColor(config.ErrorHexColor)
                    .setFooter(`Made by Zofux`)
                return interaction.editReply({ embeds: [embed], ephemeral: true })
            } else if (channel.type === "GUILD_CATEGORY") {
                const name = interaction.options.getString("name")
                const application = await db.findOne({ name: name, guildId: interaction.guild.id })
                if (application) {
                    const embed = new Discord.MessageEmbed()
                        .setAuthor(interaction.user.username, interaction.user.displayAvatarURL())
                        .setDescription(`${config.crossEmoji} There is already a application with that name in this server`)
                        .setColor(config.ErrorHexColor)
                        .setFooter(`Made by Zofux`)
                    return interaction.editReply({ embeds: [embed], ephemeral: true })
                }

                let count = 1
                let questions = []

                let firstEmbed = new Discord.MessageEmbed()
                    .setColor(config.MainHexColor)
                    .setDescription(`\`📝\` What is going to be question **#${count}**?\n\nIf you dont respond within **20 minutes** the application will get deleted`)
                interaction.editReply({ embeds: [firstEmbed] })

                const filter = m => m.author.id === interaction.user.id
                const collector = interaction.channel.createMessageCollector({ filter, time: 72000000 })

                collector.on("collect", m => {
                    if (m.content.toLowerCase() === "cancel") {
                        collector.stop()
                        let responseEmbed = new Discord.MessageEmbed()
                            .setColor(config.MainHexColor)
                            .setDescription("This application has been **Stopped**")
                        return m.channel.send({ embeds: [responseEmbed] })
                    } else if (m.content.toLowerCase() === "done") {
                        collector.stop()

                        new db({
                            guildId: interaction.guild.id,
                            name: name.toLowerCase(),
                            category: channel.id,
                            numberOfQuestions: (count - 1),
                            questions: questions,
                            applications: []
                        }).save().then(() => {
                            let responseEmbed = new Discord.MessageEmbed()
                                .setColor(config.MainHexColor)
                                .setDescription(`This application has been **Saved**, use \`/apply application:${name.toLowerCase()}\` to use it`)
                            return m.channel.send({ embeds: [responseEmbed] })
                        })
                        return;
                    } else if (count >= 10) {
                        let responseEmbed = new Discord.MessageEmbed()
                            .setColor(config.MainHexColor)
                            .setDescription("The maximum of 10 questions has been reached, type **Done** to save it or **Cancel** to cancel the process")
                        return m.channel.send({ embeds: [responseEmbed] })
                    }
                    let secondEmbed = new Discord.MessageEmbed()
                        .setColor(config.MainHexColor)
                        .setDescription(`\`📝\` What is going to be question **#${++count}**?\n\nType **Cancel** to cancel this application or **Done** to save it.`)
                    m.channel.send({ embeds: [secondEmbed] }).then(() => {
                        questions.push(m.content)
                    })
                })
            }
        } else if (interaction.options.getSubcommand() === "delete") {
            if (!interaction.member.permissions.has(Discord.Permissions.FLAGS.MANAGE_GUILD)) {
                const embed = new Discord.MessageEmbed()
                    .setDescription(`${config.crossEmoji} You cannot use this command, as you do not have the \`MANAGE_GUILD\` permission in this server.`)
                    .setColor(config.ErrorHexColor)
                    .setAuthor(interaction.user.username, interaction.user.displayAvatarURL())
                    .setTimestamp()
                return interaction.editReply({ embeds: [embed], ephemeral: true })
            }

            const name = interaction.options.getString("name")
            const res = await db.findOne({ guildId: interaction.guild.id, name: name })
            if (!res) {
                const embed = new Discord.MessageEmbed()
                    .setDescription(`${config.crossEmoji} I couldn't find a application in this server with that name`)
                    .setColor(config.ErrorHexColor)
                    .setAuthor(interaction.user.username, interaction.user.displayAvatarURL())
                    .setFooter(interaction.guild.name)
                    .setTimestamp()
                return interaction.editReply({ embeds: [embed], ephemeral: true })
            } else if (res) {
                await db.findOneAndDelete({ guildId: interaction.guild.id, name: name }).then(async () => {
                    const embed = new Discord.MessageEmbed()
                        .setDescription(`${config.checkEmoji} Deleted the application with the name \`${name}\``)
                        .setColor(config.SuccessHexColor)
                        .setAuthor(interaction.user.username, interaction.user.displayAvatarURL())
                        .setFooter(interaction.guild.name)
                        .setTimestamp()
                    return interaction.editReply({ embeds: [embed], ephemeral: true })
                })
            }
        } else if (interaction.options.getSubcommand() === "list") {
            const res = await db.find({ guildId: interaction.guild.id })
            if (!res[0]) {
                const embed = new Discord.MessageEmbed()
                    .setDescription(`${config.crossEmoji} There are no applications in this server`)
                    .setColor(config.ErrorHexColor)
                    .setAuthor(interaction.user.username, interaction.user.displayAvatarURL())
                    .setFooter(interaction.guild.name)
                    .setTimestamp()
                return interaction.editReply({ embeds: [embed], ephemeral: true })
            } else if (res[0]) {
                console.log(res)
                const embed = new Discord.MessageEmbed()
                    .setColor(config.MainHexColor)
                    .setAuthor(interaction.user.username, interaction.user.displayAvatarURL())
                    .setDescription(
                        `Here are all the applications in **${interaction.guild.name}**:\n\n` +
                        res.map(o => `\`${o.name}\` with **${o.numberOfQuestions}** questions\n`) +
                        "\nYou can use `/apply application:<application name>` to apply"
                    )
                    .setFooter("Made by Zofux")
                return interaction.editReply({ embeds: [embed] })
            }
        }
    }
}