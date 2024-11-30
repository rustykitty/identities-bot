"use strict";

BigInt.prototype.toJSON = function () { return this.toString() }

const Discord = require('discord.js');
const { ApplicationCommandOptionType, Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');

const { REST, Routes } = require("discord.js");

require("dotenv").config();

const client = new Client({
    intents: GatewayIntentBits.Guilds
});

const data = require('./data');

function lookup(guildId, userId) {
    identities = data.get(guildId);
    return identities in userId ? identities[userId] : null;
}

const commands = [
    {
        name: "ping",
        description: "Test latency of the bot"
    },
    {
        name: "whois",
        description: "Get the identity of a user",
        options: [
            {
                name: "user",
                description: "The user to get the identity of",
                type: ApplicationCommandOptionType.User, 
                required: true
            }
        ]
    },
    {
        name: "clear-cache",
        description: "Clear the identities file cache for this server",
        default_member_permissions: Discord.PermissionFlagsBits.Administrator
    },
    {
        name: "add-user",
        description: "Add user to identities file and refresh cache",
        options: [
            {
                name: "user",
                description: "The user to get the identity of",
                type: ApplicationCommandOptionType.User, 
                required: true
            },
            {
                name: "identity",
                description: "The identity of the user",
                type: ApplicationCommandOptionType.String,
                min_length: 1,
                max_length: 127
            },
        ],
        default_member_permissions: Discord.PermissionFlagsBits.Administrator
    },
];

for (const command of commands) {
    command.dm_permission = false;
}

const rest = new REST().setToken(process.env.DISCORD_TOKEN);

try {
    console.log("Started refreshing application (/) commands.");

    rest.put(
        Routes.applicationCommands(process.env.CLIENT_ID), 
        { body: commands, }
    );

    console.log("Successfully reloaded application (/) commands.");
} catch (error) {
    console.error(error);
}

client.once('ready', async () => {
    console.log('Bot is good to go!');
})

client.on("interactionCreate", async (interaction) => {
    if (interaction.isCommand()) {
        if (interaction.commandName === "ping") {
            await interaction.deferReply({ ephemeral: true });
            const ping = Date.now() - interaction.createdTimestamp;
            await interaction.editReply(`Pong! Latency: ${ping}ms`);
        } else if (interaction.commandName === "whois") {
            await interaction.deferReply({ ephemeral: true });
            let user = interaction.options.getUser('user');
            let person = lookup(interaction.guildId, user.id);
            let embed;
            if (person == null) {
                embed = new EmbedBuilder()
                .setDescription('User not found');
            } else {
                embed = new EmbedBuilder()
                .setDescription(person[0]);
            }
            await interaction.editReply({ embeds: [ embed ] });
        } else if (interaction.commandName === "clear-cache") {
            await interaction.deferReply({ ephemeral: true });
            data.delete(interaction.guildId);
            await interaction.editReply('Cache succesfully cleared.');
        } else if (interaction.commandName === "add-user") {
            await interaction.deferReply({ ephemeral: true });
            data.setKey(interaction.options.getUser('user'), interaction.options.getString('identity'));
            await interaction.editReply('Success!');
        }
         else {
            const embed = new EmbedBuilder()
            .setTitle('Error')
            .setDescription(`No commands matched the requested command of ${interaction.commandName}. Please report this to <@971226149659246632>. Thanks!`)
            .setColor(Discord.Colors.Red);
            interaction.reply({ embeds: [ embed ] });
        }
    }
});


client.login(process.env.DISCORD_TOKEN);