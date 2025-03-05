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
import Players from "./components/Players.jsx";
import TournamentEditor from "./components/TournamentEditor.jsx";
import CreateUsers from "./components/CreateUser.jsx";

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
                  <Link to="/createusers">Create Users</Link>
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
            <Route path="/createusers" element={<CreateUsers />} />
            <Route path="/createtournament" element={<TournamentEditor create={true}/>} />
            <Route path="/edittournament" element={<TournamentEditor create={false}/>} />
            <Route path="/tournament/:id" element={<TournamentDetail />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
