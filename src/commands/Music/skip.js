const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js')
const config = require(`../../../config.json`)

module.exports = {
    data: new SlashCommandBuilder()
        .setName(`skip`)
        .setDescription(`Skip the current song in the queue`),
    async execute(interaction, client) {
        await interaction.deferReply({ ephemeral: true })

        const queue = client.player.getQueue(interaction.guildId)

        if (!queue) {
            const embed = new Discord.MessageEmbed()
                .setDescription(`${config.crossEmoji} That user is not in this server`)
                .setColor(`#ff7575`)
                .setAuthor(interaction.user.username, interaction.user.displayAvatarURL())
                .setTimestamp()
            return interaction.editReply({ embeds: [embed], ephemeral: true })
        }
    }
}