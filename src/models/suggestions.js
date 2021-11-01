const mongoose = require('mongoose')

const model = new mongoose.Schema({
    userId: String,
    suggestion: String,
    id: String,
})

module.exports = mongoose.model('Suggestions', model)