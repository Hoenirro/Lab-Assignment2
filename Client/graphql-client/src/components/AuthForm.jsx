// components/AuthForm.jsx
import React, { useState, useEffect } from "react";
import { useMutation, useQuery, gql } from "@apollo/client";
import { useAuth } from "../AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import "./AuthForm.css";

const REGISTER = gql`
	mutation Register(
		$username: String!
		$email: String!
		$password: String!
		$role: String!
	) {
		createUser(
			username: $username
			email: $email
			password: $password
			role: $role
		) {			
			id
			username
		}
	}
`;

const LOGIN = gql`
	mutation Login($email: String!, $password: String!) {
		login(email: $email, password: $password){
			id
			username
			email
			role
		}
	}
`;

const LOG_OUT = gql`
	mutation Logout{
		logOut
	}
`;

const GET_PLAYER_BY_USER_ID = gql`
	query GetPlayerByUserId($userId: ID!) {
		playerByUserId(userId: $userId){
			id
		}		
	}
`;

function AuthForm() {
	const { user, login, logout, setPlayerInfo } = useAuth();
	const [userId, setUserId] = useState("");
	const [isRegister, setIsRegister] = useState(false);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [repeatPassword, setRepeatPassword] = useState("");
	const [role, setRole] = useState("Player");
	const [username, setUsername] = useState("");
	const [register] = useMutation(REGISTER);
	const [loginMutation] = useMutation(LOGIN);
	const [logOut] = useMutation(LOG_OUT);		
	const { loading, error, data: playerData, refetch } = useQuery(GET_PLAYER_BY_USER_ID, 
		{
			variables: { userId },
			skip: !user || user.role !== "Player",
		}
	); // Fetch player data
	const navigate = useNavigate();

	useEffect(() => {
		if (user && user.role === "Player") {
			refetch().then(({ data }) => {								
				setPlayerInfo(data.playerByUserId.id);
			});
		}
	}, [user, refetch]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			if (isRegister) {
				if (password !== repeatPassword) {
					alert("Passwords do not match");
					return;
				}
				const { data } = await register({
					variables: { username, email, password, role },
				});
				login({ id: data.createUser.id, username: data.createUser.username, email, role});
				setUserId(data.createUser.id);			
				setEmail("");
				setPassword("");
				setRepeatPassword("");
				setUsername("");
				alert("Registered successfully!");
			} else {
				const { data } = await loginMutation({
					variables: { email, password },
				});
				login(data.login);	
				setUserId(data.login.id);			
				setEmail("");
				setPassword("");
				console.log("Login user data:", data.login);				
				alert("Logged in successfully!");
			}
		} catch (error) {
			alert(error.message);
		}
	};

	const handleLogOut = () => {
		logOut()
		  .then(() => {
			logout();	
			navigate("/");		
		  })
		  .catch((err) => {
			console.error(err.message);
		  });
	  };

	if (user) {
		return (
			<div className="auth-form">
				<div>
					<p style={{color: "black"}}>Welcome, {user.username}!</p>
					<button onClick={handleLogOut}>Logout</button>
				</div>
			</div>
		);
	}

	return (
		<form className="auth-form" onSubmit={handleSubmit}>
			<h3>{isRegister ? "Register" : "Login"}</h3>
			{isRegister && (
				<input
					type="text"
					placeholder="Username"
					value={username}
					onChange={(e) => setUsername(e.target.value)}
					required
				/>
			)}
			<input
				type="email"
				placeholder="Email"
				value={email}
				onChange={(e) => setEmail(e.target.value)}
				required
			/>
			<input
				type="password"
				placeholder="Password"
				value={password}
				onChange={(e) => setPassword(e.target.value)}
				required
			/>
			{isRegister && (
				<>
				<input
					type="password"
					placeholder="Repeat Password"
					value={repeatPassword}
					onChange={(e) => setRepeatPassword(e.target.value)}
					required
				/>
				<div>
					<label>
						<input
							type="radio"
							value="Player"
							checked={role === "Player"}
							onChange={(e) => setRole(e.target.value)}
						/>
						Player
					</label>
					<label>
						<input
							type="radio"
							value="Admin"
							checked={role === "Admin"}
							onChange={(e) => setRole(e.target.value)}
						/>
						Admin
					</label>
				</div>
				</>
			)}
			<button type="submit">{isRegister ? "Register" : "Login"}</button>
			<p onClick={() => setIsRegister(!isRegister)} className="toggle-auth">
				{isRegister
					? "Already have an account? Login"
					: "Need an account? Register"}
			</p>
		</form>
	);
}

export default AuthForm;
