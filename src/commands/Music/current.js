const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js')
const config = require(`../../../config.json`)

module.exports = {
    data: new SlashCommandBuilder()
        .setName(`current`)
        .setDescription(`Get information about the current song`),
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
        }

        let bar = queue.createProgressBar({
            queue: false,
            length: 19,
        })
        const song = queue.current
        const embed = new Discord.MessageEmbed()
            .setColor("#5999ff")
            .setAuthor("Current Song", interaction.user.displayAvatarURL())
            .setDescription(`Currently Playing [${song.title}(${song.url})] [${song.duration}]\n\n` + bar)
        return interaction.editReply({ embeds: [embed] })
    }
}