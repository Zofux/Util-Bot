const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js')
const config = require(`../../../config.json`)

module.exports = {
    data: new SlashCommandBuilder()
        .setName(`echo`)
        .setDescription(`Make the bot send a message in the current channel`)
        .addStringOption(option =>
            option.setName("message").setDescription("The message you want the bot to say").setRequired(true)),
    async execute(interaction, client) {
        await interaction.deferReply({ ephemeral: true })

        if (!interaction.member.permissions.has(Discord.Permissions.FLAGS.MANAGE_GUILD)) {
            const embed = new Discord.MessageEmbed()
                .setDescription(`${config.crossEmoji} You can't use this command, you need the \`Manage Server\` permission`)
                .setColor(config.ErrorHexColor)
                .setAuthor(interaction.user.username, interaction.user.displayAvatarURL())
                .setFooter("Made by Zofux")
                .setTimestamp()
            return interaction.editReply({ embeds: [embed], ephemeral: true })
        }

        const message = interaction.options.getString("message")
        const newMessage = message.replace("\n", "\n")
        interaction.channel.send({ content: newMessage }).then(() => {
            const embed = new Discord.MessageEmbed()
                .setAuthor(`Message Sent`)
                .setDescription(`${config.checkEmoji} I've sent your message in the current channel`)
                .setColor(config.SuccessHexColor)
                .setFooter(`Made by Zofux`)
            return interaction.editReply({ embeds: [embed], ephemeral: true })
        })
    }
}