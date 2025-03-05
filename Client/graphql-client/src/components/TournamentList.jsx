// components/TournamentList.jsx
import React, { useState, useEffect } from "react";
import { useQuery, gql } from "@apollo/client";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";
import "./TournamentList.css";
import { useAuth } from "../AuthContext";
import { useNavigate } from "react-router-dom";

const GET_TOURNAMENTS = gql`
	query GetTournaments {
		tournaments {
			id
			name
			game
			date
			status
		}
	}
`;

function TournamentList() {
	const { user } = useAuth();
	const { loading, error, data, refetch } = useQuery(GET_TOURNAMENTS);
	const [filter, setFilter] = useState("All");
	const navigate = useNavigate();

	useEffect(() => {
		refetch();
	});

	if (loading) return <p>Loading...</p>;
	if (error) return <p>Error: {error.message}</p>;

	const tournaments = data.tournaments.filter((tournament) =>
		filter === "All" ? true : tournament.status === filter
	);

	const handleEdit = (tournament) => {
		navigate("/edittournament/" + tournament.id);
	};

	const isAdmin = user && user.role === "Admin";
	return (
		<div className="tournament-list">
			<h2>Tournaments</h2>
			<div className="filter-buttons">
				<button onClick={() => setFilter("All")}>All</button>
				<button onClick={() => setFilter("Upcoming")}>Upcoming</button>
				<button onClick={() => setFilter("Ongoing")}>Ongoing</button>
				<button onClick={() => setFilter("Completed")}>Completed</button>
			</div>
			<ul>
				{tournaments.map((tournament) => (
					<li key={tournament.id}>
						<Link to={`/tournament/${tournament.id}`}>
							{tournament.name} ({tournament.game}) - {tournament.status}
						</Link>
						{isAdmin && (
							<Button onClick={() => handleEdit(tournament)}>Edit</Button>
						)}
					</li>
				))}
			</ul>
		</div>
	);
}

export default TournamentList;
