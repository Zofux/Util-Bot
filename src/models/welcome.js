const mongoose = require('mongoose')

const model = new mongoose.Schema({
    guildId: String,
    channelId: String,
    content: String,
    embed: Boolean,
    color: String,
    title: String,
    footer: String,
    image: String,
    thumbnail: String,
    timestamp: Boolean
})

module.exports = mongoose.model('Welcome Messages', model)