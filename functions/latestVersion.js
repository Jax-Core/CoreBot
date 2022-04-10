const {
	ApolloClient,
	InMemoryCache,
	gql,
	HttpLink,
} = require("@apollo/client/core");
const { resultKeyNameFromField } = require("@apollo/client/utilities");
const fetch = require("cross-fetch");
const { gh_token } = require("../config.json");

const apollo = new ApolloClient({
	link: new HttpLink({
		uri: "https://api.github.com/graphql",
		fetch,
		headers: { Authorization: `bearer ${gh_token}` },
	}),
	cache: new InMemoryCache(),
});

module.exports = {
	fetch: async () => {
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
					`})
		const tag = result.data.repository.releases.nodes[0].tagName;
		return tag;
	},
};