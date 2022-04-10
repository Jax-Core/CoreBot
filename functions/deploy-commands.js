const { SlashCommandBuilder } = require('@discordjs/builders')
const { REST } = require('@discordjs/rest')
const { Routes } = require('discord-api-types/v9')
const { clientId, guildId, token } = require('../config.json')

const commands = [
	new SlashCommandBuilder()
		.setName('module')
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
				.addChoice('YourMixer', 'YourMixer')),
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
				.addChoice('YourMixer', 'YourMixer'))
		.addStringOption((option) =>
			option
				.setName('version')
				.setDescription('Enter the version of the skin you wish.')),
	new SlashCommandBuilder()
		.setName('deviantart')
		.setDescription('Sends a link to the Skin\'s Deviant Art page.')
		.addStringOption((option) =>
			option
				.setName('skins')
				.setDescription('All JaxCore skins.')
				.setRequired(true)
				.addChoice('IdleStyle', 'IdleStyle.L=899004964')
				.addChoice('Keylaunch', 'Keylaunch.L=890749449')
				.addChoice('Keystrokes', 'Keystrokes.L=889349339')
				.addChoice('MIUI-Shade', 'MIUI-Shade.L=885183361')
				.addChoice('ModularClocks', 'ModularClocks.L=883898019')
				.addChoice('ModularPlayers', 'ModularPlayers.L=886577256')
				.addChoice('ModularVisualizer', 'ModularVisualizer.L=903806619')
				.addChoice('Plainext', 'Plainext.L=881628513')
				.addChoice('QuickNote', 'QuickNote.L=894951390')
				.addChoice('ValliStart', 'ValliStart.L=893506095')
				.addChoice('YourMixer', 'YourMixer.L=905969076')),
	new SlashCommandBuilder()
		.setName('rpc')
		.setDescription('Changes the bot\'s status.')
		.addStringOption((option) =>
			option
				.setName('status')
				.setDescription('Enter the status you wish.')
				.setRequired(false)),
].map((command) => command.toJSON())

const rest = new REST({ version: '9' }).setToken(token)

rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
	.then(() => console.log('Successfully registered application commands.'))
	.catch(console.error)
