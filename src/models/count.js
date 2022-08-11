const mongoose = require('mongoose')

const model = new mongoose.Schema({
    guildId: String,
    channelId: String, 
    count: Number
})

module.exports = mongoose.model('Count', model)