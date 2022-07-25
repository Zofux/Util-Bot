const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js')
const config = require(`../../../config.json`)
const db = require('../../models/joinToCreate')

module.exports = {
    data: new SlashCommandBuilder()
        .setName(`voice`)
        .setDescription(`Control your custom voice channel`)
        .addSubcommand(subCommand =>
            subCommand
                .setName("lock")
                .setDescription("Lock/unlock your custom voice channel")
        )
        .addSubcommand(subCommand =>
            subCommand
                .setName("kick")
                .setDescription("Kick someone from your voice channel")
                .addUserOption(option =>
                    option.setName(`user`).setDescription(`The user that should get kicked from your voice channel`).setRequired(true)
                ),
        )
        .addSubcommand(subCommand =>
            subCommand
                .setName("mute")
                .setDescription("Mute someone in your voice channel, use the command again to disable")
                .addUserOption(option =>
                    option.setName(`user`).setDescription(`The user that should get muted in your voice channel`).setRequired(true)
                ),
        )
        .addSubcommand(subCommand =>
            subCommand
                .setName("ban")
                .setDescription("Make someone unable to join your voice channel, use the command again to disable")
                .addUserOption(option =>
                    option.setName(`user`).setDescription(`The user that should get banned from your voice channel`).setRequired(true)
                ),
        ),
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true })

        if (interaction)
            if (!interaction.member.voice) {
                const embed = new Discord.MessageEmbed()
                    .setAuthor(`Not in a channel`)
                    .setDescription(`${config.crossEmoji} You are not currently in any voice channel`)
                    .setColor(`#ff7575`)
                    .setFooter(`Made by Zofux`)
                return interaction.editReply({ embeds: [embed], ephemeral: true })
            } else {
                const res = await db.findOne({ userId: interaction.user.id })
                if (!res) {
                    const embed = new Discord.MessageEmbed()
                        .setAuthor(`Not in charge`)
                        .setDescription(`${config.crossEmoji} You are not in charge of the current voice channel`)
                        .setColor(`#ff7575`)
                        .setFooter(`Made by Zofux`)
                    return interaction.editReply({ embeds: [embed], ephemeral: true })
                } else if (res) {
                    if (!interaction.member.voice.channelId === res.voiceChannel) {
                        const embed = new Discord.MessageEmbed()
                            .setAuthor(`Not in charge`)
                            .setDescription(`${config.crossEmoji} You are not in charge of the current voice channel`)
                            .setColor(`#ff7575`)
                            .setFooter(`Made by Zofux`)
                        return interaction.editReply({ embeds: [embed], ephemeral: true })

                    }
                    if (interaction.options.getSubcommand() === "lock") {
                        if (res.locked == false) {
                            interaction.member.voice.channel.permissionOverwrites.set([
                                {
                                    id: config.guild,
                                    deny: ["VIEW_CHANNEL"],
                                },
                                {
                                    id: config.memberRole,
                                    deny: ["CONNECT"],
                                    allow: ["VIEW_CHANNEL"]
                                },
                                {
                                    id: interaction.user.id,
                                    allow: ["VIEW_CHANNEL", "CONNECT"],
                                },
                            ]).then(async () => {
                                await db.findOneAndUpdate({
                                    userId: interaction.user.id
                                }, {
                                    locked: true
                                }, {
                                    new: true,
                                    upsert: true
                                })
                                const answerEmbed = new Discord.MessageEmbed()
                                    .setAuthor(interaction.user.username, interaction.user.displayAvatarURL())
                                    .setDescription(`🔒 I've locked your voice channel for you`)
                                    .setColor('#43d490')
                                    .setFooter(`Made by Zofux`)
                                return interaction.editReply({ embeds: [answerEmbed], ephemeral: true })
                            });
                        } else if (res.locked == true) {
                            interaction.member.voice.channel.permissionOverwrites.set([
                                {
                                    id: config.guild,
                                    deny: ["VIEW_CHANNEL"],
                                },
                                {
                                    id: config.memberRole,
                                    allow: ["VIEW_CHANNEL", "CONNECT"]
                                },
                                {
                                    id: interaction.user.id,
                                    allow: ["VIEW_CHANNEL", "CONNECT"],
                                },
                            ]).then(async () => {
                                await db.findOneAndUpdate({
                                    userId: interaction.user.id
                                }, {
                                    locked: false
                                }, {
                                    new: true,
                                    upsert: true
                                })
                                const answerEmbed = new Discord.MessageEmbed()
                                    .setAuthor(interaction.user.username, interaction.user.displayAvatarURL())
                                    .setDescription(`🔓 I've unlocked your voice channel for you`)
                                    .setColor('#43d490')
                                    .setFooter(`Made by Zofux`)
                                return interaction.editReply({ embeds: [answerEmbed], ephemeral: true })
                            });
                        }
                    } else if (interaction.options.getSubcommand() === "kick") {
                        const user = interaction.options.getUser(`user`)
                        const member = interaction.options.getMember(`user`)
                        if (!interaction.guild.members.cache.get(user.id)) {
                            const embed = new Discord.MessageEmbed()
                                .setDescription(`${config.crossEmoji} That user is not in this server`)
                                .setColor(`#ff7575`)
                                .setAuthor(interaction.user.username, interaction.user.displayAvatarURL())
                                .setFooter("Made by Zofux")
                                .setTimestamp()
                            return interaction.editReply({ embeds: [embed], ephemeral: true })
                        }
                        if (!member.voice) {
                            const embed = new Discord.MessageEmbed()
                                .setDescription(`${config.crossEmoji} That user is not in a voice channel`)
                                .setColor(`#ff7575`)
                                .setAuthor(interaction.user.username, interaction.user.displayAvatarURL())
                                .setFooter("Made by Zofux")
                                .setTimestamp()
                            return interaction.editReply({ embeds: [embed], ephemeral: true })
                        }
                        if (member.voice.channelId !== interaction.member.voice.channelId) {
                            const embed = new Discord.MessageEmbed()
                                .setDescription(`${config.crossEmoji} That user is not in this voice channel`)
                                .setColor(`#ff7575`)
                                .setAuthor(interaction.user.username, interaction.user.displayAvatarURL())
                                .setFooter("Made by Zofux")
                                .setTimestamp()
                            return interaction.editReply({ embeds: [embed], ephemeral: true })
                        }

                        member.voice.setChannel(null).then(() => {
                            const answerEmbed = new Discord.MessageEmbed()
                                .setAuthor(interaction.user.username, interaction.user.displayAvatarURL())
                                .setDescription(`${config.checkEmoji} I've kicked <@${user.id}> from <#${res.voiceChannel}>`)
                                .setColor('#43d490')
                                .setFooter(`Made by Zofux`)
                            return interaction.editReply({ embeds: [answerEmbed], ephemeral: true })
                        });
                    } else if (interaction.options.getSubcommand() === "mute") {
                        const user = interaction.options.getUser(`user`)
                        const member = interaction.options.getMember(`user`)
                        if (!interaction.guild.members.cache.get(user.id)) {
                            const embed = new Discord.MessageEmbed()
                                .setDescription(`${config.crossEmoji} That user is not in this server`)
                                .setColor(`#ff7575`)
                                .setAuthor(interaction.user.username, interaction.user.displayAvatarURL())
                                .setFooter("Made by Zofux")
                                .setTimestamp()
                            return interaction.editReply({ embeds: [embed], ephemeral: true })
                        }
                        if (!member.voice) {
                            const embed = new Discord.MessageEmbed()
                                .setDescription(`${config.crossEmoji} That user is not in a voice channel`)
                                .setColor(`#ff7575`)
                                .setAuthor(interaction.user.username, interaction.user.displayAvatarURL())
                                .setFooter("Made by Zofux")
                                .setTimestamp()
                            return interaction.editReply({ embeds: [embed], ephemeral: true })
                        }
                        if (member.voice.channelId !== interaction.member.voice.channelId) {
                            const embed = new Discord.MessageEmbed()
                                .setDescription(`${config.crossEmoji} That user is not in this voice channel`)
                                .setColor(`#ff7575`)
                                .setAuthor(interaction.user.username, interaction.user.displayAvatarURL())
                                .setFooter("Made by Zofux")
                                .setTimestamp()
                            return interaction.editReply({ embeds: [embed], ephemeral: true })
                        }

                        if (!res.muted.includes(`${user.id}`)) {
                            await db.findOneAndUpdate({
                                userId: interaction.user.id
                            }, {
                                $push: { muted: `${user.id}` }
                            }, {
                                new: true,
                                upsert: true
                            }).then(() => {
                                interaction.member.voice.channel.permissionOverwrites.set([
                                    {
                                        id: config.guild,
                                        deny: ["VIEW_CHANNEL"],
                                    },
                                    {
                                        id: config.memberRole,
                                        allow: ["VIEW_CHANNEL", "CONNECT"]
                                    },
                                    {
                                        id: interaction.user.id,
                                        allow: ["VIEW_CHANNEL", "CONNECT"],
                                    },
                                    {
                                        id: user.id,
                                        deny: ["SPEAK"]
                                    }
                                ]).then(() => {
                                    const answerEmbed = new Discord.MessageEmbed()
                                        .setAuthor(interaction.user.username, interaction.user.displayAvatarURL())
                                        .setDescription(`${config.checkEmoji} I've muted <@${user.id}> in <#${res.voiceChannel}>, this will take effect if they join again. Use \`/voice kick\` to remove them`)
                                        .setColor('#43d490')
                                        .setFooter(`Made by Zofux`)
                                    return interaction.editReply({ embeds: [answerEmbed], ephemeral: true })
                                })
                            })
                        } else if (res.muted.includes(`${user.id}`)) {
                            await db.findOneAndUpdate({
                                userId: interaction.user.id
                            }, {
                                $pull: { muted: `${user.id}` }
                            }, {
                                new: true,
                                upsert: true
                            }).then(() => {
                                interaction.member.voice.channel.permissionOverwrites.set([
                                    {
                                        id: config.guild,
                                        deny: ["VIEW_CHANNEL"],
                                    },
                                    {
                                        id: config.memberRole,
                                        allow: ["VIEW_CHANNEL", "CONNECT"]
                                    },
                                    {
                                        id: interaction.user.id,
                                        allow: ["VIEW_CHANNEL", "CONNECT"],
                                    },
                                ]).then(() => {
                                    const answerEmbed = new Discord.MessageEmbed()
                                        .setAuthor(interaction.user.username, interaction.user.displayAvatarURL())
                                        .setDescription(`${config.checkEmoji} I've unmuted <@${user.id}> in <#${res.voiceChannel}>, this will take effect if they join again. Use \`/voice kick\` to remove them`)
                                        .setColor('#43d490')
                                        .setFooter(`Made by Zofux`)
                                    return interaction.editReply({ embeds: [answerEmbed], ephemeral: true })
                                })
                            })
                        }
                    } else if (interaction.options.getSubcommand() === "ban") {
                        const user = interaction.options.getUser(`user`)
                        const member = interaction.options.getMember(`user`)
                        if (!interaction.guild.members.cache.get(user.id)) {
                            const embed = new Discord.MessageEmbed()
                                .setDescription(`${config.crossEmoji} That user is not in this server`)
                                .setColor(`#ff7575`)
                                .setAuthor(interaction.user.username, interaction.user.displayAvatarURL())
                                .setFooter("Made by Zofux")
                                .setTimestamp()
                            return interaction.editReply({ embeds: [embed], ephemeral: true })
                        }

                        if (!res.blacklisted.includes(`${user.id}`)) {
                            await db.findOneAndUpdate({
                                userId: interaction.user.id
                            }, {
                                $push: { blacklisted: `${user.id}` }
                            }, {
                                new: true,
                                upsert: true
                            }).then(() => {
                                interaction.member.voice.channel.permissionOverwrites.set([
                                    {
                                        id: config.guild,
                                        deny: ["VIEW_CHANNEL"],
                                    },
                                    {
                                        id: config.memberRole,
                                        allow: ["VIEW_CHANNEL", "CONNECT"]
                                    },
                                    {
                                        id: interaction.user.id,
                                        allow: ["VIEW_CHANNEL", "CONNECT"],
                                    },
                                    {
                                        id: user.id,
                                        deny: ["CONNECT"]
                                    }
                                ]).then(() => {
                                    if (member.voice) {
                                        if (member.voice.channelId === interaction.member.voice.channelId) {
                                            member.voice.setChannel(null).then(() => {
                                                const answerEmbed = new Discord.MessageEmbed()
                                                    .setAuthor(interaction.user.username, interaction.user.displayAvatarURL())
                                                    .setDescription(`${config.checkEmoji} I've banned <@${user.id}> in <#${res.voiceChannel}>, use the command again to unban them.`)
                                                    .setColor('#43d490')
                                                    .setFooter(`Made by Zofux`)
                                                return interaction.editReply({ embeds: [answerEmbed], ephemeral: true })
                                            })
                                        }
                                    } else {
                                        member.voice.setChannel(null).then(() => {
                                            const answerEmbed = new Discord.MessageEmbed()
                                                .setAuthor(interaction.user.username, interaction.user.displayAvatarURL())
                                                .setDescription(`${config.checkEmoji} I've banned <@${user.id}> in <#${res.voiceChannel}>, use the command again to unban them.`)
                                                .setColor('#43d490')
                                                .setFooter(`Made by Zofux`)
                                            return interaction.editReply({ embeds: [answerEmbed], ephemeral: true })
                                        })
                                    }
                                })
                            })
                        } else if (res.blacklisted.includes(`${user.id}`)) {
                            await db.findOneAndUpdate({
                                userId: interaction.user.id
                            }, {
                                $pull: { blacklisted: `${user.id}` }
                            }, {
                                new: true,
                                upsert: true
                            }).then(() => {
                                interaction.member.voice.channel.permissionOverwrites.set([
                                    {
                                        id: config.guild,
                                        deny: ["VIEW_CHANNEL"],
                                    },
                                    {
                                        id: config.memberRole,
                                        allow: ["VIEW_CHANNEL", "CONNECT"]
                                    },
                                    {
                                        id: interaction.user.id,
                                        allow: ["VIEW_CHANNEL", "CONNECT"],
                                    },
                                ]).then(() => {
                                    const answerEmbed = new Discord.MessageEmbed()
                                        .setAuthor(interaction.user.username, interaction.user.displayAvatarURL())
                                        .setDescription(`${config.checkEmoji} I've unbanned <@${user.id}> in <#${res.voiceChannel}>`)
                                        .setColor('#43d490')
                                        .setFooter(`Made by Zofux`)
                                    return interaction.editReply({ embeds: [answerEmbed], ephemeral: true })
                                })
                            })
                        }
                    }


                }
            }
    }
}