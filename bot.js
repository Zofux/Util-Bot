const { Client, Intents, Collection, MessageEmbed } = require('discord.js')
const config = require("./config.json")
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
client.player = new Player(client, {
    ytdlOptions: {
        quality: "highestaudio",
        highWaterMark: 1 << 25
    }
})
client.player.on("trackStart", (queue, track) => {
    const embed = new MessageEmbed()
        .setColor(config.MainHexColor)
        .setAuthor("Now Playing", track.requestedBy.displayAvatarURL())
        .setDescription(`[${track.title}](${track.url}) by ${track.author} [${track.duration}]`)
        .setFooter(`Volume: ${queue.volume}%`)
    queue.metadata.channel.send({ embeds: [embed] })
    console.log(queue.metadata)
})

const Levels = require("discord-xp")
Levels.setURL(process.env.database)

function run() {
    for (file of functions) {
        require(`./src/functions/${file}`)(client);
    }

    client.handleEvents(eventFiles, "./src/events");
    client.handleCommands(commandFolders, "./src/commands")
    client.login(process.env.token)
    require('./src/database')()
}
run();




