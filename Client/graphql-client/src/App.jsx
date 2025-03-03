// App.jsx
import React from "react";
import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";
import { useAuth } from "./AuthContext.jsx";
import "./App.css";
import TournamentList from "./components/TournamentList";
import AuthForm from "./components/AuthForm";
import Profile from "./components/Profile";
import TournamentDetail from "./components/TournamentDetail";

function App() {
	const { user } = useAuth();

	return (
		<Router>
			<div className="app-container">
				<aside className="sidebar">
					<h2 className="sidebar-title">Tournament Hub</h2>
					<nav>
						<ul className="sidebar-nav">
							<li>
								<Link to="/">Tournaments</Link>
							</li>
							{user && (
								<li>
									<Link to="/profile">Profile</Link>
								</li>
							)}
						</ul>
					</nav>
					<div className="auth-section">
						<AuthForm />
					</div>
				</aside>
				<main className="main-content">
					<Routes>
						<Route path="/" element={<TournamentList />} />
						<Route path="/profile" element={<Profile />} />
						<Route path="/tournament/:id" element={<TournamentDetail />} />
					</Routes>
				</main>
			</div>
		</Router>
	);
}

export default App;
