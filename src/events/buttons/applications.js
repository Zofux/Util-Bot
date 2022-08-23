const Discord = require('discord.js')
const config = require('../../../config.json')
const db = require('../../models/applications')

module.exports = async (interaction, client) => {

    if (interaction.customId === "accept") {
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

        const res = await db.findOne({ guildId: interaction.guild.id, "applications.channelId": interaction.channel.id })

        if (!res) {
            const embed = new Discord.MessageEmbed()
                .setDescription(`${config.crossEmoji} This application **isn't** in my database anymore`)
                .setColor(config.ErrorHexColor)
                .setAuthor(interaction.user.username, interaction.user.displayAvatarURL())
                .setFooter("Made by Zofux")
                .setTimestamp()
            return await interaction.reply({ embeds: [embed] })
        }

        const array = await res.applications.filter(o => o.channelId === interaction.channel.id)

        await db.findOneAndUpdate({
            guildId: interaction.guild.id, "applications.channelId": interaction.channelId
        }, {
            $pull: { applications: { userId: array[0].userId, channelId: interaction.channel.id } }
        }, {
            upsert: true
        }).then(async () => {
            const logEmbed = new Discord.MessageEmbed()
                .setDescription(`<@${interaction.user.id}> **accepted** <@${array[0].userId}>'s \`${res.name} application\``)
                .setColor(config.SuccessHexColor)
                .setAuthor("Application | Accepted")
                .setTimestamp()
            if (doLog) logChannel.send({ embeds: [logEmbed] })

            const embed = new Discord.MessageEmbed()
                .setAuthor(interaction.user.username, interaction.user.displayAvatarURL())
                .setDescription(`${config.checkEmoji} This application has been accepted`)
                .setColor(config.SuccessHexColor)
                .setFooter(`Made by Zofux`)
            interaction.reply({ embeds: [embed], ephemeral: true }).then(async () => interaction.channel.delete())

            try {
                const infoEmbed = new Discord.MessageEmbed()
                    .setDescription(`Hey, <@${array[0].userId}>. Your \`${res.name} application\` has been **accepted** by <@${interaction.user.id}>`)
                    .setColor(config.SuccessHexColor)
                    .setAuthor("Application | Accepted")
                    .setFooter(`Guild ID: ${interaction.guild.id}`)
                    .setTimestamp()
                interaction.guild.members.cache.get(array[0].userId).send({ embeds: [infoEmbed] })
            } catch (err) {
                console.log(ErrorHexColor)
            }
        })
    } else if (interaction.customId === "deny") {
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

        const res = await db.findOne({ guildId: interaction.guild.id, "applications.channelId": interaction.channel.id })

        if (!res) {
            const embed = new Discord.MessageEmbed()
                .setDescription(`${config.crossEmoji} This application **isn't** in my database anymore`)
                .setColor(config.ErrorHexColor)
                .setAuthor(interaction.user.username, interaction.user.displayAvatarURL())
                .setFooter("Made by Zofux")
                .setTimestamp()
            return await interaction.reply({ embeds: [embed] })
        }

        const array = await res.applications.filter(o => o.channelId === interaction.channel.id)

        await db.findOneAndUpdate({
            guildId: interaction.guild.id, "applications.channelId": interaction.channel.id
        }, {
            $pull: { applications: { userId: array[0].userId, channelId: interaction.channel.id } }
        }, {
            upsert: true
        }).then(async () => {
            const logEmbed = new Discord.MessageEmbed()
                .setDescription(`<@${interaction.user.id}> **denied** <@${array[0].userId}>'s \`${res.name} application\``)
                .setColor(config.ErrorHexColor)
                .setAuthor("Application | Denied")
                .setTimestamp()
            if (doLog) logChannel.send({ embeds: [logEmbed] })

            const embed = new Discord.MessageEmbed()
                .setAuthor(interaction.user.username, interaction.user.displayAvatarURL())
                .setDescription(`${config.checkEmoji} This application has been denied`)
                .setColor(config.SuccessHexColor)
                .setFooter(`Made by Zofux`)
            interaction.reply({ embeds: [embed], ephemeral: true }).then(async () => interaction.channel.delete())

            try {
                const infoEmbed = new Discord.MessageEmbed()
                    .setDescription(`Hey, <@${array[0].userId}>. Your \`${res.name} application\` has been **denied** by <@${interaction.user.id}>`)
                    .setColor(config.ErrorHexColor)
                    .setAuthor("Application | Denied")
                    .setFooter(`Guild ID: ${interaction.guild.id}`)
                    .setTimestamp()
                return interaction.guild.members.cache.get(array[0].userId).send({ embeds: [infoEmbed] })
            } catch (err) {
                console.log(err)
            }
        })
    }
}