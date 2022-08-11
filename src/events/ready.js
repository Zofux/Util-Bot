const { MessageAttachment, MessageActionRow, MessageButton, MessageEmbed, Interaction } = require('discord.js')
const config = require("../../config.json")

module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
        console.log("Ready!")
        client.user.setPresence({ activities: [{ name: `${config.yourName}`, type: "LISTENING" }] })

        await require('./intervals/mutes')(client)
        await require('./intervals/autos')(client)


        const guild = client.guilds.cache.get(config.guild)
        const embed = new MessageEmbed()
            .setAuthor(guild.name, guild.iconURL())
            .setDescription(
                "Hey there new member, before you join our server I would like to go through some basic stuff with you.\n\n" +
                "**🔒 Rules**\n\n" +
                "Rules include but not limited to:\n\n" +
                "`-` No NSFW, Advertising, Racist or Homophobic content\n" +
                "`-` No insulting of other member in the server\n" +
                "`-` No inappropriate links such as Ip loggers, Viruses or other links of that sort\n\n" +
                "Refer to <#756197262320730152> for more detailed rules.\n\n" +
                "**Note:** Server Admins have the authority to remove any user that doesn't present an acceptable behavior based on their judgement.\n\n" +
                `\`-\` **If you have any questions feel free to dm <@${client.user.id}>\n\n**` +
                "**Click** the button bellow to verify that you agree with our rules, and that you feel ready to join our server"
            )
            .setColor(config.MainHexColor)

        const Button = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId("verify")
                    .setLabel("Click to Verify!")
                    .setEmoji("<:check:767340274539429888>")
                    .setStyle("SECONDARY")
            )

        guild.channels.cache.get("756196866928148540").send({ embeds: [embed], components: [Button] })
    }
}