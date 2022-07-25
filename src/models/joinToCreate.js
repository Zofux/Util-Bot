const mongoose = require('mongoose');

const reqString = {
    type: String,
    required: true
}

const joinToCreate = new mongoose.Schema({
    voiceChannel: reqString,
    userId: reqString,
    locked: Boolean,
    muted: Array,
    blacklisted: Array
})

module.exports = mongoose.model("Voice Channels", joinToCreate)