const mongoose = require('mongoose')

const model = new mongoose.Schema({
    guildId: String,
    userId: String,
    code: String,
    expires: Date,
})

module.exports = mongoose.model('Captchas', model)