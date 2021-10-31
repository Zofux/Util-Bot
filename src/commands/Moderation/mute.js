const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js')
const ms = require("ms")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("mute")
        .setDescription("Mutes a given user")
        .addUserOption(option =>
            option.setName("user").setDescription("The user that should get muted").setRequired(true))
        .addStringOption(option =>
            option.setName("time").setDescription("How long the mute should last (example: 2h)").setRequired(true))
        .addStringOption(option =>
            option.setName("reason").setDescription("The reason for the kick").setRequired(true)),
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true })
        const user = interaction.options.getUser("user")
        const target = interaction.options.getMember("user")
        const rawTime = interaction.options.getString("time")
        const reason = interaction.options.getString("reason")

        if (interaction.guild.roles.cache.get("896032767220015144").position > interaction.member.roles.highest.position) {
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
                .setDescription(`<:cross:896045962940780555> You **can't** kick <@${user.id}>`)
                .setColor("#ff7575")
                .setAuthor(interaction.user.username, interaction.user.displayAvatarURL())
                .setFooter(interaction.guild.name)
                .setTimestamp()
            return interaction.editReply({ embeds: [embed], ephemeral: true })
        }

        const time = ms(rawTime)
        if (!time) {
            const embed = new Discord.MessageEmbed()
                .setDescription("<:cross:896045962940780555> Make sure you input time with the correct format (example: 2h)")
                .setColor("#ff7575")
                .setAuthor(interaction.user.username, interaction.user.displayAvatarURL())
                .setFooter(interaction.guild.name)
                .setTimestamp()
            return interaction.editReply({ embeds: [embed], ephemeral: true })
        }
        if (time < 1000) {
            const embed = new Discord.MessageEmbed()
                .setDescription("<:cross:896045962940780555> Mutes must be at least one minute long")
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

        const date = new Date()
        date.setMilliseconds(date.getMilliseconds() + time)
        const mutes = require('../../models/mutes')
        const isMuted = await mutes.findOne({ userId: user.id })
        if (isMuted) {
            const embed = new Discord.MessageEmbed()
                .setDescription(`<:cross:896045962940780555> <@${user.id}> is currently muted, so they can't be muted again`)
                .setColor("#ff7575")
                .setAuthor(interaction.user.username, interaction.user.displayAvatarURL())
                .setFooter(interaction.guild.name)
                .setTimestamp()
            return interaction.editReply({ embeds: [embed], ephemeral: true })
        } else {
            new mutes({
                userId: user.id,
                expires: date
            }).save().then(async () => {
                const muted = interaction.guild.roles.cache.get("903991654074167357")
                const member = interaction.guild.roles.cache.get("892756988335898634")

                interaction.member.roles.add(muted)
                interaction.member.roles.remove(member)


                const db = require('../../models/infractions')
                const res = await db.findOne({ guildId: interaction.guild.id, userId: user.id })
                const unixTime = require('unix-time');


                if (!res) {
                    new db({
                        userId: user.id,
                        guildId: interaction.guild.id,
                        infractions: [
                            { type: "mute", date: unixTime(date), reason: reason, id: id, moderator: `${interaction.user.username}#${interaction.user.discriminator}` }
                        ]
                    }).save().then(async () => {
                        const logChannel = interaction.guild.channels.cache.get("896697011255017493")
                        const logEmbed = new Discord.MessageEmbed()
                            .setColor("#ffdd33")
                            .addFields([
                                { name: 'User', value: `${user.username}#${user.discriminator} (<@${user.id}>)`, inline: true },
                                { name: 'Moderator', value: `${interaction.user.username}#${interaction.user.discriminator}`, inline: true },
                                { name: 'Reason', value: reason },
                                { name: "Expiers", value: `<t:${unixTime(date)}:R>` }
                            ])
                            .setAuthor(`Mute | ${user.username}#${user.discriminator}`)
                            .setFooter(interaction.guild.name)
                            .setTimestamp()
                        logChannel.send({ embeds: [logEmbed] });
                        user.send({ embeds: [logEmbed] })

                        const embed = new Discord.MessageEmbed()
                            .setDescription(`<:check:896045976039608320> Successfully **Muted** <@${user.id}> with id \`${id}\``)
                            .setColor("#43d490")
                            .setAuthor(interaction.user.username, interaction.user.displayAvatarURL())
                            .setFooter(interaction.guild.name)
                            .setTimestamp()
                        await interaction.editReply({ embeds: [embed] })
                    })
                } else if (res) {
                    const infraction = {
                        type: "mute", date: unixTime(date), reason: reason, id: id, moderator: `${interaction.user.username}#${interaction.user.discriminator}`
                    }
                    await db.findOneAndUpdate({
                        guildId: interaction.guild.id, userId: user.id
                    }, {
                        $push: { infractions: infraction }
                    }, {
                        new: true,
                        upsert: true
                    }).then(async () => {
                        const logChannel = interaction.guild.channels.cache.get("896697011255017493")
                        const logEmbed = new Discord.MessageEmbed()
                            .setColor("#ffdd33")
                            .addFields([
                                { name: 'User', value: `${user.username}#${user.discriminator} (<@${user.id}>)`, inline: true },
                                { name: 'Moderator', value: `${interaction.user.username}#${interaction.user.discriminator}`, inline: true },
                                { name: 'Reason', value: reason },
                                { name: "Expiers", value: `<t:${unixTime(date)}:R>` }
                            ])
                            .setAuthor(`Mute | ${user.username}#${user.discriminator}`)
                            .setFooter(interaction.guild.name)
                            .setTimestamp()
                        logChannel.send({ embeds: [logEmbed] });
                        user.send({ embeds: [logEmbed] })

                        const embed = new Discord.MessageEmbed()
                            .setDescription(`<:check:896045976039608320> Successfully **Muted** <@${user.id}> with id \`${id}\``)
                            .setColor("#43d490")
                            .setAuthor(interaction.user.username, interaction.user.displayAvatarURL())
                            .setFooter(interaction.guild.name)
                            .setTimestamp()
                        await interaction.editReply({ embeds: [embed] })
                    })
                }

            })
        }

    },
}