const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js')
const config = require("../../../config.json")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("unmute")
        .setDescription("Mutes a given user")
        .addUserOption(option =>
            option.setName("user").setDescription("The user that should get unmuted").setRequired(true))
        .addStringOption(option =>
            option.setName("reason").setDescription("The reason for the unmute").setRequired(true)),
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true })
        const user = interaction.options.getUser("user")
        const target = interaction.options.getMember("user")
        const reason = interaction.options.getString("reason")

        if (interaction.guild.roles.cache.get(config.moderatorRole).position > interaction.member.roles.highest.position) {
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

        const mutes = require('../../models/mutes')
        const isMuted = await mutes.findOne({ userId: user.id })
        if (!isMuted) {
            const embed = new Discord.MessageEmbed()
                .setDescription(`<:cross:896045962940780555> <@${user.id}> isn't currently muted`)
                .setColor("#ff7575")
                .setAuthor(interaction.user.username, interaction.user.displayAvatarURL())
                .setFooter(interaction.guild.name)
                .setTimestamp()
            return interaction.editReply({ embeds: [embed], ephemeral: true })
        } if (isMuted) {
            const muted = interaction.guild.roles.cache.get(config.muteRole)
            const main = interaction.guild.roles.cache.get(config.memberRole)

            await mutes.findOneAndDelete({ userId: user.id }).then(async () => {
                target.roles.add(main)
                target.roles.remove(muted)


                const logChannel = interaction.guild.channels.cache.get(config.log)
                const logEmbed = new Discord.MessageEmbed()
                    .setColor("#43d490")
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
                        .setDescription(`<:check:896045976039608320> Successfully **Unmuted** <@${user.id}>`)
                        .setColor("#43d490")
                        .setAuthor(interaction.user.username, interaction.user.displayAvatarURL())
                        .setFooter(interaction.guild.name)
                        .setTimestamp()
                    await interaction.editReply({ embeds: [embed] })
                });
            })

        }

    }
}