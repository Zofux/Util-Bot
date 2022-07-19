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
        ),
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true })

        if (!intreaction.member.voice) {
            const embed = new Discord.MessageEmbed()
                .setAuthor(`Captcha Active`)
                .setDescription(`${config.crossEmoji} You are not currently in any voice channel`)
                .setColor(`#ff7575`)
                .setFooter(`Made by Zofux`)
            return interaction.editReply({ embeds: [embed], ephemeral: true })
        } else {
            const res = await db.findOne({ userId: interaction.user.id })
            if (!res) {
                const embed = new Discord.MessageEmbed()
                    .setAuthor(`Captcha Active`)
                    .setDescription(`${config.crossEmoji} You are not in charge of the current voice channel`)
                    .setColor(`#ff7575`)
                    .setFooter(`Made by Zofux`)
                return interaction.editReply({ embeds: [embed], ephemeral: true })
            } else if (res) {
                if (!interaction.member.voice.channelId === res.voiceChannel) {
                    const embed = new Discord.MessageEmbed()
                        .setAuthor(`Captcha Active`)
                        .setDescription(`${config.crossEmoji} You are not in charge of the current voice channel`)
                        .setColor(`#ff7575`)
                        .setFooter(`Made by Zofux`)
                    return interaction.editReply({ embeds: [embed], ephemeral: true })
                } else if (interaction.member.voice.channelId === res.voiceChannel) {
                    if (interaction.member.voice.channel.name.includes("🔓")) {
                        interaction.member.voice.channel.permissionOverwrites.set([
                            {
                                id: config.guild,
                                deny: [Discord.Permissions.FLAGS.VIEW_CHANNEL],
                            },
                            {
                                id: config.memberRole,
                                deny: [Discord.Permissions.FLAGS.VIEW_CONNECT],
                                allow: [Discord.Permissions.FLAGS.VIEW_CHANNEL]
                            },
                            {
                                id: interaction.user.id,
                                allow: [Discord.Permissions.FLAGS.VIEW_CHANNEL, Discord.Permissions.FLAGS.VIEW_CONNECT],
                            },
                        ]).then(async () => {
                            interaction.member.voice.channel.setName(`🔒｜${interaction.user.username}'s channel`)
                        });
                    } else if (interaction.member.voice.channel.name.includes("🔒")) {
                        interaction.member.voice.channel.permissionOverwrites.set([
                            {
                                id: config.guild,
                                deny: [Discord.Permissions.FLAGS.VIEW_CHANNEL],
                            },
                            {
                                id: config.memberRole,
                                allow: [Discord.Permissions.FLAGS.VIEW_CHANNEL, Discord.Permissions.FLAGS.VIEW_CONNECT]
                            },
                            {
                                id: interaction.user.id,
                                allow: [Permissions.FLAGS.VIEW_CHANNEL, Discord.Permissions.FLAGS.VIEW_CONNECT],
                            },
                        ]).then(async () => {
                            interaction.member.voice.channel.setName(`🔒｜${interaction.user.username}'s channel`)
                        });
                    }
                }
            }
        }
    }
}