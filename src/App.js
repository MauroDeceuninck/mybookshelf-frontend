import React, { useState, useEffect } from "react";
import { config, loadConfig } from "./config";
import "./App.css";

import LoginForm from "./components/LoginForm";
import BookForm from "./components/BookForm";
import BookList from "./components/BookList";

function App() {
  const [auth, setAuth] = useState({
    token: localStorage.getItem("token") || "",
    userId: localStorage.getItem("userId") || "",
    username: localStorage.getItem("username") || "",
  });

  const [books, setBooks] = useState([]);
  const [editingBook, setEditingBook] = useState(null);
  const isLoggedIn = !!auth.token;

  useEffect(() => {
    async function initialize() {
      await loadConfig();
      if (auth.token) fetchBooks();
    }
    initialize();
  }, [auth.token]);

  const fetchBooks = async () => {
    try {
      const res = await fetch(`${config.API_URL}`, {
        headers: { Authorization: `Bearer ${auth.token}` },
      });

      if (!res.ok) {
        console.error("Failed to fetch books:", await res.json());
        return;
      }

      const data = await res.json();
      setBooks(data);
    } catch (err) {
      console.error("Fetch failed:", err);
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
        <LoginForm
          onAuthSuccess={(authData) => {
            setAuth(authData);
            fetchBooks();
          }}
        />
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
            <BookForm
              auth={auth}
              editingBook={editingBook}
              onBookSaved={fetchBooks}
            />
            <BookList
              books={books}
              onDelete={async (id) => {
                await fetch(`${config.API_URL}/${id}`, {
                  method: "DELETE",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${auth.token}`,
                  },
                });
                fetchBooks();
              }}
              onEdit={setEditingBook}
            />
          </div>
        </>
      )}
    </div>
  );
}

export default App;
