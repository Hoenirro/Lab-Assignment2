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
import BooksLP from "./components/bookslp.jsx";
import BooksWM from "./components/bookswm.jsx";
import TypeWriter from "./components/typewriter.jsx";
import BookOpen from "./components/bookopen.jsx";
import Players from "./components/Players";
import CreateUser from "./components/CreateUser";
import TournamentEditor from "./components/TournamentEditor";

function App() {
	const { user } = useAuth();

	// Add wallpaper to the whole page
	React.useEffect(() => {
		document.body.style.backgroundImage =
			"url('/BG/wp6956153-black-and-grey-abstract-wallpapers.jpg')";
		document.body.style.backgroundSize = "cover";
		document.body.style.backgroundRepeat = "no-repeat";
		document.body.style.backgroundAttachment = "fixed";

		return () => {
			document.body.style.backgroundImage = "";
			document.body.style.backgroundSize = "";
			document.body.style.backgroundRepeat = "";
			document.body.style.backgroundAttachment = "";
		};
	}, []);

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
									{user.role === "Player" && (
										<li>
											<Link to="/history">History</Link>
										</li>
									)}
									{user.role === "Admin" && (
										<>
											<li>
												<Link to="/players">Players</Link>
											</li>
											<li>
												<Link to="/createtournament">Create Tournament</Link>
											</li>
											<li>
												<Link to="/createuser">Create User</Link>
											</li>
										</>
									)}
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
						<Route path="/players" element={<Players />} />
						<Route path="/history" element={<History />} />
						<Route
							path="/createtournament"
							element={<TournamentEditor create={true} />}
						/>
						<Route path="/createuser" element={<CreateUser create={true} />} />
						<Route
							path="/edittournament/:id"
							element={<TournamentEditor create={false} />}
						/>
						<Route path="/tournament/:id" element={<TournamentDetail />} />
					</Routes>
				</main>
				<div className="three-container">
					<Routes>
						<Route path="/" element={<Trophy />} />
						<Route path="/profile" element={<PersonalPC />} />
						<Route path="/history" element={<BooksLP />} />
						<Route path="/players" element={<TypeWriter />} />
						<Route path="/createtournament" element={<BookOpen />} />
						<Route path="/edittournament/:id" element={<BooksLP />} />
						<Route path="/tournament/:id" element={<BooksWM />} />
					</Routes>
				</div>
			</div>
		</Router>
	);
}

export default App;
