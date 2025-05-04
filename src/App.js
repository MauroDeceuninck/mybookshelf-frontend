import React, { useState, useEffect } from "react";
import { API_URL, USER_ID } from "./config";

function App() {
  const [books, setBooks] = useState([]);
  const [editingId, setEditingId] = useState(null); // null = not editing
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
    const bookData = { ...form, userId: USER_ID };

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
      status: "Want to read",
      notes: "",
    });
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
      status: book.status,
      notes: book.notes,
    });
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
          <button onClick={() => startEdit(book)}>Edit</button>
        </div>
      ))}
    </div>
  );
}

export default App;
