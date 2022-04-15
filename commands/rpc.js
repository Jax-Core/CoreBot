const { SlashCommandBuilder } = require('@discordjs/builders');

const { Client, Intents } = require('discord.js')
const client = new Client({ intents: [Intents.FLAGS.GUILDS] })
const { token, db_connection } = require('../config.json')


const Keyv = require('keyv')
const keyv = new Keyv(db_connection)

function isStaff(member) {
	return member.roles.cache.has('880455024348631081') || member.roles.cache.has('880450642588602479')
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('rpc')
		.setDescription('Changes the bot\'s status.')
		.addStringOption((option) =>
			option
				.setName('status')
				.setDescription('Enter the status you wish.')
				.setRequired(false)),
	async execute(interaction) {
		if (interaction.options.getString('status') === null) {
			interaction.reply('The current RPC status is: ' + await keyv.get('activity') + '.\nIt was set by ' + await keyv.get('activity_user') + '.')
		}
		else
		if (isStaff(interaction.member)) {
			const status = interaction.options.getString('status')
			await keyv.set('activity', status)
			client.user.setActivity(status)
			interaction.reply('Status set to ' + status + ' by ' + interaction.member.displayName + '.')
			await keyv.set('activity_user', interaction.member.displayName)
		}
		else {
			interaction.reply('You don\'t have permission to perform this action.')
		}
	},
};

client.login(token)
