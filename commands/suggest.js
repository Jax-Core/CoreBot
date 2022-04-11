const { SlashCommandBuilder } = require('@discordjs/builders');

const { Client, Intents, MessageEmbed } = require('discord.js')
const client = new Client({ intents: [Intents.FLAGS.GUILDS] })
const { token } = require('../config.json')

const Keyv = require('keyv')
const keyv = new Keyv('sqlite://./core.sqlite')

const { makeid } = require('../functions/makeId')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('suggest')
		.setDescription('Make a suggestion.')
		.addStringOption((option) =>
			option
				.setName('suggestion')
				.setDescription('Enter the suggestion you wish.')
				.setRequired(true)),
	async execute(interaction) {
		// variables
		const suggestion = interaction.options.getString('suggestion')
		const suggestion_user = interaction.user.username + '#' + interaction.user.discriminator
		const suggestion_id = makeid(6)
		const suggestion_number = await keyv.get('suggestion_number')
		await keyv.set('suggestion_number', suggestion_number + 1)
		// embed
		const embed = new MessageEmbed()
			.setColor('#e75d29')
			.setTitle('Suggestion #' + suggestion_number)
			.setAuthor({ name: suggestion_user, iconURL: interaction.user.avatarURL() })
			.setDescription(suggestion)
			.setFooter({ text: 'Suggestion-ID: ' + suggestion_id });
		// send embed and message
		client.channels.cache.get('880983365581426708').send({ embeds: [embed] })
			.then(async function(message) {
				message.react('✅')
				message.react('❌')
				await keyv.set('suggestion_' + suggestion_id, message.id)
			})
		interaction.reply({ content: 'Your suggestion has been sent. \nSuggestion-ID: ' + suggestion_id, ephemeral: true })
	},
}
client.login(token)
