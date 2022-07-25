const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js')
const config = require(`../../../config.json`)

module.exports = {
    data: new SlashCommandBuilder()
        .setName(`play`)
        .setDescription(`Play a song!`)
        .addStringOption(option =>
            option.setName(`query`).setDescription(`The song you want to play`).setRequired(true)),
    async execute(interaction, client) {
        await interaction.deferReply({ ephemeral: true })

        if (!interaction.member.voice.channelId) {
            const embed = new Discord.MessageEmbed()
                .setDescription(`${config.crossEmoji} You are not in a voice channel`)
                .setColor(`#ff7575`)
                .setAuthor(interaction.user.username, interaction.user.displayAvatarURL())
                .setTimestamp()
            return interaction.followUp({ embeds: [embed], ephemeral: true })
        }
        if (interaction.guild.me.voice.channelId && interaction.member.voice.channelId !== interaction.guild.me.voice.channelId) {
            const embed = new Discord.MessageEmbed()
                .setDescription(`${config.crossEmoji} Im currently in <#${interaction.guild.me.voice.channelId}>`)
                .setColor(`#ff7575`)
                .setAuthor(interaction.user.username, interaction.user.displayAvatarURL())
                .setTimestamp()
            return interaction.followUp({ embeds: [embed], ephemeral: true })
        }
        const query = interaction.options.get("query").value;
        const queue = client.player.createQueue(interaction.guild, {
            metadata: {
                channel: interaction.channel
            }
        });

        // verify vc connection
        try {
            if (!queue.connection) await queue.connect(interaction.member.voice.channel);
        } catch {
            queue.destroy();
            const embed = new Discord.MessageEmbed()
                .setDescription(`${config.crossEmoji} Could not join your voice channel`)
                .setColor(`#ff7575`)
                .setAuthor(interaction.user.username, interaction.user.displayAvatarURL())
                .setTimestamp()
            return interaction.followUp({ embeds: [embed], ephemeral: true })
        }

        const track = await client.player.search(query, {
            requestedBy: interaction.user
        }).then(x => x.tracks[0]);

        if (!track) {
            const embed = new Discord.MessageEmbed()
                .setDescription(`${config.crossEmoji} Could not find any song by the name \`${query}\``)
                .setColor(`#ff7575`)
                .setAuthor(interaction.user.username, interaction.user.displayAvatarURL())
                .setTimestamp()
            return interaction.followUp({ embeds: [embed], ephemeral: true })
        }

        queue.play(track);

        const embed = new Discord.MessageEmbed()
            .setColor("#5999ff")
            .setAuthor("Added to que", interaction.user.displayAvatarURL())
            .setDescription(`[${track.title}](${track.url}) by ${track.author} [${track.duration}]`)
        return interaction.editReply({ embeds: [embed] })
    }
}
