const { Client, Intents, MessageEmbed } = require('discord.js')
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

function makeid(length) {
	let result = '';
	const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	const charactersLength = characters.length;
	for (let i = 0; i < length; i++) {
		result += characters.charAt(Math.floor(Math.random() *
charactersLength));
	}
	return result;
}

function isStaff(member) {
	return member.roles.cache.has('880455024348631081') || member.roles.cache.has('880450642588602479')
}

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

	console.log(interaction.user.username + '#' + interaction.user.discriminator + ' used ' + commandName)

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
	if (commandName === 'rpc') {
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
	}
	if (commandName === 'suggest') {
		// variables
		const suggestion = interaction.options.getString('suggestion')
		const suggestion_user = interaction.user.username + '#' + interaction.user.discriminator
		const suggestion_id = makeid(6)
		const suggestion_number = await keyv.get('suggestion_number')
		await keyv.set('suggestion_number', suggestion_number + 1)
		console.log(suggestion + ' ' + suggestion_id + ' ' + suggestion_user)
		// embed
		const embed = new MessageEmbed()
			.setColor('#e75d29')
			.setTitle('Suggestion #' + suggestion_number)
			.setAuthor({ name: suggestion_user, iconURL: interaction.user.avatarURL() })
			.setDescription(suggestion)
			.setFooter({ text: 'Suggestion-ID: ' + suggestion_id });
		// send embed and message
		client.channels.cache.get('962092418709217321').send({ embeds: [embed] })
			.then(async function(message) {
				message.react('✅')
				message.react('❌')
				await keyv.set('suggestion_' + suggestion_id, message.id)
			})
		interaction.reply('Your suggestion has been sent. \nSuggestion-ID: ' + suggestion_id)
	}
},
)

client.login(token)
