const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js')
const config = require(`../../../config.json`)
const { pagination } = require("reconlx")

module.exports = {
    data: new SlashCommandBuilder()
        .setName(`help`)
        .setDescription(`Get more information about my commands`),
    async execute(interaction, client) {
        await interaction.deferReply()

        const embed1 = new Discord.MessageEmbed()
            .setAuthor(`${client.user.username} - Commands`, client.user.displayAvatarURL())
            .setColor(config.MainHexColor)
            .setDescription(
                `${client.user.username} is an easy to use all in one discord bot that is made to make **${interaction.guild.name}** run smoother, bellow you will see a list of all the available commands. Simply click the buttons below to get more info.` +
                `\n\n\`[]\` : **Optional Argument**\n\`<>\` : **Required Argument**\n\u200B`)
            .addFields(
                { name: '🗂️ Information', value: "`help`, `verify`, `warnings`, `level`" },
                { name: '🛠️ Moderation', value: "`ban`, `kick`, `mute`, `unmute`, `warn`, `clearwarns`" },
                { name: '🎸 Music', value: "`play`, `clear`, `pause`, `queue`, `resume`, `shuffle`, `skip`" },
                { name: '🔊 Voice Channels', value: "`voice lock`, `voice mute`, `voice kick`, `voice ban`" },
                { name: '💡 Suggestions', value: "`suggestion reply`" }
            )
            .setFooter("Made by Zofux")

        const embed2 = new Discord.MessageEmbed()
            .setAuthor(`${client.user.username} - Commands [Information]`, client.user.displayAvatarURL())
            .setDescription(
                "This is a detailed list over the the commands that fall under the category **Information**" + 
                "\n\n`/help`: Helps you navigate all the commands of the bot" +
                "\n\n`/verify`: If you fail your initial verifaction, this command will help you start a new one" +
                "\n\n`/warnigns [user]`: Show a list of all the warnings a user has, leave the **[user]** field empty to show your own" +
                "\n\n`/level` Displaly your current level"
            )
            .setColor(config.MainHexColor)
            .setFooter("Made by Zofux")

        const embeds = [embed1, embed2]

        interaction.editReply({embeds: [pagination({
            embeds: embeds,
            channel: interaction.channel
        }) ]})
    }
}