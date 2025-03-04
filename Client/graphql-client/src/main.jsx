// import React from "react";
// import ReactDOM from "react-dom/client";
// import App from "./App.jsx";
// import "./index.css";
// import {
// 	ApolloClient,
// 	InMemoryCache,
// 	ApolloProvider,
// 	createHttpLink,
// } from "@apollo/client";
// import { setContext } from "@apollo/client/link/context";
// import { AuthProvider } from "./AuthContext.jsx";

// // Create an HTTP link
// const httpLink = createHttpLink({
// 	uri: "http://localhost:4000/graphql",
// });

// // Set up authentication context
// const authLink = setContext((_, { headers }) => {
// 	const token = localStorage.getItem("token");
// 	return {
// 		headers: {
// 			...headers,
// 			authorization: token ? `Bearer ${token}` : "",
// 		},
// 	};
// });

// // Initialize Apollo Client
// const client = new ApolloClient({
// 	link: authLink.concat(httpLink),
// 	cache: new InMemoryCache(),
// });

// ReactDOM.createRoot(document.getElementById("root")).render(
// 	<React.StrictMode>
// 		<ApolloProvider client={client}>
// 			<AuthProvider>
// 				<App />
// 			</AuthProvider>
// 		</ApolloProvider>
// 	</React.StrictMode>
// );


import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
//
import { ApolloClient, InMemoryCache, createHttpLink  } from '@apollo/client';
import { ApolloProvider } from '@apollo/client';
import { AuthProvider } from "./AuthContext.jsx";
//
const link = createHttpLink({
  uri: 'http://localhost:4000/graphql',
  credentials: 'include'
});
//
const client = new ApolloClient({
  cache: new InMemoryCache(),
  link,
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <ApolloProvider client={client}>
	<AuthProvider>
    <App/>
	</AuthProvider>
  </ApolloProvider>
)
