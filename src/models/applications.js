const mongoose = require('mongoose')

const model = new mongoose.Schema({
    guildId: String,
    name: String,
    category: String,
    questions: Array,
    applications: Array
})

module.exports = mongoose.model('Applications', model)