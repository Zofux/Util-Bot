const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js')
const config = require(`../../../config.json`)

module.exports = {
    data: new SlashCommandBuilder()
        .setName(`volume`)
        .setDescription(`Change the volume of the music in the current queue`)
        .addIntegerOption((option) =>
            option.setName("amount")
                .setDescription("The new volume you want to change the music to")),
    async execute(interaction, client) {
        await interaction.deferReply()
        const queue = client.player.getQueue(interaction.guildId)

        if (!queue) {
            const embed = new Discord.MessageEmbed()
                .setDescription(`${config.crossEmoji} This command only works when a song is playing`)
                .setColor(`#ff7575`)
                .setAuthor(interaction.user.username, interaction.user.displayAvatarURL())
                .setTimestamp()
            return interaction.followUp({ embeds: [embed], ephemeral: true })
        }

        let amount = interaction.options.getNumber("amount")
        queue.setVolume(amount)
        const embed = new Discord.MessageEmbed()
            .setColor("#5999ff")
            .setAuthor("Volume changed", interaction.user.displayAvatarURL())
            .setDescription(`${config.checkEmoji} I have changed to volume to ${amount}`)
        return interaction.editReply({ embeds: [embed] })
    }
}