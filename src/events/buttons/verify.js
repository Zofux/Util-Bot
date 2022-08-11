const Discord = require('discord.js')
const config = require('../../../config.json')

module.exports = async (interaction, client) => {
    if (interaction.customId === "verify") {
        const embed = new Discord.MessageEmbed()
            .setDescription(`${config.checkEmoji} You are now verified`)
            .setColor(config.SuccessHexColor)
            .setAuthor(interaction.user.username, interaction.user.displayAvatarURL())
            .setFooter(interaction.guild.name)
            .setTimestamp()
        return await interaction.reply({ embeds: [embed], ephemeral: true }).then(() => {
            const memberRole = interaction.guild.roles.chache.get(config.memberRole)
            interaction.member.roles.add(memberRole)
        })
    }
}