const Discord = require('discord.js')
const config = require("../../config.json")
const db = require('../models/joinToCreate')

module.exports = {
    name: 'voiceStateUpdate',
    async execute(oldState, newState, client) {

        let joinToCreate = config.joinToCreateVoiceChannel

        if (newState.channelID === null) {
            // leave
            db.findOne({ voiceChannel: oldState.channelID }, (err, res) => {
                if (err || !res || !oldState.channel) return;
                if (res) {
                    if (oldState.channelID === res.voiceChannel) {
                        if (oldState.channel.members.size <= 0) oldState.channel.delete().then(async channel => {
                            await db.findOneAndDelete({ voiceChannel: channel.id });
                        });
                    }
                }
            })
        }
        else if (oldState.channelID === null) {
            // Join

            if (newState.channel.id === joinToCreate) {
                db.findOne({ userId: newState.member.user.id }, (err, res) => {
                    if (res) {
                        const channel = newState.member.guild.channels.cache.get(res.voiceChannel)
                        return newState.member.voice.setChannel(channel);
                    } else if (!res) {
                        client.guilds.cache.get(config.guild).channels.create(`${newState.member.user.username}'s channel`, {
                            type: 'voice',
                            parent: config.joinToCreateVoiceChannelCategory,
                            permissionOverwrites: [
                                {
                                    id: config.guild,
                                    deny: ["VIEW_CHANNEL"]
                                },
                                {
                                    id: config.memberRole,
                                    allow: ["VIEW_CHANNEL", "CONNECT"],
                                }
                            ]
                        }).then(channel => {
                            newState.member.voice.setChannel(channel);
                            new db({
                                voiceChannel: channel.id,
                                userId: newState.member.user.id
                            }).save()
                        })
                    }
                })
            }
        }
        else {
            // Move

            db.findOne({ voiceChannel: oldState.channelID }, (err, res) => {
                if (!err && res) {
                    if (oldState.channelID !== joinToCreate) {
                        if (oldState.channelID === res.voiceChannel) {
                            db.findOne({ voiceChannel: oldState.channelID }, (err, res) => {
                                if (err || !res) return;
                                if (res) {
                                    if (oldState.channelID === res.voiceChannel) {
                                        if (oldState.channel.members.size <= 0) oldState.channel.delete().then(async channel => {
                                            await db.findOneAndDelete({ voiceChannel: channel.id });
                                        });
                                    }
                                }
                            })
                        }
                    }
                }
            });

            if (newState.channelID === joinToCreate) {
                if (newState.channelID === joinToCreate) {
                    db.findOne({ userId: newState.member.user.id }, (err, res) => {
                        if (res) {
                            const channel = newState.member.guild.channels.cache.get(res.voiceChannel)
                            return newState.member.voice.setChannel(channel);
                        } else if (!res) {
                            client.guilds.cache.get(config.guild).channels.create(`${newState.member.user.username}'s channel`, {
                                type: 'voice',
                                parent: config.joinToCreateVoiceChannelCategory,
                                permissionOverwrites: [
                                    {
                                        id: config.guild,
                                        deny: ["VIEW_CHANNEL"]
                                    },
                                    {
                                        id: config.memberRole,
                                        allow: ["VIEW_CHANNEL", "CONNECT"],
                                    }
                                ]
                            }).then(channel => {
                                newState.member.voice.setChannel(channel);
                                new db({
                                    voiceChannel: channel.id,
                                    userId: newState.member.user.id
                                }).save()
                            })
                        }
                    })
                } else return;
            }
        }

    }
}