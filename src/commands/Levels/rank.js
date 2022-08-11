const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js')
const config = require(`../../../config.json`)
const Levels = require('discord-xp');
const canvacord = require('canvacord')

module.exports = {
    data: new SlashCommandBuilder()
        .setName(`level`)
        .setDescription(`Want to know your current level?`),
    async execute(interaction, client) {
        await interaction.deferReply({ ephemeral: true })
        const user = await Levels.fetch(interaction.user.id, interaction.guild.id, true);

        if (user) {
            const neededXp = Levels.xpFor(parseInt(user.level) + 1)
            const img = interaction.user.displayAvatarURL({ format: 'png' });

            const rawLb = await Levels.fetchLeaderboard(interaction.guild.id, interaction.guild.memberCount);

            const lb = await Levels.computeLeaderboard(client, rawLb);
            let position;
            lb.forEach(member => {
                if (member.userID === interaction.user.id) {
                    position = member.position;
                }
            })

            const rank = new canvacord.Rank()
                .setAvatar(img)
                .setCurrentXP(user.xp)
                .setRequiredXP(neededXp)
                .setLevel(user.level)
                .setRank(position)
                .setProgressBar(config.MainHexColor, "COLOR")
                .setUsername(interaction.user.username)
                .setBackground("COLOR", config.MainHexColor)
                .setDiscriminator(interaction.user.discriminator);

            rank.build()
                .then(data => {
                    const attachment = new Discord.MessageAttachment(data, "rankcard.png");

                    return interaction.editReply({ files: [attachment] });
                });
        } else {
            let emebd = new Discord.MessageEmbed()
                .setAuthor(`${interaction.user.username}`, interaction.user.displayAvatarURL())
                .setDescription(`${config.crossEmoji} <@${interaction.user.id}>, you haven't talked enough to get a level`)
                .setColor(config.ErrorHexColor);
            return interaction.editReply({ embeds: [emebd] });
        }
    }
}