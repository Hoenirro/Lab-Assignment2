// components/Profile.jsx
import React from "react";
import { useQuery, useMutation, gql } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext.jsx";
import "./Profile.css";

const GET_PROFILE = gql`
	query GetProfile($userId: ID!) {
		user(id: $userId) {
			id
			username
			email
		}
		players {
			id
			user {
				id
			}
			tournaments {
				id
				name
				status
			}
		}
	}
`;

const DELETE_USER = gql`
	mutation DeleteUser($userId: ID!) {
		deleteUser(userId: $userId)
	}
`;

function Profile() {
	const { user, logout } = useAuth();
	const navigate = useNavigate();
	const { loading, error, data } = useQuery(GET_PROFILE, {
		variables: { userId: user?.id },
		skip: !user,
	});
	const [deleteUser] = useMutation(DELETE_USER);

	if (!user) {
		navigate("/");
		return null;
	}

	if (loading) return <p>Loading...</p>;
	if (error) return <p>Error: {error.message}</p>;

	// Handle case where user data is null (e.g., deleted or invalid ID)
	if (!data.user) {
		return <p>User not found. It may have been deleted.</p>;
	}

	const player = data.players.find((p) => p.user?.id === user.id);

	const handleDelete = async () => {
		if (window.confirm("Are you sure you want to delete your account?")) {
			try {
				await deleteUser({ variables: { userId: user.id } });
				logout();
				alert("Account deleted successfully");
				navigate("/");
			} catch (error) {
				alert(error.message);
			}
		}
	};

	return (
		<div className="profile-card">
			<h2 className="profile-header">Profile</h2>
			<div className="profile-details">
				<p>
					<strong>👤 Username:</strong> {data.user.username}
				</p>
				<p>
					<strong>📧 Email:</strong> {data.user.email}
				</p>
			</div>
			<div className="tournament-section">
				<h3>Subscribed Tournaments</h3>
				{player ? (
					<ul className="tournament-list">
						{player.tournaments.map((tournament) => (
							<li key={tournament.id} className="tournament-item">
								<span className="tournament-name">{tournament.name}</span> -{" "}
								<span
									className={`status ${
										tournament.status === "Active"
											? "status-active"
											: "status-inactive"
									}`}
								>
									{tournament.status}
								</span>
							</li>
						))}
					</ul>
				) : (
					<p>No player data found.</p>
				)}
			</div>
			<button onClick={handleDelete} className="delete-button">
				🗑 Delete Account
			</button>
		</div>
	);
}

export default Profile;
