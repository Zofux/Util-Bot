const mongoose = require('mongoose')

const model = new mongoose.Schema({
    userId: String,
    reason: String,
    expires: Date
})

module.exports = mongoose.model('Auto Infractions', model)