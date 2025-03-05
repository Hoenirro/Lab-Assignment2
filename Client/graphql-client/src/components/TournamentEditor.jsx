// components/AuthForm.jsx
import React, { useState, useEffect } from "react";
import { useMutation, gql, useQuery } from "@apollo/client";
import { useAuth } from "../AuthContext.jsx";
import "./TournamentEditor.css";
import { useNavigate, useParams } from "react-router-dom";
import "./AuthForm.css";

const CREATE_TOURNAMENT = gql`
  mutation CreateTournament(
    $name: String!
    $game: String!
    $date: String!
    $status: String!
  ) {
    createTournament(name: $name, game: $game, date: $date, status: $status) {
      id
      name
    }
  }
`;

const GET_TOURNAMENT = gql`
  query GetTournament($id: ID!) {
    tournament(id: $id) {
      id
      name
      game
      date
      status
    }
  }
`;

const EDIT_TOURNAMENT = gql`
  mutation EditTournament(
    $tournamentId: ID!
    $name: String!
    $game: String!
    $date: String!
    $status: String!
  ) {
    editTournament(
      tournamentId: $tournamentId
      name: $name
      game: $game
      date: $date
      status: $status
    ) {
      name
      game
      date
      status
    }
  }
`;

function TournamentEditor(props) {
  const { id } = useParams();
  const { create } = props;
  const [name, setName] = useState("");
  const [game, setGame] = useState("");
  const [date, setDate] = useState("");
  const [status, setStatus] = useState("Upcoming");
  const [createTournament] = useMutation(CREATE_TOURNAMENT);
  const [editTournament] = useMutation(EDIT_TOURNAMENT);
  const { data } = useQuery(GET_TOURNAMENT, {
    variables: { id },
    skip: create,
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (data) {
      console.log(data);
      setName(data.tournament.name);
      setGame(data.tournament.game);
      setDate(new Date(data.tournament.date).toISOString().split('T')[0]);
      setStatus(data.tournament.status);
    }
  }, [data]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (create) {
        const { data } = await createTournament({
          variables: { name, game, date, status },
        });
        setName("");
        setGame("");
        setDate("");
        setStatus("Upcoming");
        navigate("/");
      } else {
        const { data } = await editTournament({
          variables: {
            tournamentId: id,
            name,
            game,
            date,
            status,
          },
        });
        setName("");
        setGame("");
        setDate("");
        setStatus("Upcoming");
        navigate("/");
      }
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <h3>{create ? "Create Tournament" : "Edit Tournament"}</h3>
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Game"
        value={game}
        onChange={(e) => setGame(e.target.value)}
        required
      />
      <input
        type="date"
        placeholder="Date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        required
      />
      {!create && (
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          required
        >
          <option value="Upcoming">Upcoming</option>
          <option value="Ongoing">Ongoing</option>
          <option value="Completed">Completed</option>
        </select>
      )}
      <button type="submit">{create ? "Create" : "Edit"}</button>
    </form>
  );
}

export default TournamentEditor;
