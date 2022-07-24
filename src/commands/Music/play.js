const { SlashCommandBuilder } = require('@discordjs/builders');
const { QueryType } = require('discord-player');
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

        if (!interaction.member.voice.channelId) return await interaction.editReply({ content: "You are not in a voice channel!" });
        if (interaction.guild.me.voice.channelId && interaction.member.voice.channelId !== interaction.guild.me.voice.channelId) return await interaction.editReply({ content: "You are not in my voice channel!", ephemeral: true });
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
            return await interaction.editReply({ content: "Could not join your voice channel!", ephemeral: true });
        }

        const track = await client.player.search(query, {
            requestedBy: interaction.user
        }).then(x => x.tracks[0]);

        if (!track) return await interaction.editReply({ content: `❌ | Track **${query}** not found!` });
        if (track.playlist) {
            const result = await client.player.search(query, {
                requestedBy: interaction.user,
                searchEngine: QueryType.YOUTUBE_PLAYLIST
            });
            await queue.addTracks(result.tracks)
            const embed = new Discord.MessageEmbed()
                .setColor("#f23a3a")
                .setAuthor("Added to que | (Playlist)")
                .setDescription(`[${track.playlist.title}](${track.playlist.url}) by ${track.author} [${track.playlist.duration}]`)
            return interaction.editReply({ embeds: [embed] })
        }

        queue.play(track);

        const embed = new Discord.MessageEmbed()
            .setColor("#f23a3a")
            .setAuthor("Added to que")
            .setDescription(`[${track.title}](${track.url}) by ${track.author} [${track.duration}]`)
        return interaction.editReply({ embeds: [embed] })
    }
}
