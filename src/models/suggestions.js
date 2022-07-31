const mongoose = require('mongoose')

const model = new mongoose.Schema({
    userId: String,
    messageId: String,
    id: String,
    suggestion: String,
    status: String,
})

module.exports = mongoose.model('Suggestions', model)