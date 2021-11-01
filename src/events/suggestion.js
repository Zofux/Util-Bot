module.exports = async (message, client) => {
    if (!message.channel.id === "904788215028920321") return;
    else {
        const content = message.content;
        await message.delete()
        
        const db = require('../models/suggestions')

        var randomstring = require("randomstring");
        const id = randomstring.generate(7)
        new db({
            userId: message.author.id,
            suggestion: content,
            id: id,
        }).save().then(async () => {
            const Discord = require('discord.js')
            let embed = new Discord.MessageEmbed()
               .addFields([
                   {name: "💡 | Suggestion", value: content}
               ])
               .setAuthor(message.author.username, message.author.displayAvatarURL())
               .setFooter(id)
               .setTimestamp()
               .setThumbnail(message.author.displayAvatarURL())
            const msg = await message.channel.send({ embeds: [embed] })
            await msg.react("👍").then(async () => {
                await msg.react("👎")
            })
        })
    }
}