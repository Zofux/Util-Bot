const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js')
const config = require(`../../../config.json`)

module.exports = {
    data: new SlashCommandBuilder()
        .setName(`unmute`)
        .setDescription(`Mutes a given user`)
        .addUserOption(option =>
            option.setName(`user`).setDescription(`The user that should get unmuted`).setRequired(true))
        .addStringOption(option =>
            option.setName(`reason`).setDescription(`The reason for the unmute`).setRequired(true)),
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

        const user = interaction.options.getUser(`user`)
        const target = interaction.options.getMember(`user`)
        const reason = interaction.options.getString(`reason`)

        if (interaction.guild.roles.cache.get(config.moderatorRole).position > interaction.member.roles.highest.position) {
            const embed = new Discord.MessageEmbed()
                .setDescription(`${config.crossEmoji} You can't use this command`)
                .setColor(config.ErrorHexColor)
                .setAuthor(interaction.user.username, interaction.user.displayAvatarURL())
                .setFooter(interaction.guild.name)
                .setTimestamp()
            return interaction.editReply({ embeds: [embed], ephemeral: true })
        }

        if (!interaction.guild.members.cache.get(user.id)) {
            const embed = new Discord.MessageEmbed()
                .setDescription(`${config.crossEmoji} That user is not in this server`)
                .setColor(config.ErrorHexColor)
                .setAuthor(interaction.user.username, interaction.user.displayAvatarURL())
                .setFooter(interaction.guild.name)
                .setTimestamp()
            return interaction.editReply({ embeds: [embed], ephemeral: true })
        }

        const mutes = require('../../models/mutes')
        const isMuted = await mutes.findOne({ userId: user.id })
        if (!isMuted) {
            const embed = new Discord.MessageEmbed()
                .setDescription(`${config.crossEmoji} <@${user.id}> isn't currently muted`)
                .setColor(config.ErrorHexColor)
                .setAuthor(interaction.user.username, interaction.user.displayAvatarURL())
                .setFooter(interaction.guild.name)
                .setTimestamp()
            return interaction.editReply({ embeds: [embed], ephemeral: true })
        } if (isMuted) {
            if (!config.muteRole || !config.memberRole) {
                const embed = new Discord.MessageEmbed()
                    .setDescription(`${config.crossEmoji} The **mute** and **member** role is not configured correct in my \`config.json\``)
                    .addField("Valid format (in the config.json)", "```muteRole: \"#ID of the role\"```\n```memberRole: \"#ID of the role\"```")
                    .setColor(config.ErrorHexColor)
                    .setAuthor(interaction.user.username, interaction.user.displayAvatarURL())
                    .setFooter(interaction.guild.name)
                    .setTimestamp()
                return interaction.editReply({ embeds: [embed], ephemeral: true })
            }

            const muted = interaction.guild.roles.cache.get(config.muteRole)
            const main = interaction.guild.roles.cache.get(config.memberRole)

            await mutes.findOneAndDelete({ userId: user.id }).then(async () => {
                target.roles.add(main)
                target.roles.remove(muted)


                const logChannel = interaction.guild.channels.cache.get(config.log)
                const logEmbed = new Discord.MessageEmbed()
                    .setColor(config.SuccessHexColor)
                    .addFields([
                        { name: 'User', value: `${target.user.username}#${target.user.discriminator} (<@${target.user.id}>)`, inline: true },
                        { name: 'Moderator', value: `${interaction.user.username}#${interaction.user.discriminator}`, inline: true },
                        { name: 'Reason', value: reason }
                    ])
                    .setAuthor(`Unmute | ${target.user.username}#${target.user.discriminator}`)
                    .setFooter(interaction.guild.name)
                    .setTimestamp()
                logChannel.send({ embeds: [logEmbed] }).then(async () => {
                    const embed = new Discord.MessageEmbed()
                        .setDescription(`${config.checkEmoji} Successfully **Unmuted** <@${user.id}>`)
                        .setColor(config.SuccessHexColor)
                        .setAuthor(interaction.user.username, interaction.user.displayAvatarURL())
                        .setFooter(interaction.guild.name)
                        .setTimestamp()
                    await interaction.editReply({ embeds: [embed] })
                });
            })

        }

    }
}