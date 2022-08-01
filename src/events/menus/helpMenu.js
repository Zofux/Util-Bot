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
                    { name: "Information commands🗂️", value: " `/help` This command shows you a detailed descri ption of every command\n`/verify` This command will help you to verify again if you fail you initial verification\n`/warnings [user]` This command will show all warnings a user has\n`/level` This command will show your current level" },
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
                { 
                    name: "🛠️Moderation Commands", 
                    value: "`/ban <user> <reason>` Ban somone from the server\n`/kick <user> <reason>` Kick someone from the server\n`/mute <user> <time> <reason>` Prevent someone from talking in chat\n`/unmute <user <reason>` Make some able to talk in chat again\n`/warn <user> <reason>` Give someone a warning\n`/clearwarns <user>` Clear all warnings from a user" },
            ])
            .setFooter("Made by Zofux")

            await interaction.update({ embeds: [embed] })
        }

        if (interaction.values.includes("music")) {
            const embed = new Discord.MessageEmbed()
            .setAuthor(`${client.user.username} - Commands [Music]`, client.user.displayAvatarURL())
            .setColor(config.MainHexColor)
            .setDescription(
                "Here are all the commands that fall under the category of **Music**, use the menu below to go to another category" +
                "\n\n\`[]\` : **Optional Argument**\n\`<>\` : **Required Argument**\n\u200B"
            )
            .addFields([
                { name: "🎸Music Commands", value: "`/play <query>` Play any song of your choise\n`/clear` Remove all songs from the que\n`/pause` Pause the current music\n`/que [page]` Make some able to talk in chat again\n`/resume` Resume the music after it has been paused\n`/shuffle` Shuffle the songs in the que\n`/skip` Skip to the next song in the que" },
            ])
            .setFooter("Made by Zofux")

            await interaction.update({ embeds: [embed] })
        }

        if (interaction.values.includes("voice_channels")) {
            const embed = new Discord.MessageEmbed()
            .setAuthor(`${client.user.username} - Commands [Voice Channels]`, client.user.displayAvatarURL())
            .setColor(config.MainHexColor)
            .setDescription(
                "Here are all the commands that fall under the category of **Voice Channels**, use the menu below to go to another category" +
                "\n\n\`[]\` : **Optional Argument**\n\`<>\` : **Required Argument**\n\u200B"
            )
            .addFields([
                { name: "🔊Voice Channel Commands", value: "`/voice lock` Lock/unlock your current voice channel\n`/voice mute <user>` Mute a given user in your voice channel\n`/voice kick <user>` Kick someone from your voice channel\n`/voice ban <user>` Ban someone from your voice channel" },
            ])
            .setFooter("Made by Zofux")

            await interaction.update({ embeds: [embed] })
        }

        if (interaction.values.includes("suggestions")) {
            const embed = new Discord.MessageEmbed()
            .setAuthor(`${client.user.username} - Commands [Suggestions]`, client.user.displayAvatarURL())
            .setColor(config.MainHexColor)
            .setDescription(
                "Here are all the commands that fall under the category of **Suggestions**, use the menu below to go to another category" +
                "\n\n\`[]\` : **Optional Argument**\n\`<>\` : **Required Argument**\n\u200B"
            )
            .addFields([
                { name: "💡Suggestion Commands", value: "`/suggestion reply <id> <status> [reply]` Reply to suggestions in the suggestion channel" },
            ])
            .setFooter("Made by Zofux")

            await interaction.update({ embeds: [embed] })
        }
    }


}