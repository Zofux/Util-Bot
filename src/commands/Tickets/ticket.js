const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js')
const config = require(`../../../config.json`)
const db = require('../../models/ticketTools')

module.exports = {
    data: new SlashCommandBuilder()
        .setName(`ticket`)
        .setDescription(`Control tickets`)
        .addSubcommand(subCommand =>
            subCommand
                .setName("create")
                .setDescription("Create a ticket tool in the current channel")
                .addChannelOption(option =>
                    option.setName(`category`).setDescription(`The category the tickets should be created under`).setRequired(true)
                ),
        ),
    async execute(interaction) {
        await interaction.deferReply()

        if (interaction) {
            if (interaction.options.getSubcommand() === "create") {
                if (!interaction.member.permissions.has(Discord.Permissions.FLAGS.MANAGE_GUILD)) {
                    const embed = new Discord.MessageEmbed()
                        .setDescription(`${config.crossEmoji} You can't use this command`)
                        .setColor(config.ErrorHexColor)
                        .setAuthor(interaction.user.username, interaction.user.displayAvatarURL())
                        .setFooter(interaction.guild.name)
                        .setTimestamp()
                    return interaction.editReply({ embeds: [embed], ephemeral: true })
                }

                const channel = interaction.options.getChannel("category")
                if (channel.type != "GUILD_CATEGORY") {
                    const embed = new Discord.MessageEmbed()
                        .setDescription(`${config.crossEmoji} The given channel must be of the type: \`GUILD_CATEGORY\``)
                        .setColor(config.ErrorHexColor)
                        .setAuthor(interaction.user.username, interaction.user.displayAvatarURL())
                        .setFooter(interaction.guild.name)
                        .setTimestamp()
                    return interaction.editReply({ embeds: [embed], ephemeral: true })
                } else if (channel.type == "GUILD_CATEGORY") {
                    const embed = new Discord.MessageEmbed()
                        .setTitle("Open a ticket!")
                        .setDescription(`Click the button below to open a ticket.`)
                        .setColor(config.MainHexColor)
                        .setFooter(`Made by Zofux`)

                    const Button = new Discord.MessageActionRow()
                    .addComponents(
                        new Discord.MessageButton()
                        .setCustomId("ticket")
                        .setLabel("Open a Ticket!")
                        .setEmoji("📩")
                        .setStyle("PRIMARY")
                    )
                    
                    await interaction.editReply({ embeds: [embed], components: [Button] }).then(msg => {
                        new db({
                            messageId: msg.id,
                            categoryId: channel.id
                        }).save()
                    })
                }
            }
        }
    }
}