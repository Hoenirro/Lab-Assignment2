// components/TournamentList.jsx
import React, { useState } from "react";
import { useQuery, gql } from "@apollo/client";
import { Link } from "react-router-dom";
import "./TournamentList.css";

const GET_TOURNAMENTS = gql`
	query GetTournaments {
		tournaments {
			id
			name
			game
			date
			status
			players {
				id
			}
		}
	}
`;

function TournamentList() {
	const { loading, error, data } = useQuery(GET_TOURNAMENTS);
	const [filter, setFilter] = useState("All");

	if (loading) return <p>Loading...</p>;
	if (error) return <p>Error: {error.message}</p>;

	const tournaments = data.tournaments.filter((tournament) =>
		filter === "All" ? true : tournament.status === filter
	);

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
						<span> Players: {tournament.players.length}</span>
					</li>
				))}
			</ul>
		</div>
	);
}

export default TournamentList;
