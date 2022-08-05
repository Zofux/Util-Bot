const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js')
const config = require(`../../../config.json`)
const db = require('../../models/filter')

module.exports = {
    data: new SlashCommandBuilder()
        .setName(`filer`)
        .setDescription(`Filter words in your server`)
        .addSubcommand(subCommand =>
            subCommand.setName("remove")
                .setDescription("Remove a word from the filter")
                .addStringOption(option =>
                    option.setName("word").setDescription("The word you want to remove from the filter").setRequired(true)))
        .addSubcommand(subCommand =>
            subCommand.setName("add")
                .setDescription("Add a word to the filter")
                .addStringOption(option =>
                    option.setName("word").setDescription("The word you want to filter").setRequired(true)))
        .addSubcommand(subCommand =>
            subCommand.setName("display")
                .setDescription("Display all the words in the filter")),
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true })
        if (interaction) {
            if (interaction.options.getSubcommand() === "add") {
                const word = interaction.options.getString("word")

                const res = await db.findOne({ guildId: interaction.guild.id })
                if (!res) {
                    new db({
                        guildId: interaction.guild.id,
                        words: [word]
                    }).save().then(async () => {
                        const SuccessEmbed = new Discord.MessageEmbed()
                            .setDescription(`${config.checkEmoji} Added \`${word}\` to the blacklisted words`)
                            .setColor(config.SuccessHexColor)
                            .setAuthor(interaction.user.username, interaction.user.displayAvatarURL())
                            .setFooter("Made by Zofux")
                            .setTimestamp()
                        return await interaction.editReply({ embeds: [SuccessEmbed], ephemeral: true })
                    })
                } else if (res) {
                    await db.findOneAndUpdate({
                        guildId: interaction.guild.id
                    }, {
                        $push: { words: word }
                    }, {
                        upsert: true
                    }).then(async () => {
                        const SuccessEmbed = new Discord.MessageEmbed()
                            .setDescription(`${config.checkEmoji} **Added** \`${word}\` to the word-filter`)
                            .setColor(config.SuccessHexColor)
                            .setAuthor(interaction.user.username, interaction.user.displayAvatarURL())
                            .setFooter("Made by Zofux")
                            .setTimestamp()
                        return await interaction.editReply({ embeds: [SuccessEmbed], ephemeral: true })
                    })
                }
            } else if (interaction.options.getSubcommand() === "remove") {
                const word = interaction.options.getString("word")
                const res = await db.findOne({ guildId: interaction.guild.id, words: word })
                if (!res) {
                    const embed = new Discord.MessageEmbed()
                        .setAuthor(interaction.user.username, interaction.user.displayAvatarURL())
                        .setDescription(`${config.crossEmoji} That word is not in this server's word-filter`)
                        .setColor(config.ErrorHexColor)
                        .setFooter(`Made by Zofux`)
                    return interaction.editReply({ embeds: [embed], ephemeral: true })
                } else if (res) {
                    await db.findOneAndUpdate({
                        guildId: interaction.guild.id
                    }, {
                        $pull: { words: word }
                    }, {
                        upsert: true
                    }).then(async () => {
                        const SuccessEmbed = new Discord.MessageEmbed()
                            .setDescription(`${config.checkEmoji} **Removed** \`${word}\` from the word-filter`)
                            .setColor(config.SuccessHexColor)
                            .setAuthor(interaction.user.username, interaction.user.displayAvatarURL())
                            .setFooter("Made by Zofux")
                            .setTimestamp()
                        return await interaction.editReply({ embeds: [SuccessEmbed], ephemeral: true })
                    })
                }
            } else if (interaction.options.getSubcommand() === "display") {
                const res = await db.findOne({ guildId: interaction.guild.id })

                if (!res) {
                    const embed = new Discord.MessageEmbed()
                        .setAuthor(interaction.user.username, interaction.user.displayAvatarURL())
                        .setDescription(`${config.crossEmoji} This server doesn't have any words in the word-filter`)
                        .setColor(config.ErrorHexColor)
                        .setFooter(`Made by Zofux`)
                    return interaction.editReply({ embeds: [embed], ephemeral: true })
                } else if (res) {
                    const embed = new Discord.MessageEmbed()
                        .setColor(config.MainHexColor)
                        .addField("Word-Filter:", `\`\`\`${res.words.join(", ")}\`\`\``)
                        .setAuthor(interaction.user.username, interaction.user.displayAvatarURL())
                        .setFooter("Made by Zofux")
                        .setTimestamp()
                    return await interaction.editReply({ embeds: [embed], ephemeral: true })
                }
            }
        }
    }
}