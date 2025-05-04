import React, { useState, useEffect } from "react";
import { API_URL, USER_ID } from "./config";

function App() {
  const [books, setBooks] = useState([]);
  const [form, setForm] = useState({
    title: "",
    author: "",
    genre: "",
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
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, userId: USER_ID }),
    });
    setForm({
      title: "",
      author: "",
      genre: "",
      status: "Want to read",
      notes: "",
    });
    fetchBooks();
  };

  const deleteBook = async (id) => {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    fetchBooks();
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
        <input
          id="genre"
          value={form.genre}
          onChange={handleChange}
          placeholder="Genre"
        />
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
        <button type="submit">Add Book</button>
      </form>

      <h2>Your Books</h2>
      {books.map((book) => (
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
        </div>
      ))}
    </div>
  );
}

export default App;
