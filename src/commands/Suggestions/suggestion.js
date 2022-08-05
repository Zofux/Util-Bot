const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js')
const config = require(`../../../config.json`)

module.exports = {
    data: new SlashCommandBuilder()
        .setName(`suggestion`)
        .setDescription(`Interact with the suggestion system in your server`)
        .addSubcommand(subCommand =>
            subCommand
                .setName("channel")
                .setDescription("Set the suggestion channel")
                .addChannelOption(option =>
                    option.setName("channel")
                        .setDescription("The channel you want to set as the suggestion channel")
                        .setRequired(true)))
        .addSubcommand(subCommand =>
            subCommand
                .setName("reply")
                .setDescription("Reply to a suggestion")
                .addStringOption(option =>
                    option.setName(`id`)
                        .setDescription(`The sID of the suggestion you want to reply to`)
                        .setRequired(true)
                )
                .addStringOption(option =>
                    option.setName(`status`)
                        .setDescription('Reject or accept the suggestion')
                        .setRequired(true)
                        .addChoice("Reject", "reject")
                        .addChoice("Accept", "accept")
                    /*.addChoices(
                        [{ name: 'Reject', value: 'reject' }],
                        [{ name: 'Accept', value: 'accept' }]
                    )*/
                )
                .addStringOption(option =>
                    option.setName('reply')
                        .setDescription("The message you want to reply to the suggestion with, this will show on the reply embed")
                ),
        ),
    async execute(interaction, client) {
        await interaction.deferReply()

        if (interaction) {
            if (interaction.options.getSubcommand() === "reply") {
                const db = require("../../models/suggestions")

                const status = interaction.options.getString("status")
                const res = await db.findOne({ id: interaction.options.getString("id") })
                if (!interaction.member.permissions.has(Discord.Permissions.FLAGS.MANAGE_MESSAGES)) {
                    const embed = new Discord.MessageEmbed()
                        .setDescription(`${config.crossEmoji} You cannot use this command, as you do not have the \`MANAGE_MESSAGES\` permission in this server.`)
                        .setColor(config.ErrorHexColor)
                        .setAuthor(interaction.user.username, interaction.user.displayAvatarURL())
                        .setTimestamp()
                    return interaction.editReply({ embeds: [embed], ephemeral: true })
                }
                if (!res) {
                    const embed = new Discord.MessageEmbed()
                        .setDescription(`${config.crossEmoji} That sID is not valid`)
                        .setColor(config.ErrorHexColor)
                        .setAuthor(interaction.user.username, interaction.user.displayAvatarURL())
                        .setTimestamp()
                    return interaction.editReply({ embeds: [embed], ephemeral: true })
                } else if (res) {
                    if (!config.suggestionChannel) {
                        const embed = new Discord.MessageEmbed()
                            .setDescription(`${config.crossEmoji} The given \`suggestionChannel\` in the \`config.json\` is not valid`)
                            .setColor(config.ErrorHexColor)
                            .setAuthor(interaction.user.username, interaction.user.displayAvatarURL())
                            .setTimestamp()
                        return interaction.editReply({ embeds: [embed], ephemeral: true })
                    }
                    if (!res.status === "pending") {
                        const embed = new Discord.MessageEmbed()
                            .setDescription(`${config.crossEmoji} This suggestion has already been replied too`)
                            .setColor(config.ErrorHexColor)
                            .setAuthor(interaction.user.username, interaction.user.displayAvatarURL())
                            .setTimestamp()
                        return interaction.editReply({ embeds: [embed], ephemeral: true })
                    }
                    const channel = interaction.guild.channels.cache.get(config.suggestionChannel)
                    if (!channel) {
                        const embed = new Discord.MessageEmbed()
                            .setDescription(`${config.crossEmoji} The given \`suggestionChannel\` in the \`config.json\` is not a channel in this server`)
                            .setColor(config.ErrorHexColor)
                            .setAuthor(interaction.user.username, interaction.user.displayAvatarURL())
                            .setTimestamp()
                        return interaction.editReply({ embeds: [embed], ephemeral: true })
                    }
                    if (status == "reject") {
                        let embed = new Discord.MessageEmbed()
                            .setDescription(`**Submitter**\n<@${res.userId}>\n\n**Suggestion**\n${res.suggestion}\n\n**Rejected by**\n<@${interaction.user.id}>${interaction.options.getString("reply") ? `**\n\nRespone**\n${interaction.options.getString("reply")}` : ""}`)
                            .setColor(config.ErrorHexColor)
                            .setThumbnail(interaction.user.displayAvatarURL())
                            .setFooter(`sID: ${res.id}`)
                            .setAuthor(interaction.user.username, interaction.user.displayAvatarURL())
                            .setTimestamp();

                        if (interaction.channel.id === config.suggestionChannel) {
                            return interaction.editReply({ embeds: [embed] }).then(async () => {
                                const infoEmbed = new Discord.MessageEmbed()
                                    .setDescription(`Hey, <@${res.userId}>. Your suggestion with sID: \`${res.id}\` has been **rejected** by <@${interaction.user.id}>`)
                                    .setColor(config.ErrorHexColor)
                                    .setAuthor("Suggestion | Rejected")
                                    .setFooter(`Guild ID: ${interaction.guild.id} | sID: ${res.id}`)
                                    .setTimestamp()
                                interaction.guild.members.cache.get(res.userId).send({ embeds: [infoEmbed] }).then(async () => {
                                    await db.findOneAndUpdate({
                                        id: res.id
                                    }, {
                                        status: "accepted"
                                    }, {
                                        new: true,
                                        upsert: true
                                    })
                                })
                            })
                        } else if (!interaction.channel.id === config.suggestionChannel) {
                            channel.send({ embeds: [embed] }).then(async () => {
                                const SuccessEmbed = new Discord.MessageEmbed()
                                    .setDescription(`${config.checkEmoji} Successfully rejected sID: \`${res.id}\``)
                                    .setColor(config.SuccessHexColor)
                                    .setAuthor(interaction.user.username, interaction.user.displayAvatarURL())
                                    .setFooter(interaction.guild.name)
                                    .setTimestamp()
                                await interaction.editReply({ embeds: [SuccessEmbed] }).then(async () => {
                                    const infoEmbed = new Discord.MessageEmbed()
                                        .setDescription(`Hey, <@${res.userId}>. Your suggestion with sID: \`${res.id}\` has been **rejected** by <@${interaction.user.id}>`)
                                        .setColor(config.ErrorHexColor)
                                        .setAuthor("Suggestion | Rejected")
                                        .setFooter(`Guild ID: ${interaction.guild.id} | sID: ${res.id}`)
                                        .setTimestamp()

                                    interaction.guild.members.cache.get(res.userId).send({ embeds: [infoEmbed] }).then(async () => {
                                        await db.findOneAndUpdate({
                                            id: res.id
                                        }, {
                                            status: "accepted"
                                        }, {
                                            new: true,
                                            upsert: true
                                        })
                                    })
                                })
                            })
                        }
                    } else if (status == "accept") {

                        let embed = new Discord.MessageEmbed()
                            .setDescription(`**Submitter**\n<@${res.userId}>\n\n**Suggestion**\n${res.suggestion}\n\n**Accepted by**\n<@${interaction.user.id}>${interaction.options.getString("reply") ? `**\n\nRespone**\n${interaction.options.getString("reply")}` : ""}`)
                            .setColor(config.SuccessHexColor)
                            .setThumbnail(interaction.user.displayAvatarURL())
                            .setFooter(`sID: ${res.id}`)
                            .setAuthor(interaction.user.username, interaction.user.displayAvatarURL())
                            .setTimestamp();

                        if (interaction.channel.id === config.suggestionChannel) {
                            return interaction.editReply({ embeds: [embed] }).then(async () => {
                                const infoEmbed = new Discord.MessageEmbed()
                                    .setDescription(`Hey, <@${res.userId}>. Your suggestion with sID: \`${res.id}\` has been **accepted** by <@${interaction.user.id}>`)
                                    .setColor(config.SuccessHexColor)
                                    .setAuthor("Suggestion | Accepted")
                                    .setFooter(`Guild ID: ${interaction.guild.id} | sID: ${res.id}`)
                                    .setTimestamp()
                                interaction.guild.members.cache.get(res.userId).send({ embeds: [infoEmbed] }).then(async () => {
                                    await db.findOneAndUpdate({
                                        id: res.id
                                    }, {
                                        status: "accepted"
                                    }, {
                                        new: true,
                                        upsert: true
                                    })
                                })
                            })
                        } else if (!interaction.channel.id === config.suggestionChannel) {
                            channel.send({ embeds: [embed] }).then(async () => {
                                const SuccessEmbed = new Discord.MessageEmbed()
                                    .setDescription(`${config.checkEmoji} Successfully accepted sID: \`${res.id}\``)
                                    .setColor(config.SuccessHexColor)
                                    .setAuthor(interaction.user.username, interaction.user.displayAvatarURL())
                                    .setFooter(interaction.guild.name)
                                    .setTimestamp()
                                await interaction.editReply({ embeds: [SuccessEmbed] }).then(async () => {
                                    const infoEmbed = new Discord.MessageEmbed()
                                        .setDescription(`Hey, <@${res.userId}>. Your suggestion with sID: \`${res.id}\` has been **accepted** by <@${interaction.user.id}>`)
                                        .setColor(config.SuccessHexColor)
                                        .setAuthor("Suggestion | Accepted")
                                        .setFooter(`Guild ID: ${interaction.guild.id} | sID: ${res.id}`)
                                        .setTimestamp()
                                    interaction.guild.members.cache.get(res.userId).send({ embeds: [infoEmbed] }).then(async () => {
                                        await db.findOneAndUpdate({
                                            id: res.id
                                        }, {
                                            status: "accepted"
                                        }, {
                                            new: true,
                                            upsert: true
                                        })
                                    })
                                })
                            })
                        }
                    }
                }
            } else if (interaction.options.getSubcommand() === "channel") {
                const db = require("../../models/suggestionChannels")
                const channel = interaction.options.getChannel("channel")

                if (channel.type !== "GUILD_TEXT") {
                    const embed = new Discord.MessageEmbed()
                        .setAuthor(interaction.user.username, interaction.user.displayAvatarURL())
                        .setDescription(`${config.crossEmoji} Im afraid the channel needs to be a text channel`)
                        .setColor(config.ErrorHexColor)
                        .setFooter(`Made by Zofux`)
                    return interaction.editReply({ embeds: [embed], ephemeral: true })
                } else if (channel.type === "GUILD_TEXT") {
                    const res = await db.findOne({ guildId: interaction.guild.id })
                    if (res) {
                        await db.findOneAndUpdate({
                            guildId: interaction.guild.id
                        }, {
                            $set: { suggestionChannel: channel.id }
                        }, {
                            upsert: true
                        }).then(async () => {
                            const SuccessEmbed = new Discord.MessageEmbed()
                                .setDescription(`${config.checkEmoji} Successfully updated the suggestion channel to <#${channel.id}>`)
                                .setColor(config.SuccessHexColor)
                                .setAuthor(interaction.user.username, interaction.user.displayAvatarURL())
                                .setFooter("Made by Zofux")
                                .setTimestamp()
                            return await interaction.editReply({ embeds: [SuccessEmbed] })
                        })
                    } else if (!res) {
                        new db({
                            guildId: interaction.guild.id,
                            suggestionChannel: channel.id
                        }).save().then(async () => {
                            const SuccessEmbed = new Discord.MessageEmbed()
                                .setDescription(`${config.checkEmoji} Successfully set the suggestion channel to <#${channel.id}>`)
                                .setColor(config.SuccessHexColor)
                                .setAuthor(interaction.user.username, interaction.user.displayAvatarURL())
                                .setFooter("Made by Zofux")
                                .setTimestamp()
                            return await interaction.editReply({ embeds: [SuccessEmbed] })
                        })
                    }

                }
            }
        }
    }
}