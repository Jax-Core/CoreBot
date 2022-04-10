const { SlashCommandBuilder } = require('@discordjs/builders');
const fetch = require('cross-fetch');

module.exports = {
	data: new SlashCommandBuilder()
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
	async execute(interaction) {
		const skin = interaction.options.getString('skins')
		const version = interaction.options.getString('version')

		if (version === null) {
			const req = `https://api.github.com/repos/Jax-Core/${skin}/releases/latest`
			await fetch(req)
				.then(function(response) {
					if (response.status !== 200) {
						interaction.reply(
							`${skin}'s latest release doesn't exist. \nIf you think this is a mistake, please contact the CoreStaff.`,
						)
					}
					else {
						response.json().then(function(data) {
							interaction.reply(data.html_url)
						})
					}
				})
				.catch(function(error) {
					interaction.reply(error)
				})
		}
		else {
			const req = `https://api.github.com/repos/Jax-Core/${skin}/releases/tags/${version}`
			await fetch(req)
				.then(function(response) {
					if (response.status !== 200) {
						interaction.reply(
							`${skin}'s release ${version} doesn't exist. \nIf you think this is a mistake, please contact the CoreStaff.`,
						)
					}
					else {
						response.json().then(function(data) {
							interaction.reply(data.html_url)
						})
					}
				})
				.catch(function(error) {
					interaction.reply(error)
				})
		}
	},
};
