const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js')
const config = require(`../../../config.json`)

module.exports = {
    data: new SlashCommandBuilder()
        .setName(`queue`)
        .setDescription(`Displays the current song queue`)
        .addIntegerOption((option) =>
            option.setName("page")
                .setDescription("Page number off the queue"),
    async execute(interaction, client) {
        await interaction.deferReply({ ephemeral: true })
        const queue = client.player.getQueue(interaction.guildId)

        if (!queue || !queue.playing) {
            const embed = new Discord.MessageEmbed()
                .setDescription(`${config.crossEmoji} There are no songs in the queue`)
                .setColor(`#ff7575`)
                .setAuthor(interaction.user.username, interaction.user.displayAvatarURL())
                .setTimestamp()
            return interaction.followUp({ embeds: [embed], ephemeral: true })
        }

        const totalPages = Math.ceil(queue.track.length / 10) || 1
        const page = (interaction.options.getNumber("page") || 1) - 1

        if (page > totalPages) {
            const embed = new Discord.MessageEmbed()
                .setDescription(`${config.crossEmoji} Oops, there are only a total of ${totalPages} pages of songs`)
                .setColor(`#ff7575`)
                .setAuthor(interaction.user.username, interaction.user.displayAvatarURL())
                .setTimestamp()
            return interaction.followUp({ embeds: [embed], ephemeral: true })
        }

        const queueString = queue.tracks.slice(page * 10, page * 10 + 10).map((song, i) => {
            return `**#${page * 10 + i + 1}**. \`[${song.duration}]\` ${song.title}] - <@${song.requestedBy.id}>`
        }).join(`\n`)

        const currentSong = queue.currentSong
        const embed = new Discord.MessageEmbed()
            .setDescription(`**Currently Playing**\n` +
            (currentSong ? `\`[${currentSong.duration}]\` ${currentSong.tittle} - <@${currentSong.requestedBy.id}> ` : "None") + 
            `\n\n**Queue**\n${queueString}`) 

            .setColor(`#5999ff`)
            .setAuthor(`Song Queue`)
            .setFooter(`Page ${page + 1} if ${totalPages}`)
            .setTimestamp()
        return interaction.editReply({ embeds: [embed], ephemeral: true })

    }
}
