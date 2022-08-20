const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js')
const config = require(`../../../config.json`)

module.exports = {
    data: new SlashCommandBuilder()
        .setName(`modmail`)
        .setDescription(`Manage the ModMail in your server`)
        .addSubcommand(subCommand =>
            subCommand
                .setName("channel")
                .setDescription("Set the modmail channel")
                .addChannelOption(option =>
                    option.setName("category")
                        .setDescription("The category you want modmail to be created under")
                        .setRequired(true))),
    async execute(interaction, client) {
        await interaction.deferReply({})

        if (interaction) {
            if (interaction.options.getSubcommand() === "channel") {
                const db = require("../../models/modmail")
                const channel = interaction.options.getChannel("category")

                if (channel.type !== "GUILD_CATEGORY") {
                    const embed = new Discord.MessageEmbed()
                        .setAuthor(interaction.user.username, interaction.user.displayAvatarURL())
                        .setDescription(`${config.crossEmoji} Im afraid the channel needs to be a category`)
                        .setColor(config.ErrorHexColor)
                        .setFooter(`Made by Zofux`)
                    return interaction.editReply({ embeds: [embed], ephemeral: true })
                } else if (channel.type === "GUILD_CATEGORY") {
                    const res = await db.findOne({ guildId: interaction.guild.id })
                    if (res) {
                        await db.findOneAndUpdate({
                            guildId: interaction.guild.id
                        }, {
                            $set: { categoryId: channel.id }
                        }, {
                            upsert: true
                        }).then(async () => {
                            const SuccessEmbed = new Discord.MessageEmbed()
                                .setDescription(`${config.checkEmoji} Successfully updated the modmail category to <#${channel.id}>`)
                                .setColor(config.SuccessHexColor)
                                .setAuthor(interaction.user.username, interaction.user.displayAvatarURL())
                                .setFooter("Made by Zofux")
                                .setTimestamp()
                            return await interaction.editReply({ embeds: [SuccessEmbed], ephemeral: true })
                        })
                    } else if (!res) {
                        new db({
                            guildId: interaction.guild.id,
                            categoryId: channel.id,
                            mail: []
                        }).save().then(async () => {
                            const SuccessEmbed = new Discord.MessageEmbed()
                                .setDescription(`${config.checkEmoji} Successfully set the modmail category to <#${channel.id}>`)
                                .setColor(config.SuccessHexColor)
                                .setAuthor(interaction.user.username, interaction.user.displayAvatarURL())
                                .setFooter("Made by Zofux")
                                .setTimestamp()
                            return await interaction.editReply({ embeds: [SuccessEmbed], ephemeral: true })
                        })
                    }

                }
            }
        }
    }
}