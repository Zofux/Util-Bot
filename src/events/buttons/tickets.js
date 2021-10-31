const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js')

module.exports = async (interaction, client) => {
    await interaction.deferReply({ ephemeral: true })

    const isTicketOpen = interaction.guild.channels.cache.find(x => x.name == interaction.user.id)
    if (isTicketOpen) {
        return interaction.editReply(`You currently have a open ticket (<#${isTicketOpen.id}>)`)
    }
    interaction.guild.channels.create(`${interaction.user.id}`, {
        parent: interaction.guild.channels.cache.get("904312028028624967"),
        permissionOverwrites: [
            {
                id: '892751160182730772',
                deny: ["VIEW_CHANNEL"],
                allow: ["EMBED_LINKS"]
            },
            {
                id: '904317722362540102',
                allow: ["VIEW_CHANNEL", "SEND_MESSAGES", "READ_MESSAGE_HISTORY"],
            },
            {
                id: interaction.user.id,
                allow: ["VIEW_CHANNEL", "SEND_MESSAGES", "READ_MESSAGE_HISTORY"],
            },
        ]
    }).then(async channel => {
        let embed = new MessageEmbed()
        .setAuthor(`Support Ticket | ${interaction.user.tag}`)
        .setDescription(`Hey <@${interaction.user.id}>, This is your private support ticket where you can talk with our staff team.\n\n**Format**\`\`\`In-game name: (Minecraft username)\nIssue: (Explain your issue)\`\`\``)
        .setFooter("Click the button to close the ticket")
        .setColor("#00ff74")

        const button = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setLabel("Close ticket")
                    .setEmoji("🔒")
                    .setStyle("SECONDARY")
                    .setCustomId("button-close")
            )

        channel.send({ embeds: [embed], components: [button] })

        const logChannel = interaction.guild.channels.cache.get("896370391247896616")
        let logEmbed = new MessageEmbed()
            .setDescription(`📩 <@${interaction.user.id}> Created a ticket`)
            .addField("Ticket", `<#${interaction.channel.id}>`)
            .setColor('#00ff74')
            .setAuthor(`${interaction.user.username}`, interaction.user.displayAvatarURL())
        logChannel.send({ embeds: [logEmbed] })

        await interaction.editReply(`You have created a ticket, head over to <#${channel.id}> to continue the thread.`)
        
    })
}