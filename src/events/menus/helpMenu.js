const Discord = require('discord.js')
const config = require('../../../config.json')

module.exports = async (interaction, client) => {
    if (interaction.customId === 'select') {
        if (interaction.values.includes("utility")) {
            const embed = new Discord.MessageEmbed()
                .setAuthor(`${client.user.username} - Commands [Utility]`, client.user.displayAvatarURL())
                .setColor(config.MainHexColor)
                .setDescription(
                    "Here are all the commands that fall under the category of **Utility**, use the menu below to go to another category" +
                    "\n\n\`[]\` : **Optional Argument**\n\`<>\` : **Required Argument**\n\u200B"
                )
                .addFields([
                    { name: "🗂️ Utility commands", value: " `/help` This command shows you a detailed descri ption of every command\n`/verify` This command will help you to verify again if you fail you initial verification\n`/warnings [user]` This command will show all warnings a user has\n`/level` This command will show your current level\n`/echo <message>` This command will make the bot send a message in the chat\n`/welcome message <channel> <content> Welcome new members to the server`\n\u200B"},
                    {name: "Embed commands", value: "> `/embed <content> <color> <timestamp> [footer] [title] [thumbnail] [image]`\n> • This command will send an embed in the current channel.\n\n> `/welcome embed <channel> <content> <color> <timestamp> [footer] [title] [thumbnail] [image]`\n> • Welcome new members with a custom embed.\n\n> **If you want to improve your embeds you can add some of the variables below:**\n> \n> **__Text__**\n> These variables only works for `/welcome embed`\n> `{user.username}` The username of the joining user\n> `{user.discriminator}` The discriminator of the joining user\n> `{user.tag}` Tag the joining user (Only works in the description/content)\n> `{server.name}` The name of the current server\n> `{server.members}` The new membercount of the current server\n> \n> **__Images__**\n> `{user.avatar}` The profile picture of the user/joining user\n> `{server.icon}` The icon of the current server\n> `{bot.avatar}` The profile picture of the bot" },
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
                        name: "🛠️ Moderation Commands",
                        value: "`/ban <user> <reason>` Ban somone from the server\n`/kick <user> <reason>` Kick someone from the server\n`/mute <user> <time> <reason>` Prevent someone from talking in chat\n`/unmute <user <reason>` Make some able to talk in chat again\n`/warn <user> <reason>` Give someone a warning\n`/clearwarns <user>` Clear all warnings from a user\n`/slowmode <channel> <slowmode>` Alter the slowmode in a channel\n`/filter add <word>` Add a word to the word-filter\n`/filter remove <word>` Remove a word from the word-filter\n`/filter display` Get a list of all the words in the word-filter\n`/log set <channel>` Setup the log channel in your server\n`/log display` Display the current log channel"
                    },
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
                    { name: "🎸 Music Commands", value: "`/play <query>` Play any song of your choise\n`/clear` Remove all songs from the que\n`/pause` Pause the current music\n`/que [page]` Make some able to talk in chat again\n`/resume` Resume the music after it has been paused\n`/shuffle` Shuffle the songs in the que\n`/skip` Skip to the next song in the que" },
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
                    { name: "🔊 Voice Channel Commands", value: "`/voice channel <channel>` Setup the Join to create channel\n`/voice lock` Lock/unlock your current voice channel\n`/voice mute <user>` Mute a given user in your voice channel\n`/voice kick <user>` Kick someone from your voice channel\n`/voice ban <user>` Ban someone from your voice channel" },
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
                    { name: "💡 Suggestion Commands", value: "`/suggestion reply <id> <status> [reply]` Reply to a suggestion\n`/suggestion channel <channel>` Setup the suggestion channel" },
                ])
                .setFooter("Made by Zofux")

            await interaction.update({ embeds: [embed] })
        }

        if (interaction.values.includes("tickets")) {
            const embed = new Discord.MessageEmbed()
                .setAuthor(`${client.user.username} - Commands [Tickets]`, client.user.displayAvatarURL())
                .setColor(config.MainHexColor)
                .setDescription(
                    "Here are all the commands that fall under the category of **Tickets**, use the menu below to go to another category" +
                    "\n\n\`[]\` : **Optional Argument**\n\`<>\` : **Required Argument**\n\u200B"
                )
                .addFields([
                    { name: "📩 Ticket Commands", value: "`/ticket create <category id> <transcript channel id>` Create a embed that your members can open tickets with" },
                    { name: "Arguments", value: "`<category id>` The id of the category all tickets opend with this ticket tool should get created under\n\n`<transcript channel id>` The id of the channel all transcripts (A file including all messages sent in the ticket) should get sent to" }
                ])
                .setFooter("Made by Zofux")

            await interaction.update({ embeds: [embed] })
        }
    }


}