const Discord = require('discord.js')
const config = require("../../config.json")
const db = require('../models/joinToCreate')

module.exports = {
    name: 'voiceStateUpdate',
    async execute(oldState, newState, client) {

        if (newState.channelId === null) {
            // leave
            db.findOne({ voiceChannel: oldState.channelId }, (err, res) => {
                if (err || !res || !oldState.channel) return;
                if (res) {
                    if (oldState.channelId === res.voiceChannel) {
                        if (oldState.channel.members.size <= 0) oldState.channel.delete().then(async channel => {
                            await db.findOneAndDelete({ voiceChannel: channel.id });
                        });
                    }
                }
            })
        }
        else if (oldState.channelId === null) {
            // Join

            const joinToCreate = require('../models/joinToCreateChannels')
            const data = await joinToCreate.findOne({ guildId: newState.guild.id })
            if (!data) return

            if (newState.channel.id === data.channelId) {
                db.findOne({ userId: newState.member.user.id }, async (err, res) => {
                    if (res) {
                        const channel = newState.member.guild.channels.cache.get(res.voiceChannel)
                        if (!channel) {

                            await db.findOneAndDelete({ voiceChannel: res.voiceChannel });
                            client.guilds.cache.get(newState.guild.id).channels.create(`🔊｜${newState.member.user.username}'s channel`, {
                                type: 'GUILD_VOICE',
                                parent: data.categoryId,
                                permissionOverwrites: [
                                    {
                                        id: newState.guild.id,
                                        deny: ["VIEW_CHANNEL"]
                                    },
                                    {
                                        id: config.memberRole,
                                        allow: ["VIEW_CHANNEL", "CONNECT"],
                                    }
                                ]
                            }).then(newChannel => {

                                new db({
                                    voiceChannel: newChannel.id,
                                    userId: newState.member.user.id,
                                    locked: false,
                                    muted: [],
                                    blacklisted: []
                                }).save()
                                newState.member.voice.setChannel(newChannel);
                            })
                        }
                        return newState.member.voice.setChannel(channel);
                    } else if (!res) {
                        client.guilds.cache.get(newState.guild.id).channels.create(`🔊｜${newState.member.user.username}'s channel`, {
                            type: 'GUILD_VOICE',
                            parent: data.categoryId,
                            permissionOverwrites: [
                                {
                                    id: newState.guild.id,
                                    deny: ["VIEW_CHANNEL"]
                                },
                                {
                                    id: config.memberRole,
                                    allow: ["VIEW_CHANNEL", "CONNECT"],
                                }
                            ]
                        }).then(newChannel => {

                            new db({
                                voiceChannel: newChannel.id,
                                userId: newState.member.user.id,
                                locked: false,
                                muted: [],
                                blacklisted: []
                            }).save()
                            newState.member.voice.setChannel(newChannel);
                        })
                    }
                })
            }
        } else {
            // Move

            const joinToCreate = require('../models/joinToCreateChannels')
            const data = await joinToCreate.findOne({ guildId: newState.guild.id })
            if (!data) return

            db.findOne({ voiceChannel: oldState.channelId }, (err, res) => {
                if (!err && res) {
                    if (oldState.channelId !== data.channelId) {
                        if (oldState.channelId === res.voiceChannel) {
                            db.findOne({ voiceChannel: oldState.channelId }, (err, res) => {
                                if (err || !res) return;
                                if (res) {
                                    if (oldState.channelId === res.voiceChannel) {
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

            if (newState.channelId === data.channelId) {
                if (newState.channelId === data.channelId) {
                    db.findOne({ userId: newState.member.user.id }, (err, res) => {
                        if (res) {
                            const channel = client.guilds.cache.get(newState.guild.id).channels.cache.get(res.voiceChannel)
                            return newState.member.voice.setChannel(channel);
                        } else if (!res) {
                            client.guilds.cache.get(newState.guild.id).channels.create(`🔊｜${newState.member.user.username}'s channel`, {
                                type: 'GUILD_VOICE',
                                parent: data.categoryId,
                                permissionOverwrites: [
                                    {
                                        id: newState.guild.id,
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
                                    userId: newState.member.user.id,
                                    locked: false,
                                    muted: [],
                                    blacklisted: []
                                }).save()
                            })
                        }
                    })
                } else return;
            }
        }

    }
}