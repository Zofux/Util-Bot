const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js')
const config = require(`../../../config.json`)

module.exports = {
    data: new SlashCommandBuilder()
        .setName(`help`)
        .setDescription(`Get more information about my commands`)
        .addStringOption(option =>
            option.setName(`command`).setDescription(`Get info about a single command, leave empty for a list of all commmands.`)),
    async execute(interaction) {
        await interaction.deferReply()

        let helpEmbed = new Discord.MessageEmbed()
            .setColor("#5999ff")
            .setDescription(
                `${config.botsName} is a easy to use all in one discord bot that is made to make ${interaction.guild.name} run smoother, bellow you will see a list of all the available commands. Simply use \`/help [command]\` to get more information about the command.` +
                `\n\n\`[]\` : **Optional Argument**\n\`<>\` : **Required Argument**`)
            .addFields(
                { name: '🗂️ Information', value: "`help`, `verify`, `warnings`"},
                { name: '🛠️ Moderation', value: "`ban`, `kick`, `mute`, `unmute`, `warn`, `clearwarns`"},
                { name: '🎸 Music', value: "`play`, `clear`, `pause`, `queue`, `resume`, `shuffle`, `skip`"},
                { name: '🔊 Voice Channels', value: "`voice lock`, `voice kick`"},
            )
            .setFooter("Made by Zofux")
    }
}