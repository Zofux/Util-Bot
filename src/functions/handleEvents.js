module.exports = (client, player) => {
    client.handleEvents = async (eventFiles, path) => {
        for (const file of eventFiles) {
            const event = require(`../events/${file}`);
            if (event.once) {
                client.once(event.name, (...args) => event.execute(...args, client, player));
            } else {
                client.on(event.name, (...args) => event.execute(...args, client, player));
            }
        }
    };
}