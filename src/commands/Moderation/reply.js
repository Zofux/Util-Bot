const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("reply")
        .setDescription("Reply to a suggestion")
        .addStringOption(option =>
            option.setName("id").setDescription("The id of the suggestion").setRequired(true))
        .addStringOption(option =>
            option.setName("reply").setDescription("The message you want to reply with").setRequired(true)),
    async execute(interaction) {
        interaction.deferReply({ ephemeral: true })

        const id = interaction.options.getString("id")
        const reply = interaction.options.getString("reply")

        if (interaction.guild.roles.cache.get("896032767220015144").position > interaction.member.roles.highest.position) {
            const embed = new Discord.MessageEmbed()
                .setDescription("<:cross:896045962940780555> You can't use this command")
                .setColor("#ff7575")
                .setAuthor(interaction.user.username, interaction.user.displayAvatarURL())
                .setFooter(interaction.guild.name)
                .setTimestamp()
            return interaction.editReply({ embeds: [embed], ephemeral: true })
        }

        const db = require('../../models/suggestions')
        const res = await db.findOne({ id: id })
        if (!res) {
            const embed = new Discord.MessageEmbed()
                .setDescription("<:cross:896045962940780555> There seems to be no suggestion under that id in my database")
                .setColor("#ff7575")
                .setAuthor(interaction.user.username, interaction.user.displayAvatarURL())
                .setFooter(interaction.guild.name)
                .setTimestamp()
            return interaction.editReply({ embeds: [embed], ephemeral: true })
        } else {
            const channel = interaction.guild.channels.cache.get("904788215028920321")
            let embed = new Discord.MessageEmbed()
                .setColor("#00ff74")
                .setTimestamp()
                .setThumbnail(interaction.user.displayAvatarURL())
                .setAuthor(interaction.user.username, interaction.user.displayAvatarURL())
                .addFields([
                    { name: '💡 | Suggestion', value: res.suggestion },
                    { name: '🛠️ | Staff Reply', value: `${reply}` },
                ])
            channel.send({ embeds: [embed] })
        }
    }
}