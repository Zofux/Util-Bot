const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("status")
        .setDescription("Get a status update of the server"),
    async execute(interaction) {
        await interaction.deferReply()
        const util = require('minecraft-server-util')

        util.status("cactuscraft.apexmc.co").then(async res => {
            let embed = new Discord.MessageEmbed()
                .setDescription("`cactuscraft.apexmc.co`")
                .addFields([
                    { name: "Players", value: `\`${res.onlinePlayers}\`/\`${res.maxPlayers}\``, inline: true },
                    { name: "Version", value: `\`${res.version}\`` }
                ])
                .setColor("#5999ff")
                .setAuthor(interaction.user.username, interaction.user.displayAvatarURL())
                .setFooter(interaction.guild.name)
                .setTimestamp()
            await interaction.editReply({ embeds: [embed] })
        })
    }
}