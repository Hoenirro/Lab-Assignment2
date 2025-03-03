import React from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation, gql } from "@apollo/client";
import { useAuth } from "../AuthContext.jsx";
import "./TournamentDetail.css"; // Optional: for styling

// GraphQL Query to fetch tournament details
const GET_TOURNAMENT = gql`
	query GetTournament($id: ID!) {
		tournament(id: $id) {
			id
			name
			game
			date
			status
			players {
				id
				user {
					id
					username
				}
			}
		}
	}
`;

// GraphQL Query to fetch all players (to find the logged-in user's player ID)
const GET_PLAYER = gql`
	query GetPlayers {
		players {
			id
			user {
				id
			}
		}
	}
`;

// GraphQL Mutation to join the tournament
const JOIN_TOURNAMENT = gql`
	mutation JoinTournament($playerId: ID!, $tournamentId: ID!) {
		joinTournament(playerId: $playerId, tournamentId: $tournamentId) {
			id
			players {
				id
			}
		}
	}
`;

// GraphQL Mutation to quit the tournament
const REMOVE_FROM_TOURNAMENT = gql`
	mutation RemoveFromTournament($playerId: ID!, $tournamentId: ID!) {
		removeFromTournament(playerId: $playerId, tournamentId: $tournamentId) {
			id
			players {
				id
			}
		}
	}
`;

function TournamentDetail() {
	const { id } = useParams(); // Get tournament ID from the URL
	const { user } = useAuth(); // Get the logged-in user from AuthContext

	// Fetch tournament data
	const {
		loading: tournamentLoading,
		error: tournamentError,
		data: tournamentData,
	} = useQuery(GET_TOURNAMENT, {
		variables: { id },
	});

	// Fetch player data only if a user is logged in
	const {
		loading: playerLoading,
		error: playerError,
		data: playerData,
	} = useQuery(GET_PLAYER, {
		skip: !user, // Skip this query if no user is logged in
	});

	// Mutations for joining and quitting the tournament
	const [joinTournament] = useMutation(JOIN_TOURNAMENT, {
		refetchQueries: [{ query: GET_TOURNAMENT, variables: { id } }],
	});

	const [removeFromTournament] = useMutation(REMOVE_FROM_TOURNAMENT, {
		refetchQueries: [{ query: GET_TOURNAMENT, variables: { id } }],
	});

	// Handle loading and error states
	if (tournamentLoading || (user && playerLoading)) return <p>Loading...</p>;
	if (tournamentError) return <p>Error: {tournamentError.message}</p>;
	if (user && playerError) return <p>Error: {playerError.message}</p>;

	const tournament = tournamentData.tournament;

	// Find the player associated with the logged-in user
	const player =
		user && playerData?.players.find((p) => p.user?.id === user.id);
	const playerId = player?.id;

	// Check if the user is registered for the tournament
	const isRegistered =
		user && tournament.players.some((p) => p.user?.id === user.id);

	// Handler for joining the tournament
	const handleJoin = async () => {
		if (!playerId) {
			alert("Unable to join: Player data not found.");
			return;
		}
		try {
			await joinTournament({ variables: { playerId, tournamentId: id } });
			alert("Joined successfully!");
		} catch (error) {
			alert(error.message);
		}
	};

	// Handler for quitting the tournament
	const handleQuit = async () => {
		if (!playerId) {
			alert("Unable to quit: Player data not found.");
			return;
		}
		try {
			await removeFromTournament({ variables: { playerId, tournamentId: id } });
			alert("Quit successfully!");
		} catch (error) {
			alert(error.message);
		}
	};

	return (
		<div className="tournament-detail">
			<h2>{tournament.name}</h2>
			<p>
				<strong>Game:</strong> {tournament.game}
			</p>
			<p>
				<strong>Date:</strong> {tournament.date}
			</p>
			<p>
				<strong>Status:</strong> {tournament.status}
			</p>
			<h3>Players</h3>
			<ul>
				{tournament.players.map((player) => (
					<li key={player.id}>{player.user?.username || "Deleted User"}</li>
				))}
			</ul>
			{/* Button logic */}
			{user && (
				<>
					{isRegistered ? (
						<button onClick={handleQuit}>Quit Tournament</button>
					) : (
						<button onClick={handleJoin}>Register for Tournament</button>
					)}
				</>
			)}
		</div>
	);
}

export default TournamentDetail;
