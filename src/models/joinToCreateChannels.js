const mongoose = require('mongoose');

const joinToCreate = new mongoose.Schema({
    guildId: String,
    channelId: String,
    categoryId: String
})

module.exports = mongoose.model("Join to Create Channels", joinToCreate)