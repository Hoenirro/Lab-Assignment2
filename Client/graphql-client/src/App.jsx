// App.jsx
import React from "react";
import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";
import { useAuth } from "./AuthContext.jsx";
import "./App.css";
import TournamentList from "./components/TournamentList";
import AuthForm from "./components/AuthForm";
import Profile from "./components/Profile";
import History from "./components/History.jsx";
import TournamentDetail from "./components/TournamentDetail";
import Trophy from "./components/Trophy";
import PersonalPC from "./components/PersonalPC.jsx";

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
								<>
									<li>
										<Link to="/profile">Profile</Link>
									</li>
									<li>
										<Link to="/history">History</Link>
									</li>
								</>
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
						<Route path="/history" element={<History />} />
						<Route path="/tournament/:id" element={<TournamentDetail />} />
					</Routes>
				</main>
				<div className="three-container">
					<Routes>
						<Route path="/" element={<Trophy />} />
						<Route path="/profile" element={<PersonalPC />} />
					</Routes>
				</div>
			</div>
		</Router>
	);
}

export default App;
