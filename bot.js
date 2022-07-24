const { Client, Intents, Collection, MessageEmbed } = require('discord.js')
const fs = require('fs')
require('dotenv').config();
const client = new Client({ 
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_BANS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_VOICE_STATES, Intents.FLAGS.DIRECT_MESSAGES],
    partials: ["CHANNEL", "MESSAGE", "REACTION", "GUILD_MEMBER"]
});

client.commands = new Collection();

const functions = fs.readdirSync("./src/functions").filter(file => file.endsWith(".js"));
const commandFolders = fs.readdirSync("./src/commands")
const eventFiles = fs.readdirSync("./src/events").filter(file => file.endsWith(".js"));

const { Player } = require("discord-player")
const player = new Player(client)

player.on("trackStart", (queue, track) => {
    const embed = new MessageEmbed()
    .setColor("#f23a3a")
    .setAuthor("Now Playing")
    .setDescription(`[${track.title}](${track.url}) by ${track.author} [${track.duration}]`)
    queue.metadata.channel.send({ embeds: [embed] })
})

client.on("interactionCreate", async (interaction) => {
    if (!interaction.isCommand()) return;

    // /play track:Despacito
    // will play "Despacito" in the voice channel
    if (interaction.commandName === "play") {
        if (!interaction.member.voice.channelId) return await interaction.reply({ content: "You are not in a voice channel!", ephemeral: true });
        if (interaction.guild.me.voice.channelId && interaction.member.voice.channelId !== interaction.guild.me.voice.channelId) return await interaction.reply({ content: "You are not in my voice channel!", ephemeral: true });
        const query = interaction.options.get("query").value;
        const queue = player.createQueue(interaction.guild, {
            metadata: {
                channel: interaction.channel
            }
        });
        
        // verify vc connection
        try {
            if (!queue.connection) await queue.connect(interaction.member.voice.channel);
        } catch {
            queue.destroy();
            return await interaction.reply({ content: "Could not join your voice channel!", ephemeral: true });
        }

        await interaction.deferReply();
        const track = await player.search(query, {
            requestedBy: interaction.user
        }).then(x => x.tracks[0]);
        if (!track) return await interaction.followUp({ content: `❌ | Track **${query}** not found!` });

        queue.play(track);

        return await interaction.followUp({ content: `⏱️ | Loading track **${track.title}**!` });
    }
    if (interaction.commandName === "skip") {
        client.getQueue.skip();
    }
});


(async () => {
    for (file of functions) {
        require(`./src/functions/${file}`)(client);
    }

    client.handleEvents(eventFiles, "./src/events");
    client.handleCommands(commandFolders, "./src/commands")
    client.login(process.env.token)
    require('./src/database')()
})();

