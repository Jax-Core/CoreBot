const { SlashCommandBuilder } = require('@discordjs/builders');
const fetch = require('cross-fetch');

module.exports = {
	data: new SlashCommandBuilder()
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
	async execute(interaction) {
		const string = interaction.options.getString('skins')
		const req = `https://api.github.com/repos/Jax-Core/${string}`
		await fetch(req)
			.then(function(response) {
				if (response.status !== 200) {
					interaction.reply(
						`${string}'s repo doesn't exist. \nIf you think this is a mistake, please contact the CoreStaff.`,
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
	},
};
