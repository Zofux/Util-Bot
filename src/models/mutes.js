const mongoose = require('mongoose')

const model = new mongoose.Schema({
    guildId: String,
    userId: String,
    expires: Date
})

module.exports = mongoose.model('Mutes', model)