module.exports = async (interaction, client) => {
    await interaction.deferReply({ ephemeral: true })

    const name = interaction.channel.name

    await interaction.channel.delete().then(async () => {
        const Discord = require('discord.js')

        const logChannel = interaction.guild.channels.cache.get("896370391247896616")
        let embed = new Discord.MessageEmbed()
            .setDescription(`🔒 <@${interaction.user.id}> Closed a ticket`)
            .addField("Ticket Owner", `<@${name}>`)
            .setColor('#ff7575')
            .setAuthor(`${interaction.user.username}`, interaction.user.displayAvatarURL())
        logChannel.send({ embeds: [embed] })
    })
}