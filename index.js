const { Client, Intents, Collection } = require('discord.js')
const client = new Client({ intents: [Intents.FLAGS.GUILDS] })
const { token, db_connection } = require('./config.json')

const fs = require('fs')
client.commands = new Collection()
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

const Keyv = require('keyv')
const keyv = new Keyv(db_connection)

const { getLatest } = require('./functions/getLatest')


for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.data.name, command);
}

client.once('ready', async () => {
	console.log('Ready!')
	client.user.setActivity(await keyv.get('activity'))
	const v = await getLatest()
	await client.channels.cache.get('894595340622254171').setName('version v' + v)
})

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction);
	}
	catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});


client.login(token)
