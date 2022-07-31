const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js')
const config = require(`../../../config.json`)

module.exports = {
    data: new SlashCommandBuilder()
        .setName(`help`)
        .setDescription(`Get more information about my commands`),
    async execute(interaction, client) {
        await interaction.deferReply()

        const menu = new Discord.MessageActionRow()
            .addComponents(
                new Discord.MessageSelectMenu()
                .setCustomId("select")
                .setPlaceholder("Click Me!")
                .addOptions(
                    {
                        label: "🗂️ Information",
                        value: "information"
                    },
                    {
                        label: "🛠️ Moderation",
                        value: "moderation"
                    },
                    {
                        label: "🎸 Music",
                        value: "music"
                    },
                    {
                        label: "🔊 Voice Channels",
                        value: "voice_channels"
                    },
                    {
                        label: "💡 Suggestions",
                        value: "suggestions"
                    },
                )
            )

        const embed = new Discord.MessageEmbed()
            .setAuthor(`${client.user.username} - Commands`, client.user.displayAvatarURL())
            .setColor(config.MainHexColor)
            .setDescription(
                `${client.user.username} is an easy to use all in one discord bot that is made to make **${interaction.guild.name}** run smoother, bellow you will see a list of all the available commands. Simply select a category from the meny below.` +
                `\n\n\`[]\` : **Optional Argument**\n\`<>\` : **Required Argument**\n\u200B`)
            .addFields(
                { name: '🗂️ Information', value: "`help`, `verify`, `warnings`, `level`" },
                { name: '🛠️ Moderation', value: "`ban`, `kick`, `mute`, `unmute`, `warn`, `clearwarns`" },
                { name: '🎸 Music', value: "`play`, `clear`, `pause`, `queue`, `resume`, `shuffle`, `skip`" },
                { name: '🔊 Voice Channels', value: "`voice lock`, `voice mute`, `voice kick`, `voice ban`" },
                { name: '💡 Suggestions', value: "`suggestion reply`" }
            )
            .setFooter("Made by Zofux")

        await interaction.editReply({ embeds: [embed], components: [menu] })
    }
}