const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js')
const config = require(`../../../config.json`)
const ms = require('ms')

module.exports = {
    data: new SlashCommandBuilder()
        .setName(`slowmode`)
        .setDescription(`change the slowmode in a channel`)
        .addChannelOption(option =>
            option.setName(`channel`).setDescription(`The channel the slowmode should get changed in`).setRequired(true))
        .addStringOption(option =>
            option.setName(`slowmode`).setDescription(`The new slowmode (ex: 2h)`).setRequired(true)),
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true })

        if (!config.log) {
            const embed = new Discord.MessageEmbed()
                .setAuthor(`No verify channel`)
                .setDescription(`${config.crossEmoji} I currently have no valid value for the \`log\` in my \`config.json\``)
                .addField("Valid format (in the config.json)", "```log: \"#ID of the Text channel\"```")
                .setColor(config.ErrorHexColor)
                .setFooter(`Made by Zofux`)
            return interaction.editReply({ embeds: [embed], ephemeral: true })
        } else if (config.log) {
            const logChannel = interaction.guild.channels.cache.get(config.log)
            if (!logChannel) {
                const embed = new Discord.MessageEmbed()
                    .setAuthor(`No log channel`)
                    .setDescription(`${config.crossEmoji} The given \`log\` in my \`config.json\` is not a channel in this server`)
                    .addField("Valid format (in the config.json)", "```log: \"#ID of the Text channel\"```")
                    .setColor(config.ErrorHexColor)
                    .setFooter(`Made by Zofux`)
                return interaction.editReply({ embeds: [embed], ephemeral: true })
            }
        }

        const rawTime = interaction.options.getString(`slowmode`)
        const channel = interaction.options.getChannel(`channel`)

        if (channel.type !== "GUILD_TEXT") {
            const embed = new Discord.MessageEmbed()
                    .setAuthor(`No log channel`)
                    .setDescription(`${config.crossEmoji} Im afraid the channel needs to be a text channel`)
                    .setColor(config.ErrorHexColor)
                    .setFooter(`Made by Zofux`)
                return interaction.editReply({ embeds: [embed], ephemeral: true })
        } else {
            const time = ms(rawTime)
            console.log(time)
        }

    }
}