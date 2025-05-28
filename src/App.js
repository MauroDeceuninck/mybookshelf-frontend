import React, { useState, useEffect } from "react";
import { API_URL, USER_ID } from "./config";
import "./App.css";

function App() {
  const [books, setBooks] = useState([]);
  const [editingId, setEditingId] = useState(null); // null = not editing
  const [filterStatus, setFilterStatus] = useState("All");
  const [genreFilter, setGenreFilter] = useState("All");
  const [useCustomGenre, setUseCustomGenre] = useState(false);
  const [availableGenres, setAvailableGenres] = useState([]);
  const [authError, setAuthError] = useState("");

  const [form, setForm] = useState({
    title: "",
    author: "",
    genre: "",
    customGenre: "",
    status: "Want to read",
    notes: "",
  });

  const [auth, setAuth] = useState({
    token: localStorage.getItem("token") || "",
    userId: localStorage.getItem("userId") || "",
    username: localStorage.getItem("username") || "",
  });

  const isLoggedIn = !!auth.token;

  useEffect(() => {
    fetchBooks();
  });

  const fetchBooks = async (customToken) => {
    const tokenToUse = customToken || auth.token;

    try {
      const res = await fetch(`${API_URL}`, {
        headers: {
          Authorization: `Bearer ${tokenToUse}`,
        },
      });

      if (!res.ok) {
        const error = await res.json();
        console.error("Failed to fetch books:", error);
        return;
      }

      const data = await res.json();
      setBooks(data);

      const genres = [
        ...new Set(data.map((book) => book.genre).filter(Boolean)),
      ];
      setAvailableGenres(genres);
    } catch (err) {
      console.error("Fetch failed:", err);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const bookData = {
      ...form,
      genre: useCustomGenre ? form.customGenre : form.genre,
    };

    if (!editingId) {
      bookData.userId = auth.userId;
    }

    if (editingId) {
      // Edit existing book
      await fetch(`${API_URL}/${editingId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
        body: JSON.stringify(bookData),
      });
      setEditingId(null);
    } else {
      // Add new book
      await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
        body: JSON.stringify(bookData),
      });
    }

    setForm({
      title: "",
      author: "",
      genre: "",
      customGenre: "",
      status: "Want to read",
      notes: "",
    });
    setUseCustomGenre(false);
    fetchBooks();
  };

  const deleteBook = async (id) => {
    await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${auth.token}`,
      },
    });
    fetchBooks();
  };

  const startEdit = (book) => {
    setForm({
      title: book.title,
      author: book.author,
      genre: book.genre,
      customGenre: "",
      status: book.status,
      notes: book.notes,
    });

    setUseCustomGenre(false);
    setEditingId(book._id);
  };

  const handleLogin = async (username, password, isRegister = false) => {
    const endpoint = isRegister ? "/api/auth/register" : "/api/auth/login";

    setAuthError(""); // clear old errors

    try {
      const res = await fetch(`http://localhost:3000${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok && (data.token || isRegister)) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("userId", data.userId);
        localStorage.setItem("username", data.username);

        setAuth({
          token: data.token,
          userId: data.userId,
          username: data.username,
        });

        fetchBooks(data.token);
      } else {
        setAuthError(data.error || "Login/Register failed");
      }
    } catch (err) {
      setAuthError("Network error. Please try again.");
      console.error("Login/Register error:", err);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    setAuth({ token: "", userId: "", username: "" });
    setBooks([]);
  };

  return (
    <div className="container">
      {!isLoggedIn ? (
        <div className="auth-box">
          <h2>Login / Register</h2>
          <input type="text" placeholder="Username" id="username" />
          <input type="password" placeholder="Password" id="password" />
          <button
            onClick={() =>
              handleLogin(
                document.getElementById("username").value,
                document.getElementById("password").value,
                false
              )
            }
          >
            Login
          </button>
          <button
            onClick={() =>
              handleLogin(
                document.getElementById("username").value,
                document.getElementById("password").value,
                true
              )
            }
          >
            Register
          </button>
          {authError && (
            <div style={{ color: "red", marginTop: "10px" }}>{authError}</div>
          )}
        </div>
      ) : (
        <div className="auth-box">
          <p>
            Logged in as: <strong>{auth.username}</strong>
          </p>

          <button onClick={handleLogout}>Logout</button>
        </div>
      )}

      {isLoggedIn && (
        <>
          <h1>MyBookshelf</h1>
          <div className="main-content">
            <div className="form-section">
              <form onSubmit={handleSubmit}>
                <input
                  id="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Title"
                  required
                />
                <input
                  id="author"
                  value={form.author}
                  onChange={handleChange}
                  placeholder="Author"
                  required
                />

                <label>Genre:</label>
                <select
                  id="genre"
                  value={useCustomGenre ? "Other" : form.genre}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === "Other") {
                      setUseCustomGenre(true);
                      setForm({ ...form, genre: "", customGenre: "" });
                    } else {
                      setUseCustomGenre(false);
                      setForm({ ...form, genre: value });
                    }
                  }}
                >
                  <option value="">-- Select Genre --</option>
                  <option value="Fantasy">Fantasy</option>
                  <option value="Sci-Fi">Sci-Fi</option>
                  <option value="Dystopian">Dystopian</option>
                  <option value="Non-fiction">Non-fiction</option>
                  <option value="Romance">Romance</option>
                  <option value="Other">Other</option>
                </select>

                {useCustomGenre && (
                  <input
                    type="text"
                    placeholder="Enter custom genre"
                    value={form.customGenre}
                    onChange={(e) =>
                      setForm({ ...form, customGenre: e.target.value })
                    }
                  />
                )}

                <select id="status" value={form.status} onChange={handleChange}>
                  <option>Want to read</option>
                  <option>Reading</option>
                  <option>Read</option>
                </select>

                <textarea
                  id="notes"
                  value={form.notes}
                  onChange={handleChange}
                  placeholder="Notes"
                />

                <button type="submit">
                  {editingId ? "Update" : "Add"} Book
                </button>
              </form>
            </div>

            <div className="book-section">
              <h2>Your Books</h2>
              <div className="filters">
                <label>Filter by Status:</label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="All">All</option>
                  <option value="Want to read">Want to read</option>
                  <option value="Reading">Reading</option>
                  <option value="Read">Read</option>
                </select>

                <label>Filter by Genre:</label>
                <select
                  value={genreFilter}
                  onChange={(e) => setGenreFilter(e.target.value)}
                >
                  <option value="All">All</option>
                  {availableGenres.map((genre) => (
                    <option key={genre} value={genre}>
                      {genre}
                    </option>
                  ))}
                </select>
              </div>

              {books
                .filter(
                  (book) =>
                    (filterStatus === "All" || book.status === filterStatus) &&
                    (genreFilter === "All" || book.genre === genreFilter)
                )
                .map((book) => (
                  <div className="book-card" key={book._id}>
                    <strong>{book.title}</strong> ({book.status})<br />
                    {book.author} - {book.genre}
                    <br />
                    <em>{book.notes}</em>
                    <br />
                    <button onClick={() => deleteBook(book._id)}>Delete</button>
                    <button onClick={() => startEdit(book)}>Edit</button>
                  </div>
                ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
