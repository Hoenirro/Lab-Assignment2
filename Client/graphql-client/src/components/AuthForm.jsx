// components/AuthForm.jsx
import React, { useState } from "react";
import { useMutation, gql } from "@apollo/client";
import { useAuth } from "../AuthContext.jsx";
import "./AuthForm.css";

const REGISTER = gql`
	mutation Register(
		$username: String!
		$email: String!
		$password: String!
		$role: String!
	) {
		register(
			username: $username
			email: $email
			password: $password
			role: $role
		) {
			user {
				id
				username
			}
			token
		}
	}
`;

const LOGIN = gql`
	mutation Login($email: String!, $password: String!) {
		login(email: $email, password: $password) {
			user {
				id
				username
			}
			token
		}
	}
`;

function AuthForm() {
	const { user, login, logout } = useAuth();
	const [isRegister, setIsRegister] = useState(false);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [repeatPassword, setRepeatPassword] = useState("");
	const [username, setUsername] = useState("");
	const [register] = useMutation(REGISTER);
	const [loginMutation] = useMutation(LOGIN);

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			if (isRegister) {
				if (password !== repeatPassword) {
					alert("Passwords do not match");
					return;
				}
				const { data } = await register({
					variables: { username, email, password, role: "Player" },
				});
				login(data.register.user, data.register.token);
				setEmail("");
				setPassword("");
				setRepeatPassword("");
				setUsername("");
				alert("Registered successfully!");
			} else {
				const { data } = await loginMutation({
					variables: { email, password },
				});
				login(data.login.user, data.login.token);
				setEmail("");
				setPassword("");
				console.log("Login user data:", data.login.user);
				login(data.login.user, data.login.token);
				alert("Logged in successfully!");
			}
		} catch (error) {
			alert(error.message);
		}
	};

	if (user) {
		return (
			<div className="auth-form">
				<p>Welcome, {user.username}!</p>
				<button onClick={logout}>Logout</button>
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
				<input
					type="password"
					placeholder="Repeat Password"
					value={repeatPassword}
					onChange={(e) => setRepeatPassword(e.target.value)}
					required
				/>
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
