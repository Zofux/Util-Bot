module.exports = {
    name: 'interactionCreate',
    async execute(interaction, client, player) {
        if (interaction.isCommand()) {
            const command = client.commands.get(interaction.commandName);

            if (!command) return;
    
            try {
                await command.execute(interaction, client)
            } catch (error) {
                console.error(error);
                await interaction.reply({
                    content: 'There was an error while executing this command!',
                    ephemeral: true
                })
            }
        } else if (interaction.isButton()) {
            if (interaction.customId.includes("-ticket")) {
                await require("./buttons/tickets")(interaction, client)
            } else if (interaction.customId.includes("-close")) {
                await require("./buttons/close")(interaction, client)
            }
        }

       
    } 
}