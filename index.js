const { Client, Intents } = require('discord.js')
const fetch = require('node-fetch')
const { token } = require('./config.json')

const client = new Client({ intents: [Intents.FLAGS.GUILDS] })

client.once('ready', () => {
	console.log('Ready!')
})

client.on('interactionCreate', async (interaction) => {
	if (!interaction.isCommand()) return

	const { commandName } = interaction

	if (commandName === 'module') {
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
	}
	if (commandName === 'release') {
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
	}
	if (commandName === 'deviantart') {
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
	}
},
)

client.login(token)
