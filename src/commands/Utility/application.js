const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js')
const config = require(`../../../config.json`)
const { Modal, TextInputComponent, SelectMenuComponent, showModal } = require('discord-modals'); // Import all
const db = require('../../models/applications')

module.exports = {
    data: new SlashCommandBuilder()
        .setName(`application`)
        .setDescription(`Manage applications in your server`)
        .addSubcommand(subCommand =>
            subCommand.setName("staff").setDescription("Apply for a posistion in our staff team"))
        .addSubcommand(subCommand =>
            subCommand.setName("create").setDescription("Create a new application")
                .addChannelOption(option => option.setName("category").setDescription("The category you want all applications to be saved under").setRequired(true))
                .addStringOption("name").setDescription("The name you want to give your application").setRequired(true))
        .addSubcommand(subCommand =>
            subCommand.setName("delete").setDescription("Delete a application in the server")
                .addStringOption(option => option.setName("name").setDescription("The name of the application you want to delete").setRequired(true))),
    async execute(interaction, client) {
        if (interaction.options.getSubcommand() === "create") {
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

                let count = 1
                let questions = []

                interaction.reply(`\`📝\` What is going to be question **#${count}**?\nIf you dont respond within **20 minutes** the application will get deleted`)

                const filter = m => m.author.id === interaction.user.id
                const collector = interaction.channel.createMessageCollector({ filter, time: 72000000 })
                
                collector.on("collect", m => {
                    if (m.content.toLowerCase() === "cancel") {
                        return collector.stop().then(() => m.channel.send("This application has been **Stopped**"))
                    } else if (m.conent.toLowerCase() === "done") {
                        return collector.stop().then(() => m.channel.send(`This application has been **Saved**, use \`/apply application:${name}\` to use it`))
                    }
                    m.channel.send(`\`\`📝\` What is going to be question **#${++count}**? Type **Cancel** to cancel this application or **Done** to save it.`).then(() => {
                        questions.push(m.content)
                        console.log(questions)
                        console.log(count)
                    })
                })
            }
        } else if (interaction.options.getSubcommand() === "delete") {
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
        }
        else if (interaction.options.getSubcommand() === "staff") {
            const modal = new Modal()
                .setCustomId("staff")
                .setTitle("Staff Application")
                .addComponents(
                    new TextInputComponent()
                        .setCustomId("time-zone")
                        .setLabel("What time zone are you in?")
                        .setStyle("SHORT")
                        .setRequired(true),

                    new TextInputComponent()
                        .setCustomId("age")
                        .setLabel("How old are you?")
                        .setStyle("SHORT")
                        .setRequired(true),

                    new TextInputComponent()
                        .setCustomId("part")
                        .setLabel("Why do you want to become a moderator")
                        .setStyle("LONG")
                        .setRequired(true),

                    new TextInputComponent()
                        .setCustomId("goal")
                        .setLabel("What are your goals as a moderator")
                        .setStyle("LONG")
                        .setRequired(true),

                    new TextInputComponent()
                        .setCustomId("why")
                        .setLabel("Why should we choose you?")
                        .setStyle("LONG")
                        .setRequired(true),
                )
            showModal(modal, {
                client: client,
                interaction: interaction,
            });
        }
    }
}