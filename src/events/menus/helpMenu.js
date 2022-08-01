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
            .setAuthor(`${client.user.username} - Commands [Moderation]`, client.user.displayAvatarURL())
            .setColor(config.MainHexColor)
            .setDescription(
                "Here are all the commands that fall under the category of **Music**, use the menu below to go to another category" +
                "\n\n\`[]\` : **Optional Argument**\n\`<>\` : **Required Argument**\n\u200B"
            )
            .addFields([
                { name: "▶️Play", value: " `/play <query>` Play any song of your choise" },
                { name: "🗑️Clear", value: "`/clear` Remove all songs from the que"},
                { name: "⏯️Pause", value: "`/pause` Pause the current music"},
                { name: "📦Que", value: "`/que [page]` Make some able to talk in chat again"},
                { name: "⏯️Resume", value: "`/resume` Resume the music after it has been paused"},
                { name: "🔀Shuffle", value: "`/shuffle` Shuffle the songs in the que"},
                { name: "⏭️Skip", value: "`/skip` Skip to the next song in the que"}
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
                { name: "🔒Voice Lock", value: " `/voice lock` Lock/unlock your current voice channel" },
                { name: "🔇Voice Mute", value: "`/voice mute <user>` Mute a given user in your voice channel"},
                { name: "🦿Voice Kick", value: "`/voice kick <user>` Kick someone from your voice channel"},
                { name: "🔨Voice Ban", value: "`/voice ban <user>` Ban someone from your voice channel"},
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
                { name: "💬Suggestion Reply", value: " `/suggestion reply <id> <status> [reply]` Reply to suggestions in the suggestion channel" },
            ])
            .setFooter("Made by Zofux")

            await interaction.update({ embeds: [embed] })
        }
    }


}