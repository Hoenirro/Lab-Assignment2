const typeDefs = `#graphql
  type User {
    id: ID!
    username: String!
    email: String!
    password: String!
    role: String!
  }

  type Player {
    id: ID!
    user: User
    ranking: Int!
    tournaments: [Tournament]!
  }

  type Tournament {
    id: ID!
    name: String!
    game: String!
    date: String!
    players: [Player]!
    status: String!
  }  

  type Query {
    user(id: ID!): User
    isLoggedIn: Boolean!
    tournaments: [Tournament!]
    tournament(id: ID!): Tournament    
    isPlayerInTournament(playerId: ID!, tournamentId: ID!): Boolean
    player(id: ID!): Player
    playerByUserId(userId: ID!): Player    
    playerByUsername(username: String!): [Player]
    players: [Player!]    
  }

  type Mutation {
    createUser(
    username: String!, 
    email: String!, 
    password: String!, 
    role: String!
    ): User

    login(
    email: String!, 
    password: String!
    ): User

    logOut: String

    updateUser(id: ID!, userName: String!, email: String!): User
    deleteUser(userId: ID!): String

    createTournament(
    name: String!, 
    game: String!, 
    date: String!, 
    status: String!
    ): Tournament

    joinTournament(
    playerId: ID!, 
    tournamentId: ID!
    ): Tournament

    removeFromTournament(
    playerId: ID!, 
    tournamentId: ID!
    ): Tournament    

    editTournament(
      tournamentId: ID!
      name: String
      game: String
      date: String
      status: String
    ): Tournament
  }
`;

export default typeDefs;