const mongoose = require('mongoose')

const model = new mongoose.Schema({
    messageId: String,
    categoryId: string
})

module.exports = mongoose.model('Tickets', model)