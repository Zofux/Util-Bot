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
            require('./tickets/TicketOptions')(interaction, client)
        } else if (interaction.isSelectMenu()) {
            require('./menus/helpMenu')(interaction, client)
        }

       
    } 
}