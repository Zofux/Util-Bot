const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js')
const config = require(`../../../config.json`)

module.exports = {
    data: new SlashCommandBuilder()
        .setName(`resume`)
        .setDescription(`Resume the music after it has been paused`),
    async execute(interaction, client) {
        await interaction.deferReply()
        const queue = client.player.getQueue(interaction.guildId)

        if (!queue) {
            const embed = new Discord.MessageEmbed()
                .setDescription(`${config.crossEmoji} There are no songs in the queue`)
                .setColor(config.ErrorHexColor)
                .setAuthor(interaction.user.username, interaction.user.displayAvatarURL())
                .setTimestamp()
            return interaction.followUp({ embeds: [embed], ephemeral: true })
        }

        queue.setPaused(false)
        const embed = new Discord.MessageEmbed()
            .setColor(config.MainHexColor)
            .setAuthor("Resumed", interaction.user.displayAvatarURL())
            .setDescription(`${config.checkEmoji} The music has been resumed! Use \`/pause\` to pause the music`)
        return interaction.editReply({ embeds: [embed] })
    }
}