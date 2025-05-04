import React, { useState, useEffect } from "react";
import { API_URL, USER_ID } from "./config";

function App() {
  const [books, setBooks] = useState([]);
  const [editingId, setEditingId] = useState(null); // null = not editing
  const [filterStatus, setFilterStatus] = useState("All");
  const [genreFilter, setGenreFilter] = useState("All");
  const [useCustomGenre, setUseCustomGenre] = useState(false);
  const [availableGenres, setAvailableGenres] = useState([]);

  const [form, setForm] = useState({
    title: "",
    author: "",
    genre: "",
    customGenre: "",
    status: "Want to read",
    notes: "",
  });

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    const res = await fetch(`${API_URL}?userId=${USER_ID}`);
    const data = await res.json();
    setBooks(data);

    // Extract unique genres
    const genres = [...new Set(data.map((book) => book.genre).filter(Boolean))];
    setAvailableGenres(genres);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const bookData = {
      ...form,
      genre: useCustomGenre ? form.customGenre : form.genre,
      userId: USER_ID,
    };

    if (editingId) {
      // Edit existing book
      await fetch(`${API_URL}/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookData),
      });
      setEditingId(null);
    } else {
      // Add new book
      await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
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

  return (
    <div style={{ padding: "20px" }}>
      <h1>MyBookshelf</h1>
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
            onChange={(e) => setForm({ ...form, customGenre: e.target.value })}
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

        <button type="submit">{editingId ? "Update" : "Add"} Book</button>
      </form>

      <label>Filter by Status: </label>
      <select
        value={filterStatus}
        onChange={(e) => setFilterStatus(e.target.value)}
      >
        <option value="All">All</option>
        <option value="Want to read">Want to read</option>
        <option value="Reading">Reading</option>
        <option value="Read">Read</option>
      </select>

      <label>Filter by Genre: </label>
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

      <h2>Your Books</h2>
      {books
        .filter(
          (book) =>
            (filterStatus === "All" || book.status === filterStatus) &&
            (genreFilter === "All" || book.genre === genreFilter)
        )
        .map((book) => (
          <div
            key={book._id}
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              marginBottom: "10px",
            }}
          >
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
  );
}

export default App;
