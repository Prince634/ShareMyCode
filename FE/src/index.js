import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App.css';
import { BrowserRouter } from 'react-router-dom'
import Routes from './routes.js'
import { ApolloProvider } from 'react-apollo'
import { ApolloClient } from 'apollo-client'
import { createHttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import gql from 'graphql-tag'

import { split } from 'apollo-link'
import { WebSocketLink } from 'apollo-link-ws'
import { getMainDefinition } from 'apollo-utilities'

let client_typedefs = gql`
	extend type Query{

		adminUser: String!
	}

	extend type launchDemo{
		mainUser: String!
	}

`

const httpLink = new createHttpLink({
	uri: 'http://localhost:4000'
})

const wsLink = new WebSocketLink({
  uri: `ws://localhost:4000`,
  options: {
    reconnect: true
  }
})

const link = split(
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query)
    return kind === 'OperationDefinition' && operation === 'subscription'
  },
  wsLink,
  httpLink
)


let cache = new InMemoryCache() 
const client = new ApolloClient({
	link,
	cache,
	typeDefs: client_typedefs,
	resolvers:{

		query:{
			launchDemo:{
				mainUser: ()=>{
					return "Prince, King in the North"
				}
			}
		}
	}
})

cache.writeData({
	data: {
		adminUser: "Prince"
	}
})

// client.query({
// 	query:gql`{
// 		launchDemo{
// 			name
// 			mainUser @client
// 		}
// 	}
// 	`
// }).then((resp)=>{
// 	console.log('result of query is', resp);
// }).catch((e)=>{
// 	console.log('Error is', e);
// })

ReactDOM.render(
  <ApolloProvider client={client}>
  	<BrowserRouter>
		<Routes />
	</BrowserRouter>
  </ApolloProvider>,
  document.getElementById('root')
);

