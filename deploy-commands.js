const { SlashCommandBuilder } = require('@discordjs/builders')
const { REST } = require('@discordjs/rest')
const { Routes } = require('discord-api-types/v9')
const { clientId, guildId, token } = require('./config.json')

const commands = [
	new SlashCommandBuilder()
		.setName('skin')
		.setDescription('Sends a link to the Skin repo.')
		.addStringOption((option) =>
			option
				.setName('skins')
				.setDescription('All JaxCore skins.')
				.setRequired(true)
				.addChoice('IdleStyle', 'IdleStyle')
				.addChoice('Keylaunch', 'Keylaunch')
				.addChoice('Keystrokes', 'Keystrokes')
				.addChoice('MIUI-Shade', 'MIUI-Shade')
				.addChoice('ModularClocks', 'ModularClocks')
				.addChoice('ModularPlayers', 'ModularPlayers')
				.addChoice('ModularVisualizer', 'ModularVisualizer')
				.addChoice('Plainext', 'Plainext')
				.addChoice('QuickNote', 'QuickNote')
				.addChoice('ValliStart', 'ValliStart')
				.addChoice('YourFlyouts', 'YourFlyouts')),
	new SlashCommandBuilder()
		.setName('release')
		.setDescription('Sends a link to a release that you wish.')
		.addStringOption((option) =>
			option
				.setName('skins')
				.setDescription('All JaxCore skins.')
				.setRequired(true)
				.addChoice('IdleStyle', 'IdleStyle')
				.addChoice('Keylaunch', 'Keylaunch')
				.addChoice('Keystrokes', 'Keystrokes')
				.addChoice('MIUI-Shade', 'MIUI-Shade')
				.addChoice('ModularClocks', 'ModularClocks')
				.addChoice('ModularPlayers', 'ModularPlayers')
				.addChoice('ModularVisualizer', 'ModularVisualizer')
				.addChoice('Plainext', 'Plainext')
				.addChoice('QuickNote', 'QuickNote')
				.addChoice('ValliStart', 'ValliStart')
				.addChoice('YourFlyouts', 'YourFlyouts'))
		.addStringOption((option) =>
			option
				.setName('version')
				.setDescription('Enter the version of the skin you wish.')),
].map((command) => command.toJSON())

const rest = new REST({ version: '9' }).setToken(token)

rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
	.then(() => console.log('Successfully registered application commands.'))
	.catch(console.error)
