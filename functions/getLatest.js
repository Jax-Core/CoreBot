const { ApolloClient, InMemoryCache, gql, HttpLink } = require('@apollo/client/core')
const fetch = require('cross-fetch')
const { gh_token } = require('../config.json')


const apollo = new ApolloClient({
	link: new HttpLink({ uri: 'https://api.github.com/graphql', fetch, headers: { Authorization: `bearer ${gh_token}` } }),
	cache: new InMemoryCache(),
})


async function getLatest() {
	const result = await apollo.query({
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
				` })
	const tag = result.data.repository.releases.nodes[0].tagName.substring(1);
	return tag
}

module.exports = { getLatest }