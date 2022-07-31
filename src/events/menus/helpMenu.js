const Discord = require('discord.js')
const config = require('../../../config.json')

module.exports = async (interaction, client) => {
    if (interaction.customId === 'select') {
        if (interaction.values.includes("information")) {
            const embed = new Discord.MessageEmbed()
                .setAuthor(`${client.user.username} - Commands [Information]`, client.user.displayAvatarURL())
                .setColor(config.MainHexColor)
                .setDescription(
                    "Here are all the commands that fall under the category of **Information**, use the menu below to go to another category" +
                    "\n\n\`[]\` : **Optional Argument**\n\`<>\` : **Required Argument**\n\u200B"
                )
                .addFields([
                    { name: "❓Help", value: "Usage: `/help` | This command shows you a detailed descrition of every command with this bot" },
                    { name: "✅Verify", value: "Usage: `/verify` | This command will help you to verify again if you fail you initial verification"},
                    { name: "⚠️Warnings", value: "Usage: `/warnings [user]` | This command will show all warnings a user has, leave empty to show your own"},
                    { name: "🏆Level", value: "Usage: `/level` | This command will show your current level"}
                ])
                .setFooter("Made by Zofux")

            await interaction.update({ embeds: [embed] })
        }

        if (interaction.values.includes("moderation")) {
            const embed = new Discord.MessageEmbed()
                .setAuthor(`${client.user.username} - Commands [Moderation]`, client.user.displayAvatarURL())
                .setColor(config.MainHexColor)
                .setDescription("Test")
                .setFooter("Made by Zofux")

            await interaction.update({ embeds: [embed] })
        }

        if (interaction.values.includes("music")) {
            const embed = new Discord.MessageEmbed()
                .setAuthor(`${client.user.username} - Commands [Music]`, client.user.displayAvatarURL())
                .setColor(config.MainHexColor)
                .setDescription("Test")
                .setFooter("Made by Zofux")

            await interaction.update({ embeds: [embed] })
        }

        if (interaction.values.includes("voice_channels")) {
            const embed = new Discord.MessageEmbed()
                .setAuthor(`${client.user.username} - Commands [Voice Channels]`, client.user.displayAvatarURL())
                .setColor(config.MainHexColor)
                .setDescription("Test")
                .setFooter("Made by Zofux")

            await interaction.update({ embeds: [embed] })
        }

        if (interaction.values.includes("suggestions")) {
            const embed = new Discord.MessageEmbed()
                .setAuthor(`${client.user.username} - Commands [Suggestions]`, client.user.displayAvatarURL())
                .setColor(config.MainHexColor)
                .setDescription("Test")
                .setFooter("Made by Zofux")

            await interaction.update({ embeds: [embed] })
        }
    }


}