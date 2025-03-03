const typeDefs = `
  type User {
    id: ID!
    username: String!
    email: String!
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

  type AuthPayload {
    user: User!
    token: String!
  }

  type Query {
    user(id: ID!): User
    tournaments: [Tournament!]
    tournament(id: ID!): Tournament
    players: [Player!]
  }

  type Mutation {
    register(username: String!, email: String!, password: String!, role: String!): AuthPayload
    login(email: String!, password: String!): AuthPayload
    createTournament(name: String!, game: String!, date: String!, status: String!): Tournament
    joinTournament(playerId: ID!, tournamentId: ID!): Tournament
    removeFromTournament(playerId: ID!, tournamentId: ID!): Tournament
    deleteUser(userId: ID!): String
    editTournament(
      tournamentId: ID!
      name: String
      game: String
      date: String
      status: String
    ): Tournament
  }
`;

module.exports = typeDefs;
