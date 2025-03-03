const typeDefs = `#graphql
  type Achievement {
    id: ID!
    playerId: String!
    title: String
    points: String
    earnedAt: String
    difficultyLevel: String
    isSecret: Boolean
  }

  type Query {
    achievements: [Achievement]
    achievement(id: ID!): Achievement
    achievementsByPlayer(playerId: String!): [Achievement]
  }

  type Mutation {
    createAchievement(
      playerId: String!
      title: String
      points: Int
      earnedAt: String
      difficultyLevel: String
      isSecret: Boolean
    ): Achievement
    
    updateAchievement(
      id: ID!
      playerId: String!
      title: String
      points: Int
      earnedAt: String
      difficultyLevel: String
      isSecret: Boolean
    ): Achievement
    
    deleteAchievement(id: ID!): Achievement
  }
`;

module.exports = typeDefs;
