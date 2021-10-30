module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
        client.user.setActivity(`on Cactus Craft`, { type: "PLAYING" })
        console.log("Ready!")

        await require('./intervals/mutes')(client)
        await require('./intervals/autos')(client)
    }
}