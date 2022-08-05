const mongoose = require('mongoose')

const model = new mongoose.Schema({
    guildId: String,
    suggestionChannel: String,
})

module.exports = mongoose.model('Suggestion Channels', model)