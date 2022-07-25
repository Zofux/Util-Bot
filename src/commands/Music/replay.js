const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js')
const config = require(`../../../config.json`)

module.exports = {
    data: new SlashCommandBuilder()
        .setName(`replay`)
        .setDescription(`Replay the current song`),
    async execute(interaction, client) {
        await interaction.deferReply({ ephemeral: true })
        const queue = client.player.getQueue(interaction.guildId)

        if (!queue) {
            const embed = new Discord.MessageEmbed()
                .setDescription(`${config.crossEmoji} There are no songs in the queue`)
                .setColor(`#ff7575`)
                .setAuthor(interaction.user.username, interaction.user.displayAvatarURL())
                .setTimestamp()
            return interaction.followUp({ embeds: [embed], ephemeral: true })
        }

        queue.back()
        const embed = new Discord.MessageEmbed()
            .setColor("#5999ff")
            .setAuthor(interaction.user.username, interaction.user.displayAvatarURL())
            .setDescription(`${config.checkEmoji} Replaying...`)
        return interaction.editReply({ embeds: [embed] })
    }
}