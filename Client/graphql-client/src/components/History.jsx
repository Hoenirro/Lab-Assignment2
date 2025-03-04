// components/Profile.jsx
import React from "react";
import { useQuery, useMutation, gql } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext.jsx";
import "./Profile.css";

const GET_TOURNAMENTS = gql`
	query GetTournaments($userId: ID!) {
		player(id: $userId) {
			id
			ranking			
		}	
        tournaments {
            id
            name
            status
        }		
	}
`;

function History() {
	const { user, logout } = useAuth();
	const navigate = useNavigate();
	const { loading, error, data } = useQuery(GET_TOURNAMENTS, {
		variables: { userId: user.id },
		skip: !user,
	});	

    console.log(user.id);
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
			{data.player.tournaments ? (
				<ul>
					{data.player.tournaments.map((tournament) => (
						<li key={tournament.id}>
							{tournament.name} - {tournament.status}
						</li>
					))}
				</ul>
			) : (
				<p>No player data found.</p>
			)}
			<button onClick={handleDelete} className="delete-button">
				Delete Account
			</button>
		</div>
	);
}

export default History;
