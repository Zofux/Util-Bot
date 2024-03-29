const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js')
const config = require(`../../../config.json`)
const unixTime = require('unix-time');

module.exports = {
    data: new SlashCommandBuilder()
        .setName(`unban`)
        .setDescription(`Unbans a given user`)
        .addStringOption(option =>
            option.setName(`id`).setDescription(`The id of the user that should get unbanned`).setRequired(true))
        .addStringOption(option =>
            option.setName(`reason`).setDescription(`The reason for the unban`).setRequired(true)),
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

        const userId = interaction.options.getString(`id`)
        const reason = interaction.options.getString(`reason`)

        if (!interaction.member.permissions.has(Discord.Permissions.FLAGS.BAN_MEMBERS)) {
            const embed = new Discord.MessageEmbed()
                .setDescription(`${config.crossEmoji} You can't use this command`)
                .setColor(config.ErrorHexColor)
                .setAuthor(interaction.user.username, interaction.user.displayAvatarURL())
                .setFooter(interaction.guild.name)
                .setTimestamp()
            return interaction.editReply({ embeds: [embed], ephemeral: true })
        }

        var randomstring = require(`randomstring`);
        const id = randomstring.generate(7)

        try {
            await interaction.guild.bans.fetch().then(async bans => {
                if (bans.size == 0) {
                    const embed = new Discord.MessageEmbed()
                        .setDescription(`${config.crossEmoji} Nobody is banned from this server`)
                        .setColor(config.ErrorHexColor)
                        .setAuthor(interaction.user.username, interaction.user.displayAvatarURL())
                        .setFooter(interaction.guild.name)
                        .setTimestamp()
                    return interaction.editReply({ embeds: [embed], ephemeral: true })
                }
                let bannedId = bans.find(ban => ban.user.id == userId)
                if (!bannedId) {
                    const embed = new Discord.MessageEmbed()
                        .setDescription(`${config.crossEmoji} \`${userId}\` is not banned from this server`)
                        .setColor(config.ErrorHexColor)
                        .setAuthor(interaction.user.username, interaction.user.displayAvatarURL())
                        .setFooter(interaction.guild.name)
                        .setTimestamp()
                    return interaction.editReply({ embeds: [embed], ephemeral: true })
                }
                await interaction.guild.bans.remove(userId, reason).catch(() => {
                    const embed = new Discord.MessageEmbed()
                        .setDescription(`${config.crossEmoji} No user with the id: \`${userId}\` is not banned in this server`)
                        .setColor(config.ErrorHexColor)
                        .setAuthor(interaction.user.username, interaction.user.displayAvatarURL())
                        .setFooter(interaction.guild.name)
                        .setTimestamp()
                    return interaction.editReply({ embeds: [embed], ephemeral: true })
                });

                const db = require('../../models/infractions')
                const res = await db.findOne({ guildId: interaction.guild.id, userId: userId })

                if (!res) {
                    new db({
                        userId: userId,
                        guildId: interaction.guild.id,
                        infractions: [
                            { type: `unban`, date: unixTime(new Date()), reason: reason, id: id, moderator: `${interaction.user.username}#${interaction.user.discriminator}` }
                        ]
                    }).save().then(async () => {
                        const logEmbed = new Discord.MessageEmbed()
                            .setColor(config.SuccessHexColor)
                            .addFields([
                                { name: 'User', value: `\`${userId}\``, inline: true },
                                { name: 'Moderator', value: `${interaction.user.username}#${interaction.user.discriminator}`, inline: true },
                                { name: 'Reason', value: reason }
                            ])
                            .setAuthor(`Unban | ${userId}`)
                            .setFooter(interaction.guild.name)
                            .setTimestamp()
                        if (doLog) {
                            logChannel.send({ embeds: [logEmbed] });
                        }

                        const embed = new Discord.MessageEmbed()
                            .setDescription(`${config.checkEmoji} Successfully **Unbanned** \`${userId}\` with id \`${id}\``)
                            .setColor(config.SuccessHexColor)
                            .setAuthor(interaction.user.username, interaction.user.displayAvatarURL())
                            .setFooter(interaction.guild.name)
                            .setTimestamp()
                        return await interaction.editReply({ embeds: [embed] })

                    })
                } else if (res) {
                    const infraction = {
                        type: `unban`, date: unixTime(new Date()), reason: reason, id: id, moderator: `${interaction.user.username}#${interaction.user.discriminator}`
                    }
                    await db.findOneAndUpdate({
                        guildId: interaction.guild.id, userId: userId
                    }, {
                        $push: { infractions: infraction }
                    }, {
                        new: true,
                        upsert: true
                    }).then(async () => {
                        const logEmbed = new Discord.MessageEmbed()
                            .setColor(config.SuccessHexColor)
                            .addFields([
                                { name: 'User', value: `\`${userId}\``, inline: true },
                                { name: 'Moderator', value: `${interaction.user.username}#${interaction.user.discriminator}`, inline: true },
                                { name: 'Reason', value: reason }
                            ])
                            .setAuthor(`Unban | ${userId}`)
                            .setFooter(interaction.guild.name)
                            .setTimestamp()
                        if (doLog) {
                            logChannel.send({ embeds: [logEmbed] });
                        }

                        const embed = new Discord.MessageEmbed()
                            .setDescription(`${config.checkEmoji} Successfully **Unbanned** \`${userId}\` with id \`${id}\``)
                            .setColor(config.SuccessHexColor)
                            .setAuthor(interaction.user.username, interaction.user.displayAvatarURL())
                            .setFooter(interaction.guild.name)
                            .setTimestamp()
                        return await interaction.editReply({ embeds: [embed] })

                    })
                }
            })

        } catch (err) {
            console.log(err)
            const embed = new Discord.MessageEmbed()
                .setDescription(`${config.crossEmoji} No user with the id: \`${userId}\` is not banned in this server`)
                .setColor(config.ErrorHexColor)
                .setAuthor(interaction.user.username, interaction.user.displayAvatarURL())
                .setFooter(interaction.guild.name)
                .setTimestamp()
            return interaction.editReply({ embeds: [embed], ephemeral: true })
        }
    }
}