const mongoose = require('mongoose')

const model = new mongoose.Schema({
    guildId: String,
    words: Array
})

module.exports = mongoose.model('Filters', model)