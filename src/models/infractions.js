const mongoose = require('mongoose')

const model = new mongoose.Schema({
    userId: String,
    guildId: String,
    infractions: Array
})

module.exports = mongoose.model('Infractions', model)