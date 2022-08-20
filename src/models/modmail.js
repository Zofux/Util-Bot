const mongoose = require('mongoose')

const model = new mongoose.Schema({
    guildId: String,
    categoryId: String,
    mail: Array
})

module.exports = mongoose.model('Modmails', model)