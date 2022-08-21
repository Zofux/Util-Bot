const mongoose = require('mongoose')

const model = new mongoose.Schema({
    userId: String,
    guildId: String,
    application: String,
    count: Number,
    expires: Date,
    questions: Array
})

module.exports = mongoose.model('Current Applications', model)