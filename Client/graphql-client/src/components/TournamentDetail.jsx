import { React, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation, useLazyQuery, gql } from "@apollo/client";
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

const SEARCH_PLAYER = gql`
	query SearchPlayer($username: String!) {
		playerByUsername(username: $username) {
			id
			user {
				id
				username
			}
		}
	}
`;

// GraphQL Mutation to join the tournament
const JOIN_TOURNAMENT = gql`
	mutation JoinTournament($playerId: ID!, $tournamentId: ID!) {
		joinTournament(playerId: $playerId, tournamentId: $tournamentId) {
			id
		}
	}
`;

// GraphQL Mutation to quit the tournament
const REMOVE_FROM_TOURNAMENT = gql`
	mutation RemoveFromTournament($playerId: ID!, $tournamentId: ID!) {
		removeFromTournament(playerId: $playerId, tournamentId: $tournamentId) {
			id
		}
	}
`;

function TournamentDetail() {
	const { id } = useParams(); // Get tournament ID from the URL
	const { user, playerId } = useAuth(); // Get the logged-in user from AuthContext
	const [searchUsername, setSearchUsername] = useState("");

	// Fetch tournament data
	const {
		loading: tournamentLoading,
		error: tournamentError,
		data: tournamentData,
	} = useQuery(GET_TOURNAMENT, {
		variables: { id },
	});

	// Fetch player data only if a user is logged in
	const [searchUser, { data: searchUserData }] = useLazyQuery(SEARCH_PLAYER, {
		variables: { username: searchUsername },
	});

	// Mutations for joining and quitting the tournament
	const [joinTournament] = useMutation(JOIN_TOURNAMENT, {
		refetchQueries: [{ query: GET_TOURNAMENT, variables: { id } }],
	});

	const [removeFromTournament] = useMutation(REMOVE_FROM_TOURNAMENT, {
		refetchQueries: [{ query: GET_TOURNAMENT, variables: { id } }],
	});

	// Handle loading and error states
	if (tournamentLoading) return <p>Loading...</p>;
	if (tournamentError) return <p>Error: {tournamentError.message}</p>;

	const tournament = tournamentData.tournament;
	// Handler for joining the tournament
	const handleJoin = async () => {
		if (!playerId) {
			alert("Unable to join: Player data not found.");
			return;
		}
		try {
			await joinTournament({ variables: { playerId, tournamentId: id } });
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
		} catch (error) {
			alert(error.message);
		}
	};

	const handleSearchPlayer = async () => {
		try {
			await searchUser({
				variables: { username: searchUsername },
			});
		} catch (error) {
			alert(error.message);
		}
	};

	const handleAddPlayer = async (playerToAddId) => {
		try {
			await joinTournament({
				variables: { playerId: playerToAddId, tournamentId: id },
			});
			setSearchUsername("");
			await searchUser({
				variables: { username: "" },
			});
			alert("Player added successfully!");
		} catch (error) {
			alert(error.message);
		}
	};

	const isRegistered = tournament.players.some(
		(player) => player.id === playerId
	);

	return (
		<div className="tournament-card">
			<h2>{tournament.name}</h2>
			<p>
				<strong>Game:</strong> {tournament.game}
			</p>
			<p>
				<strong>Date:</strong> {new Date(tournament.date).toDateString()}
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
					{user.role === "Player" && (
						<>
							{isRegistered ? (
								<button onClick={handleQuit}>Quit Tournament</button>
							) : (
								<button onClick={handleJoin}>Register for Tournament</button>
							)}
						</>
					)}
					{user.role === "Admin" && (
						<>
							<div>
								<input
									type="text"
									value={searchUsername}
									onChange={(e) => setSearchUsername(e.target.value)}
									placeholder="Search player by username"
									className="tall-input"
								/>
								<button onClick={handleSearchPlayer}>
									🔍 {/* Magnifying glass emoji */}
								</button>
							</div>
							{searchUserData && searchUserData.playerByUsername && (
								<ul>
									{searchUserData.playerByUsername.map((player) => {
										const isPlayerInTournament = tournament.players.some(
											(tournamentPlayer) => tournamentPlayer.id === player.id
										);
										return (
											<li key={player.id}>
												{player.user.username}
												{!isPlayerInTournament && (
													<button onClick={() => handleAddPlayer(player.id)}>
														Add to Tournament
													</button>
												)}
											</li>
										);
									})}
								</ul>
							)}
						</>
					)}
				</>
			)}
		</div>
	);
}

export default TournamentDetail;
