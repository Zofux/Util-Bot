const mongoose = require('mongoose')

const model = new mongoose.Schema({
    messageId: String,
    categoryId: String,
    transcriptChannelId: String,
    tickets: Array,
})

module.exports = mongoose.model('Tickets', model)