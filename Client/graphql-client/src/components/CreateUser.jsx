// components/AuthForm.jsx
import React, { useState, useEffect } from "react";
import { useMutation, useQuery, gql } from "@apollo/client";
import { useAuth } from "../AuthContext.jsx";
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

function CreateUsers() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [role, setRole] = useState("Player");
  const [username, setUsername] = useState("");
  const [register] = useMutation(REGISTER);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {      
      const { data } = await register({
        variables: { username, email, password, role },
      });
      setEmail("");
      setPassword("");
      setRepeatPassword("");
      setUsername("");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <h3>Create User</h3>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
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
      <button type="submit">Create User</button>
    </form>
  );
}

export default CreateUsers;
