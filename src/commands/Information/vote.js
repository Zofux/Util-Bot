const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("vote")
        .setDescription("Get a list over all our voting sites"),
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true })
        let embed = new Discord.MessageEmbed()
            .setDescription("All our voting sites is listed on our website https://cactuscraft.org/vote")
            .setColor("#5999ff")
            .setAuthor(interaction.user.username, interaction.user.displayAvatarURL())
            .setFooter(interaction.guild.name)
            .setTimestamp()
        await interaction.editReply({ embeds: [embed] })
    }
}