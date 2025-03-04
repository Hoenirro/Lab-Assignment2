// components/Profile.jsx
import React from "react";
import { useQuery, gql } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext.jsx";
import "./Profile.css";

const GET_PLAYERS = gql`
  query GetPlayers {
    players {
      id
      ranking
      user {
        id
        username
      }
    }
  }
`;

function Players() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const isAllowed = !user || !user.role !== "admin";
  const { loading, error, data } = useQuery(GET_PLAYERS, {
    skip: !isAllowed,
  });

  if (!isAllowed) {
    navigate("/");
    return null;
  }
  console.log(data)

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

return (
    <div className="profile">
        <h3>Players</h3>

        {data ? (
            <table className="players-table">
                <thead>
                    <tr>
                        <th>Username</th>
                        <th>Ranking</th>
                    </tr>
                </thead>
                <tbody>
                    {data.players.map((player) => (
                        <tr key={player.id}>
                            <td>{player.user ? player.user.username : "User Removed"}</td>
                            <td>{player.ranking}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        ) : (
            <p>No players found.</p>
        )}
    </div>
);
}

export default Players;
