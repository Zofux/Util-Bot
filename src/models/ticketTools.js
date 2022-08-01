const mongoose = require('mongoose')

const model = new mongoose.Schema({
    messageId: String,
    categoryId: String
})

module.exports = mongoose.model('Ticket Tools', model)