const Discord = require('discord.js')
const { createTranscript } = require('discord-html-transcripts')
const ticketTools = require('../../models/ticketTools')
const config = require('../../../config.json')

module.exports = async (interaction, client) => {
    if (interaction.customId === "ticket") {
        const data = await ticketTools.findOne({ messageId: interaction.message.id })
        if (!data) {
            const embed = new Discord.MessageEmbed()
                .setDescription(`${config.crossEmoji} This ticket tool doesn't have any database information anymore, and therefore doesn't work`)
                .setColor(config.ErrorHexColor)
                .setAuthor(interaction.user.username, interaction.user.displayAvatarURL())
                .setFooter(interaction.guild.name)
                .setTimestamp()
            return await interaction.reply({ embeds: [embed], ephemeral: true })
        }

        const array = await data.tickets.filter(o => o.userId === interaction.user.id && o.Closed === false)
        if (array[0]) {
            const embed = new Discord.MessageEmbed()
                .setDescription(`${config.crossEmoji} You already have an active ticket`)
                .setColor(config.ErrorHexColor)
                .setAuthor(interaction.user.username, interaction.user.displayAvatarURL())
                .setFooter(interaction.guild.name)
                .setTimestamp()
            return await interaction.reply({ embeds: [embed], ephemeral: true })
        }

        const id = Math.floor(Math.random() * 90000) + 10000;

        client.guilds.cache.get(interaction.guild.id).channels.create(`ticket-${id}`, {
            type: 'GUILD_TEXT',
            parent: data.categoryId,
            permissionOverwrites: [
                {
                    id: interaction.guild.id,
                    deny: ["VIEW_CHANNEL"],
                    allow: ["SEND_MESSAGES"]
                },
                {
                    id: interaction.user.id,
                    allow: ["VIEW_CHANNEL", "READ_MESSAGE_HISTORY"],
                },
                {
                    id: config.ticketModeratorRole,
                    allow: ["VIEW_CHANNEL", "READ_MESSAGE_HISTORY"],
                }
            ]
        }).then(async channel => {
            await ticketTools.findOneAndUpdate(
                { messageId: interaction.message.id },
                {
                    $push: { tickets: { userId: interaction.user.id, channelId: channel.id, ticketId: id, Locked: false, Closed: false } }
                },
                {
                    new: true,
                    upsert: true
                }
            ).then(async () => {
                const embed = new Discord.MessageEmbed()
                    .setAuthor(`${interaction.guild.name} | Ticket: ${id}`, interaction.guild.iconURL())
                    .setDescription(`Please wait patiently for a response from the Staff team, in the mean while, describe your issue in as much detail as possible`)
                    .setColor(config.MainHexColor)
                    .setFooter(`Made by Zofux`)

                const Button = new Discord.MessageActionRow()
                    .addComponents(
                        new Discord.MessageButton()
                            .setCustomId("close")
                            .setLabel("Save & Close Ticket")
                            .setEmoji("💾")
                            .setStyle("PRIMARY")
                    )
                    .addComponents(
                        new Discord.MessageButton()
                            .setCustomId("lock_unlock")
                            .setLabel("Lock/unlock")
                            .setEmoji("🔒")
                            .setStyle("SECONDARY")
                    )

                channel.send({ embeds: [embed], components: [Button] }).then(async () => {
                    await channel.send({ content: `<@${interaction.user.id}> here is your ticket!` }).then(m => setTimeout(() => { m.delete() }, 1 * 5000))

                    const successEmbed = new Discord.MessageEmbed()
                        .setDescription(`${config.checkEmoji} <@${interaction.user.id}> your ticket has been created: <#${channel.id}>`)
                        .setColor(config.SuccessHexColor)
                        .setAuthor(interaction.user.username, interaction.user.displayAvatarURL())
                        .setFooter("Created by Zofux")
                        .setTimestamp()
                    await interaction.reply({ embeds: [successEmbed], ephemeral: true })
                })
            })
        })
    } else if (interaction.customId === "close") {
        if (!interaction.member.permissions.has(Discord.Permissions.FLAGS.MANAGE_GUILD)) {
            const embed = new Discord.MessageEmbed()
                .setDescription(`${config.crossEmoji} Ticket buttons are for staff only use, needs the \`MANAGE_GUILD\` permission`)
                .setColor(config.ErrorHexColor)
                .setAuthor(interaction.user.username, interaction.user.displayAvatarURL())
                .setFooter("Created by Zofux")
                .setTimestamp()
            return interaction.reply({ embeds: [embed], ephemeral: true })
        }

        const data = await ticketTools.findOne({ categoryId: interaction.channel.parentId, "tickets.channelId": interaction.channel.id })
        if (!data) {
            const embed = new Discord.MessageEmbed()
                .setDescription(`${config.crossEmoji} This ticket doesn't have any database information anymore, and therefore doesn't work`)
                .setColor(config.ErrorHexColor)
                .setAuthor(interaction.user.username, interaction.user.displayAvatarURL())
                .setFooter("Created by Zofux")
                .setTimestamp()
            await interaction.reply({ embeds: [embed], ephemeral: true })
        } else if (data) {
            const array = await data.tickets.filter(o => o.channelId === interaction.channel.id)
            if (data.tickets.Closed == true) {
                const embed = new Discord.MessageEmbed()
                    .setDescription(`${config.crossEmoji} This ticket is already closed`)
                    .setColor(config.ErrorHexColor)
                    .setAuthor(interaction.user.username, interaction.user.displayAvatarURL())
                    .setFooter("Created by Zofux")
                    .setTimestamp()
                interaction.reply({ embeds: [embed] })
            } else {
                const attachment = await createTranscript(interaction.channel, {
                    limit: -1,
                    returnBuffer: false,
                    fileName: `ticket-${array[0].ticketId}.html`
                })
                await ticketTools.findOneAndUpdate(
                    { categoryId: interaction.channel.parentId, "tickets.channelId": interaction.channel.id },
                    {
                        $set: { "tickets.$.Closed": true }
                    },
                )

                const embed = new Discord.MessageEmbed()
                    .setDescription(`Transcript Type: **Ticket**\nID: ${array[0].ticketId}`)
                    .setColor(config.MainHexColor)
                    .setAuthor("Ticket | Transcript")
                    .setFooter("Created by Zofux")
                    .setTimestamp()

                const Message = await interaction.guild.channels.cache.get(data.transcriptChannelId).send({ embeds: [embed], files: [attachment] })

                const successEmbed = new Discord.MessageEmbed()
                    .setDescription(`The transcript is now saved [TRANSCRIPT](${Message.url})`)
                    .setColor(config.MainHexColor)
                    .setAuthor("Ticket | Closed")
                    .setFooter("Created by Zofux")
                    .setTimestamp()
                interaction.reply({ embeds: [successEmbed] })

                setTimeout(() => {
                    interaction.channel.delete();
                }, 10 * 1000)
            }
        }
    } else if (interaction.customId === "lock_unlock") {
        const data = await ticketTools.findOne({ categoryId: interaction.channel.parentId, "tickets.channelId": interaction.channel.id })

        if (!data) {

            const embed = new Discord.MessageEmbed()
                .setDescription(`${config.crossEmoji} This ticket doesn't have any database information anymore, and therefore doesn't work`)
                .setColor(config.ErrorHexColor)
                .setAuthor(interaction.user.username, interaction.user.displayAvatarURL())
                .setFooter("Created by Zofux")
                .setTimestamp()
            await interaction.reply({ embeds: [embed], ephemeral: true })
        } else if (data) {


            const array = await data.tickets.filter(o => o.channelId === interaction.channel.id)

            if (array[0].Locked === false) {

                interaction.channel.permissionOverwrites.edit(interaction.guild.id, { SEND_MESSAGES: false }).then(async () => {
                    const embed = new Discord.MessageEmbed()
                        .setDescription(`<@${interaction.user.id}> has locked the ticket`)
                        .setColor(config.MainHexColor)
                        .setAuthor("Ticket | Locked")
                        .setFooter("Created by Zofux")
                        .setTimestamp()
                    await interaction.reply({ embeds: [embed] })

                    await ticketTools.findOneAndUpdate(
                        { categoryId: interaction.channel.parentId, "tickets.channelId": interaction.channel.id },
                        {
                            $set: { "tickets.$.Locked": true }
                        },
                    )
                })
            }
            if (array[0].Locked === true) {

                interaction.channel.permissionOverwrites.edit(interaction.guild.id, { SEND_MESSAGES: true }).then(async () => {
                    const embed = new Discord.MessageEmbed()
                        .setDescription(`<@${interaction.user.id}> has unlocked the ticket`)
                        .setColor(config.MainHexColor)
                        .setAuthor("Ticket | Unlocked")
                        .setFooter("Created by Zofux")
                        .setTimestamp()
                    await interaction.reply({ embeds: [embed] })

                    await ticketTools.findOneAndUpdate(
                        { categoryId: interaction.channel.parentId, "tickets.channelId": interaction.channel.id },
                        {
                            $set: { "tickets.$.Locked": false }
                        },
                    )
                })
            }
        }

    }



}