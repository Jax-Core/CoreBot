const { Client, Intents } = require('discord.js')
const { token, gh_token } = require('./config.json')
const fetch = require('cross-fetch')
const { ApolloClient, InMemoryCache, gql, HttpLink } = require('@apollo/client/core')
const cron = require('node-cron')
const Keyv = require('keyv')

const client = new Client({ intents: [Intents.FLAGS.GUILDS] })

const apollo = new ApolloClient({
	link: new HttpLink({ uri: 'https://api.github.com/graphql', fetch, headers: { Authorization: `bearer ${gh_token}` } }),
	cache: new InMemoryCache(),
})

const keyv = new Keyv('sqlite://./core.sqlite')

client.once('ready', async () => {
	console.log('Ready!')
	client.user.setActivity(await keyv.get('activity'))
})

cron.schedule('0 * * * *', () => {
	apollo.query({
		query: gql`
		query {
			repository(owner: "Jax-Core", name: "JaxCore") {
				releases(last: 1) {
					nodes {
						tagName
						}
					}
				}
			}
		`,
	})
		.then(result => {
			const v = result.data.repository.releases.nodes[0].tagName.substring(1)
			client.channels.cache.get('894595340622254171').setName('version ' + v)
		})
		.catch(error => {
			console.log(error)
		})
})


client.on('interactionCreate', async (interaction) => {
	if (!interaction.isCommand()) return

	const { commandName } = interaction

	if (commandName === 'module') {
		const string = interaction.options.getString('skins')
		const req = `https://api.github.com/repos/Jax-Core/${string}`
		await fetch(req)
			.then(function (response) {
				if (response.status !== 200) {
					interaction.reply(
						`${string}'s repo doesn't exist. \nIf you think this is a mistake, please contact the CoreStaff.`,
					)
				}
				else {
					response.json().then(function (data) {
						interaction.reply(data.html_url)
					})
				}
			})
			.catch(function (error) {
				interaction.reply(error)
			})
	}
	if (commandName === 'release') {
		const skin = interaction.options.getString('skins')
		const version = interaction.options.getString('version')

		if (version === null) {
			const req = `https://api.github.com/repos/Jax-Core/${skin}/releases/latest`
			await fetch(req)
				.then(function (response) {
					if (response.status !== 200) {
						interaction.reply(
							`${skin}'s latest release doesn't exist. \nIf you think this is a mistake, please contact the CoreStaff.`,
						)
					}
					else {
						response.json().then(function (data) {
							interaction.reply(data.html_url)
						})
					}
				})
				.catch(function (error) {
					interaction.reply(error)
				})
		}
		else {
			const req = `https://api.github.com/repos/Jax-Core/${skin}/releases/tags/${version}`
			await fetch(req)
				.then(function (response) {
					if (response.status !== 200) {
						interaction.reply(
							`${skin}'s release ${version} doesn't exist. \nIf you think this is a mistake, please contact the CoreStaff.`,
						)
					}
					else {
						response.json().then(function (data) {
							interaction.reply(data.html_url)
						})
					}
				})
				.catch(function (error) {
					interaction.reply(error)
				})
		}
	}
	if (commandName === 'deviantart') {
		const skin = interaction.options.getString('skins')
		const req = `https://www.deviantart.com/jaxoriginals/art/${skin}`
		await fetch(req)
			.then(function (response) {
				if (response.status !== 200) {
					interaction.reply(
						`${skin}'s deviantart doesn't exist. \nIf you think this is a mistake, please contact the CoreStaff.`,
					)
				}
				else {
					interaction.reply(req)
				}
			})
			.catch(function (error) {
				interaction.reply(error)
			})
	}
	if (commandName === 'rpc') {
		if (interaction.options.getString('status') === null) {
			interaction.reply('The current RPC status is: ' + await keyv.get('activity') + '.\nIt was set by ' + await keyv.get('activity_user') + '.')
		}
		else
			if (interaction.member.roles.cache.has('880455024348631081') || interaction.member.roles.cache.has('880450642588602479')) {
				const status = interaction.options.getString('status')
				await keyv.set('activity', status)
				client.user.setActivity(status)
				interaction.reply('Status set to ' + status + ' by ' + interaction.member.displayName + '.')
				await keyv.set('activity_user', interaction.member.displayName)
			}
			else {
				interaction.reply('You don\'t have permission to perform this action.')
			}
	}
},
)

client.login(token)
