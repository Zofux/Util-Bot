const Discord = require("discord.js")
const db = require('../models/applications')
const unixTime = require('unix-time');
const config = require("../../config.json")

module.exports = {
    name: 'modalSubmit',
    async execute(modal, client) {
        if (modal.customId === "staff") {
            console.log(modal)
            modal.reply({ content: "Thx <3", ephemeral: true })
        }
    }
}