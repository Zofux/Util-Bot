const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js')
const config = require(`../../../config.json`)

module.exports = {
    data: new SlashCommandBuilder()
        .setName(`shuffle`)
        .setDescription(`Shuffle the queue`),
    async execute(interaction, client) {
        await interaction.deferReply({ ephemeral: true })
        const queue = client.player.getQueue(interaction.guildId)

        if (!queue) {
            const embed = new Discord.MessageEmbed()
                .setDescription(`${config.crossEmoji} There are no songs in the queue`)
                .setColor(config.ErrorHexColor)
                .setAuthor(interaction.user.username, interaction.user.displayAvatarURL())
                .setTimestamp()
            return interaction.followUp({ embeds: [embed], ephemeral: true })
        }

        queue.shuffle()
        const embed = new Discord.MessageEmbed()
            .setColor(config.MainHexColor)
            .setAuthor("Cleared", interaction.user.displayAvatarURL())
            .setDescription(`${config.checkEmoji} Shuffled all \`${queue.tracks.length}\` songs `)
        return interaction.editReply({ embeds: [embed] })
    }
}