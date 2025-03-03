// server.js is the entry point for the GraphQL server.
// It connects to MongoDB, creates an Apollo Server, and starts
// the server on port 4000.
import dotenv from "dotenv";
dotenv.config(); // Load environment variables
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import connectToDatabase from "./config/mongoose.js";
import typeDefs from "./graphql/tournamentTypeDefs.js";
import resolvers from "./graphql/tournamentResolvers.js";

// Initialize the application
const startServer = async () => {
	// Step 1: Connect to MongoDB
	await connectToDatabase();

	// Step 2: Create Apollo Server
	const server = new ApolloServer({
		typeDefs,
		resolvers,
	});

	// Step 3: Start Apollo Server
	const { url } = await startStandaloneServer(server, {
		listen: { port: 4000 },
	});

	console.log(`🚀 GraphQL server ready at ${url}`);
};

// Start the server
startServer();
