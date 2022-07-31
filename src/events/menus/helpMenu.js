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
                    { name: "🙋‍♂️Help", value: " `/help` This command shows you a detailed descri ption of every command" },
                    { name: "✅Verify", value: "`/verify` This command will help you to verify again if you fail you initial verification"},
                    { name: "⚠️Warnings", value: "`/warnings [user]` This command will show all warnings a user has"},
                    { name: "🏆Level", value: "`/level` This command will show your current level"}
                ])
                .setFooter("Made by Zofux")

            await interaction.update({ embeds: [embed] })
        }

        if (interaction.values.includes("moderation")) {
            const embed = new Discord.MessageEmbed()
            .setAuthor(`${client.user.username} - Commands [Moderation]`, client.user.displayAvatarURL())
            .setColor(config.MainHexColor)
            .setDescription(
                "Here are all the commands that fall under the category of **Moderation**, use the menu below to go to another category" +
                "\n\n\`[]\` : **Optional Argument**\n\`<>\` : **Required Argument**\n\u200B"
            )
            .addFields([
                { name: "🔨Ban", value: " `/ban <user> <reason>` Ban somone from the server" },
                { name: "🦿Kick", value: "`/kick <user> <reason>` Kick someone from the server"},
                { name: "🔇Mute", value: "`/mute <user> <time> <reason>` Prevent someone from talking in chat"},
                { name: "🔈Unmute", value: "`/unmute <user <reason>` Make some able to talk in chat again"},
                { name: "⚠️Warn", value: "`/warn <user> <reason>` Give someone a warning"},
                { name: "🧹Clearwarns", value: "`/clearwarns <user>` Clear all warnings from a user"}
            ])
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