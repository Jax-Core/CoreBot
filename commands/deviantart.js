const { SlashCommandBuilder } = require('@discordjs/builders');
const fetch = require('cross-fetch');

module.exports = {
	data: new SlashCommandBuilder()
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
	async execute(interaction) {
		const skin = interaction.options.getString('skins')
		const req = `https://www.deviantart.com/jaxoriginals/art/${skin}`
		await fetch(req)
			.then(function(response) {
				if (response.status !== 200) {
					interaction.reply(
						`${skin}'s deviantart doesn't exist. \nIf you think this is a mistake, please contact the CoreStaff.`,
					)
				}
				else {
					interaction.reply(req)
				}
			})
			.catch(function(error) {
				interaction.reply(error)
			})
	},

};
