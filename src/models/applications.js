const mongoose = require('mongoose')

const model = new mongoose.Schema({
    userId: String,
    date: String,
    id: String,
    channelId: String,
    type: String
})

module.exports = mongoose.model('Applications', model)