const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js')
const config = require("../../../config.json")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ban")
        .setDescription("Bans a given user")
        .addUserOption(option =>
            option.setName("user").setDescription("The user that should get banned").setRequired(true))
        .addStringOption(option =>
            option.setName("reason").setDescription("The reason for the ban").setRequired(true)),
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true })
        const user = interaction.options.getUser("user")
        const target = interaction.options.getMember("user")
        const reason = interaction.options.getString("reason")

        if (interaction.guild.roles.cache.get(config.moderatorRole).position >= interaction.member.roles.highest.position) {
            const embed = new Discord.MessageEmbed()
                .setDescription("<:cross:896045962940780555> You can't use this command")
                .setColor("#ff7575")
                .setAuthor(interaction.user.username, interaction.user.displayAvatarURL())
                .setFooter(interaction.guild.name)
                .setTimestamp()
            return interaction.editReply({ embeds: [embed], ephemeral: true })
        }

        if (!interaction.guild.members.cache.get(user.id)) {
            const embed = new Discord.MessageEmbed()
                .setDescription("<:cross:896045962940780555> That user is not in this server")
                .setColor("#ff7575")
                .setAuthor(interaction.user.username, interaction.user.displayAvatarURL())
                .setFooter(interaction.guild.name)
                .setTimestamp()
            return interaction.editReply({ embeds: [embed], ephemeral: true })
        }

        if (target.roles.highest.position >= interaction.member.roles.highest.position) {
            const embed = new Discord.MessageEmbed()
                .setDescription(`<:cross:896045962940780555> You **can't** ban <@${user.id}>`)
                .setColor("#ff7575")
                .setAuthor(interaction.user.username, interaction.user.displayAvatarURL())
                .setFooter(interaction.guild.name)
                .setTimestamp()
            return interaction.editReply({ embeds: [embed], ephemeral: true })
        }

        if (reason.length > 150) {
            const embed = new Discord.MessageEmbed()
                .setDescription("<:cross:896045962940780555> The reason cannot exceed 150 characters")
                .setColor("#ff7575")
                .setAuthor(interaction.user.username, interaction.user.displayAvatarURL())
                .setFooter(interaction.guild.name)
                .setTimestamp()
            return interaction.editReply({ embeds: [embed], ephemeral: true })
        }

        var randomstring = require("randomstring");
        const id = randomstring.generate(7)

        const db = require('../../models/infractions')
        const res = await db.findOne({ guildId: interaction.guild.id, userId: user.id })
        const unixTime = require('unix-time');
        if (!res) {
            new db({
                userId: user.id,
                guildId: interaction.guild.id,
                infractions: [
                    { type: "ban", date: unixTime(new Date()), reason: reason, id: id, moderator: `${interaction.user.username}#${interaction.user.discriminator}` }
                ]
            }).save().then(async () => {
                const logChannel = interaction.guild.channels.cache.get(config.log)
                const logEmbed = new Discord.MessageEmbed()
                    .setColor("#ff7575")
                    .addFields([
                        { name: 'User', value: `${user.username}#${user.discriminator} (<@${user.id}>)`, inline: true },
                        { name: 'Moderator', value: `${interaction.user.username}#${interaction.user.discriminator}`, inline: true },
                        { name: 'Reason', value: reason }
                    ])
                    .setAuthor(`Ban | ${user.username}#${user.discriminator}`)
                    .setFooter(interaction.guild.name)
                    .setTimestamp()
                logChannel.send({ embeds: [logEmbed] });
                user.send({ embeds: [logEmbed] })

                await interaction.guild.members.cache.get(user.id).ban({ days: "7", reason: reason })
                const embed = new Discord.MessageEmbed()
                    .setDescription(`<:check:896045976039608320> Successfully **Banned** <@${user.id}> with id \`${id}\``)
                    .setColor("#43d490")
                    .setAuthor(interaction.user.username, interaction.user.displayAvatarURL())
                    .setFooter(interaction.guild.name)
                    .setTimestamp()
                await interaction.editReply({ embeds: [embed] })
            })
        } else if (res) {
            const infraction = {
                type: "ban", date: unixTime(new Date()), reason: reason, id: id, moderator: `${interaction.user.username}#${interaction.user.discriminator}`
            }
            await db.findOneAndUpdate({
                guildId: interaction.guild.id, userId: user.id
            }, {
                $push: { infractions: infraction }
            }, {
                new: true,
                upsert: true
            }).then(async () => {
                const logChannel = interaction.guild.channels.cache.get(config.log)
                const logEmbed = new Discord.MessageEmbed()
                    .setColor("#ff7575")
                    .addFields([
                        { name: 'User', value: `${user.username}#${user.discriminator} (<@${user.id}>)`, inline: true },
                        { name: 'Moderator', value: `${interaction.user.username}#${interaction.user.discriminator}`, inline: true },
                        { name: 'Reason', value: reason }
                    ])
                    .setAuthor(`Ban | ${user.username}#${user.discriminator}`)
                    .setFooter(interaction.guild.name)
                    .setTimestamp()
                logChannel.send({ embeds: [logEmbed] });
                user.send({ embeds: [logEmbed] })

                await interaction.guild.members.cache.get(user.id).ban({ days: "7", reason: reason })
                const embed = new Discord.MessageEmbed()
                    .setDescription(`<:check:896045976039608320> Successfully **Banned** <@${user.id}> with id \`${id}\``)
                    .setColor("#43d490")
                    .setAuthor(interaction.user.username, interaction.user.displayAvatarURL())
                    .setFooter(interaction.guild.name)
                    .setTimestamp()
                await interaction.editReply({ embeds: [embed] })
            })
        }
    },
}