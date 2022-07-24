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
       
    if (interaction.commandName === "skip") {
        player.getQueue.skip();
    }
});


(async () => {
    for (file of functions) {
        require(`./src/functions/${file}`)(client, player);
    }

    client.handleEvents(eventFiles, "./src/events");
    client.handleCommands(commandFolders, "./src/commands")
    client.login(process.env.token)
    require('./src/database')()
})();

