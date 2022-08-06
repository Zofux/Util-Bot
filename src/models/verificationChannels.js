const mongoose = require('mongoose')

const model = new mongoose.Schema({
    guildId: String,
    channelId: String,
})

module.exports = mongoose.model('Verification Channels', model)