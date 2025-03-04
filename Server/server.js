// server.js is the entry point for the GraphQL server.
// It connects to MongoDB, creates an Apollo Server, and starts
// the server on port 4000.
import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import connectToDatabase from "./config/mongoose.js";
import typeDefs from "./graphql/typeDefs.js";
import userResolvers from "./resolvers/user.resolvers.js";
import playerResolvers from "./resolvers/player.resolvers.js";
import tournamentResolvers from "./resolvers/tournament.resolvers.js";

// Set the 'NODE_ENV' variable programmatically
process.env.NODE_ENV = process.env.NODE_ENV || 'development';
console.log(`Running in ${process.env.NODE_ENV} mode`);

// Initialize Mongoose
connectToDatabase();

const resolvers = {
	Query: {
	  ...userResolvers.Query,
	  ...playerResolvers.Query,
	  ...tournamentResolvers.Query,
	},
	Mutation: {
	  ...userResolvers.Mutation,
	  ...tournamentResolvers.Mutation,
	},
  };
// Initialize Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// Start the Apollo Server
await server.start();

// Initialize Express
const app = express();

// Middleware to parse cookies
app.use(cookieParser());

// CORS configuration
const corsOptions = {
  origin: 'http://localhost:3000', // React app's origin
  credentials: true,              // Allow credentials (cookies, authorization headers, etc.)
};
app.use(cors(corsOptions));

// Middleware to handle JSON bodies
app.use(bodyParser.json());

// Middleware to handle URL-encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));

// JWT authentication middleware
app.use((req, res, next) => {
  const token = req.cookies.token;
  if (token) {
    try {
	  const JWT_SECRET = process.env.JWT_SECRET;
      const user = jwt.verify(token, JWT_SECRET);
      req.user = user;
    } catch (err) {
      console.error('JWT verification failed:', err.message);
      req.user = null;
    }
  }
  next();
});

// Apply Apollo Server middleware to Express
app.use(
  '/graphql',
  expressMiddleware(server, {
    context: async ({ req, res }) => ({ req, res, user: req.user }),
  })
);

// Start the server
const PORT = 4000;
app.listen(PORT, () => {
  console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`);
});
