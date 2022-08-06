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

        const logs = require('../../models/logChannels')
        const log = await logs.findOne({ guildId: interaction.guild.id })
        let doLog = false
        let logChannel;
        if (log) {
            doLog = true
        }
        if (doLog) {
            logChannel = interaction.guild.channels.cache.get(log.channelId)
            if (!logChannel) doLog = false
        }

        const user = interaction.options.getUser(`user`)
        const target = interaction.options.getMember(`user`)
        const reason = interaction.options.getString(`reason`)

        if (!interaction.member.permissions.has(Discord.Permissions.FLAGS.MUTE_MEMBERS)) {
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

                if (doLog) { 
                    logChannel.send({ embeds: [logEmbed] }) 
                }

                const embed = new Discord.MessageEmbed()
                    .setDescription(`${config.checkEmoji} Successfully **Unmuted** <@${user.id}>`)
                    .setColor(config.SuccessHexColor)
                    .setAuthor(interaction.user.username, interaction.user.displayAvatarURL())
                    .setFooter(interaction.guild.name)
                    .setTimestamp()
                await interaction.editReply({ embeds: [embed] })
            })

        }

    }
}