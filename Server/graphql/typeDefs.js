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

  type AuthPayload {
    user: User!
    token: String!
  }

  type Query {
    user(id: ID!): User
    isLoggedIn: Boolean!
    tournaments: [Tournament!]
    tournament(id: ID!): Tournament
    player(id: ID!): Player
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

// const typeDefs = `#graphql
//   type Achievement {
//     id: ID!
//     playerId: String!
//     title: String
//     points: String
//     earnedAt: String
//     difficultyLevel: String
//     isSecret: Boolean
//   }

//   type Query {
//     achievements: [Achievement]
//     achievement(id: ID!): Achievement
//     achievementsByPlayer(playerId: String!): [Achievement]
//   }

//   type Mutation {
//     createAchievement(
//       playerId: String!
//       title: String
//       points: Int
//       earnedAt: String
//       difficultyLevel: String
//       isSecret: Boolean
//     ): Achievement

//     updateAchievement(
//       id: ID!
//       playerId: String!
//       title: String
//       points: Int
//       earnedAt: String
//       difficultyLevel: String
//       isSecret: Boolean
//     ): Achievement

//     deleteAchievement(id: ID!): Achievement
//   }
// `;

// module.exports = typeDefs;
