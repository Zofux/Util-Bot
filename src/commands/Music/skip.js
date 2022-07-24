const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js')
const config = require(`../../../config.json`)

module.exports = {
    data: new SlashCommandBuilder()
        .setName(`skip`)
        .setDescription(`Skip the current song in the queue`),

    async execute(interaction, client) {
        await interaction.deferReply()

        const queue = client.player.getQueue(interaction.guildId)

        if (!queue) {
            const embed = new Discord.MessageEmbed()
                .setDescription(`${config.crossEmoji} There are no songs in the queue`)
                .setColor(`#ff7575`)
                .setAuthor(interaction.user.username, interaction.user.displayAvatarURL())
                .setTimestamp()
            return interaction.followUp({ embeds: [embed], ephemeral: true })
        } else {
            const currentSong = queue.current
            queue.skip()
            const embed = new Discord.MessageEmbed()
                .setColor("#f23a3a")
                .setAuthor("Skipped Song")
                .setDescription(`${config.checkEmoji} [${currentSong.title}](${currentSong.url}) has been skipped`)
            return interaction.followUp({ embeds: [embed] })
        }
    }
}