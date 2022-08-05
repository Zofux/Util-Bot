const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js')
const config = require(`../../../config.json`)

module.exports = {
    data: new SlashCommandBuilder()
        .setName(`slowmode`)
        .setDescription(`change the slowmode in a channel`)
        .addChannelOption(option =>
            option.setName(`channel`).setDescription(`The channel the slowmode should get changed in`).setRequired(true))
        .addNumberOption(option =>
            option.setName(`slowmode`).setDescription(`The new slowmode (in seconds)`).setRequired(true)),
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true })

        if (!config.log) {
            const embed = new Discord.MessageEmbed()
                .setAuthor(`No verify channel`)
                .setDescription(`${config.crossEmoji} I currently have no valid value for the \`log\` in my \`config.json\``)
                .addField("Valid format (in the config.json)", "```log: \"#ID of the Text channel\"```")
                .setColor(config.ErrorHexColor)
                .setFooter(`Made by Zofux`)
            return interaction.editReply({ embeds: [embed], ephemeral: true })
        } else if (config.log) {
            const logChannel = interaction.guild.channels.cache.get(config.log)
            if (!logChannel) {
                const embed = new Discord.MessageEmbed()
                    .setAuthor(`No log channel`)
                    .setDescription(`${config.crossEmoji} The given \`log\` in my \`config.json\` is not a channel in this server`)
                    .addField("Valid format (in the config.json)", "```log: \"#ID of the Text channel\"```")
                    .setColor(config.ErrorHexColor)
                    .setFooter(`Made by Zofux`)
                return interaction.editReply({ embeds: [embed], ephemeral: true })
            }
        }

        const rawTime = interaction.options.getNumber(`slowmode`)
        const channel = interaction.options.getChannel(`channel`)

        if (channel.type !== "GUILD_TEXT") {
            const embed = new Discord.MessageEmbed()
                .setAuthor(`No log channel`)
                .setDescription(`${config.crossEmoji} Im afraid the channel needs to be a text channel`)
                .setColor(config.ErrorHexColor)
                .setFooter(`Made by Zofux`)
            return interaction.editReply({ embeds: [embed], ephemeral: true })
        } else if (channel.type === "GUILD_TEXT") {

            if (!interaction.member.permissions.has(Discord.Permissions.FLAGS.MANAGE_CHANNELS)) {
                const embed = new Discord.MessageEmbed()
                    .setDescription(`${config.crossEmoji} You can't use this command`)
                    .setColor(config.ErrorHexColor)
                    .setAuthor(interaction.user.username, interaction.user.displayAvatarURL())
                    .setFooter(interaction.guild.name)
                    .setTimestamp()
                return interaction.editReply({ embeds: [embed], ephemeral: true })
            }

            if (rawTime > 86400 || rawTime < 0) {
                const embed = new Discord.MessageEmbed()
                    .setAuthor(`No log channel`)
                    .setDescription(`${config.crossEmoji} Can only set the slowmode between 0 and 6 hours`)
                    .setColor(config.ErrorHexColor)
                    .setFooter(`Made by Zofux`)
                return interaction.editReply({ embeds: [embed], ephemeral: true })
            }

            await channel.setRateLimitPerUser(time).then(async () => {
                const logChannel = interaction.guild.channels.cache.get(config.log)
                const logEmbed = new Discord.MessageEmbed()
                    .setColor(config.MainHexColor)
                    .addFields([
                        { name: 'Channel', value: `<#${channel.id}>`, inline: true },
                        { name: 'New slowmode', value: `\`${rawTime}\` seconds` },
                        { name: 'Moderator', value: `${interaction.user.username}#${interaction.user.discriminator}`, inline: true },
                    ])
                    .setAuthor(`Slowmode | ${interaction.user.username}#${interaction.user.discriminator}`)
                    .setFooter(interaction.guild.name)
                    .setTimestamp()
                logChannel.send({ embeds: [logEmbed] });

                const embed = new Discord.MessageEmbed()
                    .setDescription(`${config.checkEmoji} Successfully set the slowmode in <#${channel.id}> to **${rawTime}** seconds`)
                    .setColor(config.SuccessHexColor)
                    .setAuthor(interaction.user.username, interaction.user.displayAvatarURL())
                    .setFooter("Made by Zofux")
                    .setTimestamp()
                await interaction.reply({ embeds: [embed] })
            });
        }

    }
}