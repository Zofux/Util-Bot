const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js')
const config = require(`../../../config.json`)

module.exports = {
    data: new SlashCommandBuilder()
        .setName(`kick`)
        .setDescription(`Kicks a given user`)
        .addUserOption(option =>
            option.setName(`user`).setDescription(`The user that should get kicked`).setRequired(true))
        .addStringOption(option =>
            option.setName(`reason`).setDescription(`The reason for the kick`).setRequired(true)),
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

        if (!interaction.member.permissions.has(Discord.Permissions.FLAGS.KICK_MEMBERS)) {
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

        if (target.roles.highest.position >= interaction.member.roles.highest.position) {
            const embed = new Discord.MessageEmbed()
                .setDescription(`${config.crossEmoji} You **can't** kick <@${user.id}>`)
                .setColor(config.ErrorHexColor)
                .setAuthor(interaction.user.username, interaction.user.displayAvatarURL())
                .setFooter(interaction.guild.name)
                .setTimestamp()
            return interaction.editReply({ embeds: [embed], ephemeral: true })
        }

        if (reason.length > 150) {
            const embed = new Discord.MessageEmbed()
                .setDescription(`${config.crossEmoji} The reason cannot exceed 150 characters`)
                .setColor(config.ErrorHexColor)
                .setAuthor(interaction.user.username, interaction.user.displayAvatarURL())
                .setFooter(interaction.guild.name)
                .setTimestamp()
            return interaction.editReply({ embeds: [embed], ephemeral: true })
        }

        var randomstring = require(`randomstring`);
        const id = randomstring.generate(7)

        const db = require('../../models/infractions')
        const res = await db.findOne({ guildId: interaction.guild.id, userId: user.id })
        const unixTime = require('unix-time');
        if (!res) {
            new db({
                userId: user.id,
                guildId: interaction.guild.id,
                infractions: [
                    { type: `kick`, date: unixTime(new Date()), reason: reason, id: id, moderator: `${interaction.user.username}#${interaction.user.discriminator}` }
                ]
            }).save().then(async () => {

                const logEmbed = new Discord.MessageEmbed()
                    .setColor(`#ffdd33`)
                    .addFields([
                        { name: 'User', value: `${user.username}#${user.discriminator} (<@${user.id}>)`, inline: true },
                        { name: 'Moderator', value: `${interaction.user.username}#${interaction.user.discriminator}`, inline: true },
                        { name: 'Reason', value: reason }
                    ])
                    .setAuthor(`Kick | ${user.username}#${user.discriminator}`)
                    .setFooter(interaction.guild.name)
                    .setTimestamp()

                if (doLog) {
                    logChannel.send({ embeds: [logEmbed] });
                }

                user.send({ embeds: [logEmbed] })

                await interaction.guild.members.cache.get(user.id).kick()
                const embed = new Discord.MessageEmbed()
                    .setDescription(`${config.checkEmoji} Successfully **Kicked** <@${user.id}> with id \`${id}\``)
                    .setColor(config.SuccessHexColor)
                    .setAuthor(interaction.user.username, interaction.user.displayAvatarURL())
                    .setFooter(interaction.guild.name)
                    .setTimestamp()
                await interaction.editReply({ embeds: [embed] })
            })
        } else if (res) {
            const infraction = {
                type: `kick`, date: unixTime(new Date()), reason: reason, id: id, moderator: `${interaction.user.username}#${interaction.user.discriminator}`
            }
            await db.findOneAndUpdate({
                guildId: interaction.guild.id, userId: user.id
            }, {
                $push: { infractions: infraction }
            }, {
                new: true,
                upsert: true
            }).then(async () => {

                const logEmbed = new Discord.MessageEmbed()
                    .setColor(`#ffdd33`)
                    .addFields([
                        { name: 'User', value: `${user.username}#${user.discriminator} (<@${user.id}>)`, inline: true },
                        { name: 'Moderator', value: `${interaction.user.username}#${interaction.user.discriminator}`, inline: true },
                        { name: 'Reason', value: reason }
                    ])
                    .setAuthor(`Kick | ${user.username}#${user.discriminator}`)
                    .setFooter(interaction.guild.name)
                    .setTimestamp()
                    
                if (doLog) {
                    logChannel.send({ embeds: [logEmbed] });
                }

                user.send({ embeds: [logEmbed] })

                await interaction.guild.members.cache.get(user.id).kick()
                const embed = new Discord.MessageEmbed()
                    .setDescription(`${config.checkEmoji} Successfully **Kicked** <@${user.id}> with id \`${id}\``)
                    .setColor(config.SuccessHexColor)
                    .setAuthor(interaction.user.username, interaction.user.displayAvatarURL())
                    .setFooter(interaction.guild.name)
                    .setTimestamp()
                await interaction.editReply({ embeds: [embed] })
            })
        }
    },
}