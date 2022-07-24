const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js')
const config = require(`../../../config.json`)

module.exports = {
    data: new SlashCommandBuilder()
        .setName(`pause`)
        .setDescription(`Pause the music`),
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

        queue.setPaused(true)
        const embed = new Discord.MessageEmbed()
            .setColor("#5999ff")
            .setAuthor("Paused", interaction.user.displayAvatarURL())
            .setDescription(`${config.checkEmoji} The music has been paused! Use \`/resume\` to resume the music`)
        return interaction.editReply({ embeds: [embed] })
    }
}