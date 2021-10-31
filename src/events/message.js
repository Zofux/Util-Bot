const Discord = require("discord.js")

module.exports = {
    name: 'messageCreate',
    async execute(message, client) {
        if (message.author.bot) return;
        if (message.guild) {
            if (message.channel.parent.id == "903743105122046012") {
                if (isNaN(message.channel.name)) return;
                else {
                    const user = message.guild.members.cache.get(message.channel.name)
                    if (!user) {
                        const embed = new Discord.MessageEmbed()
                            .setDescription(`<:cross:896045962940780555> <@${message.author.id}>, I can't find that user in this server`)
                            .setColor("#ff7575")
                            .setAuthor(message.author.username, message.author.displayAvatarURL())
                            .setFooter(message.guild.name)
                            .setTimestamp()
                        message.channel.send({ embeds: [embed] })
                    } else {
                        let embed = new Discord.MessageEmbed()
                            .setDescription(`<@${message.author.id}>\n─────────────\n${message.content}`)
                            .setColor("#5999ff")
                            .setThumbnail(message.author.displayAvatarURL())
                        user.send({ embeds: [embed] }).then(() => message.channel.send("Message sent."))
                    }
                }
            }
        } else {
            const guild = client.guilds.cache.get("892751160182730772")
            const channel = guild.channels.cache.find(x => x.name == message.author.id)
            if (channel) {
                let embed = new Discord.MessageEmbed()
                    .setDescription(`<@${message.author.id}>\n─────────────\n${message.content}`)
                    .setColor("#5999ff")
                    .setThumbnail(message.author.displayAvatarURL())
                channel.send({ embeds: [embed] }).then(() => message.author.send("Message Sent."))
            } else if (!channel) {
                let confirm = new Discord.MessageEmbed()
                    .setDescription(`<@${client.user.id}>\n─────────────\nThank you for you message! Our moderation team will reply to you ass soon as possible`)
                    .setColor("#5999ff")
                    .setThumbnail(client.user.displayAvatarURL())
                message.channel.send({ embeds: [confirm] })
    
                guild.channels.create(message.author.id, {
                    parent: guild.channels.cache.get("903743105122046012"),
                    permissionOverwrites: [
                        {
                            id: '892751160182730772',
                            deny: ["VIEW_CHANNEL"],
                            allow: ["EMBED_LINKS"]
                        },
                        {
                            id: '904317722362540102',
                            allow: ["VIEW_CHANNEL", "SEND_MESSAGES", "READ_MESSAGE_HISTORY"],
                        },
                        {
                            id: message.author.id,
                            allow: ["VIEW_CHANNEL", "SEND_MESSAGES", "READ_MESSAGE_HISTORY"],
                        },
                    ]
                }).then(x => {
                    let embed = new Discord.MessageEmbed()
                        .setDescription(`<@${message.author.id}>\n─────────────\n${message.content}`)
                        .setColor("#5999ff")
                        .setThumbnail(message.author.displayAvatarURL())
                    x.send({ embeds: [embed] })
    
                })
            }
        }
       
      

    }
}