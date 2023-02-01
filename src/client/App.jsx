import { useEffect, useState } from "react";
import "./App.css";
import MovieForm from "./components/MovieForm";
import UserForm from "./components/UserForm";

const apiUrl = "http://localhost:4000";

function App() {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    fetch(`${apiUrl}/movie`)
      .then((res) => res.json())
      .then((res) => setMovies(res.data));
      console.log("movie", res)
  }, []);

  const handleRegister = async ({ username, password }) => {
    fetch("http://localhost:4000/user/register/", {
      method: "POST",
      headers: { "Content-type": "application/JSON" },
      body: JSON.stringify({ username, password }),
    })
      .then((res) => res.json())
      .then((data) => console.log(data));
  };

  const handleLogin = async ({ username, password }) => {
    fetch("http://localhost:4000/user/login/", {
      method: "POST",
      headers: { "Content-type": "application/JSON" },
      body: JSON.stringify({ username, password }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        localStorage.setItem("token", data.data);
      });
  };

  const handleCreateMovie = async ({ title, description, runtimeMins }) => {
    const res = await fetch("http://localhost:4000/movie/", {
      method: "POST",
      headers: {
        "Content-type": "application/JSON",
        Authorization: `${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ title, description, runtimeMins }),
    });
    const data = await res.json();
    const newMovies = movies.concat([data.data]);
    setMovies(newMovies);
  };

  return (
    <div className="App">
      <h1>Register</h1>
      <UserForm handleSubmit={handleRegister} />

      <h1>Login</h1>
      <UserForm handleSubmit={handleLogin} />

      <h1>Create a movie</h1>
      <MovieForm handleSubmit={handleCreateMovie} />

      <h1>Movie list</h1>
      <ul>
        {movies.map((movie) => {
          return (
            <li key={movie.id}>
              <h3>{movie.title}</h3>
              <p>Description: {movie.description}</p>
              <p>Runtime: {movie.runtimeMins}</p>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default App;
