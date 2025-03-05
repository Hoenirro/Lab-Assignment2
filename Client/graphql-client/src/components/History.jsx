// components/Profile.jsx
import { React, useEffect } from "react";
import { useQuery, useMutation, gql } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext.jsx";
import "./Profile.css";

const GET_TOURNAMENTS = gql`
  query GetTournaments($playerId: ID!) {
    player(id: $playerId) {
      id
      ranking
      tournaments {
        id
        name
        status
      }
    }
  }
`;

function History() {
  const { user, playerId } = useAuth();
  const navigate = useNavigate();
  const { loading, error, data, refetch } = useQuery(GET_TOURNAMENTS, {
    variables: { playerId },
    skip: !user,
  });

  useEffect(() => {
    refetch();
  });
  if (!user) {
    navigate("/");
    return null;
  }

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  // Handle case where user data is null (e.g., deleted or invalid ID)
  if (!data.player) {
    return <p>User not found. It may have been deleted.</p>;
  }
  
  return (
    <div className="profile">
      <h3>History</h3>
      {data.player.tournaments && data.player.tournaments.length > 0 ? (
        <ul>
          {data.player.tournaments.map((tournament) => (
            <li key={tournament.id}>
              {tournament.name} - {tournament.status}
            </li>
          ))}
        </ul>
      ) : (
        <p>You haven't participated in any tournament yet.</p>
      )}
    </div>
  );
}

export default History;
