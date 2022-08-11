const mongoose = require('mongoose')

const model = new mongoose.Schema({
    guildId: String,
    channelId: String, 
    count: Number,
    lastUserId: String,
})

module.exports = mongoose.model('Count', model)