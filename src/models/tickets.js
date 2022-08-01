const mongoose = require('mongoose')

const model = new mongoose.Schema({
    userId: String,
    channelId: String,
    ticketId: String,
    Locked: Boolean,
    Closed: Boolean
})

module.exports = mongoose.model('Ticket Tools', model)