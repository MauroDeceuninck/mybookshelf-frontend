import React, { useEffect, useState } from "react";
import { config } from "../config";

function BookForm({ auth, editingBook, onBookSaved }) {
  const [form, setForm] = useState({
    title: "",
    author: "",
    genre: "",
    customGenre: "",
    status: "Want to read",
    notes: "",
  });

  const [useCustomGenre, setUseCustomGenre] = useState(false);

  useEffect(() => {
    if (editingBook) {
      setForm({
        title: editingBook.title || "",
        author: editingBook.author || "",
        genre: editingBook.genre || "",
        customGenre: "",
        status: editingBook.status || "Want to read",
        notes: editingBook.notes || "",
      });
      setUseCustomGenre(false);
    }
  }, [editingBook]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  const handleGenreChange = (e) => {
    const value = e.target.value;
    if (value === "Other") {
      setUseCustomGenre(true);
      setForm({ ...form, genre: "", customGenre: "" });
    } else {
      setUseCustomGenre(false);
      setForm({ ...form, genre: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isEdit = editingBook && editingBook._id;

    const book = {
      ...form,
      genre: useCustomGenre ? form.customGenre : form.genre,
    };

    if (!isEdit) {
      book.userId = auth.userId;
    }

    const url = isEdit
      ? `${config.API_URL}/${editingBook._id}`
      : config.API_URL;

    const method = isEdit ? "PUT" : "POST";

    await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${auth.token}`,
      },
      body: JSON.stringify(book),
    });

    setForm({
      title: "",
      author: "",
      genre: "",
      customGenre: "",
      status: "Want to read",
      notes: "",
    });
    setUseCustomGenre(false);
    onBookSaved();
  };

  return (
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
          onChange={handleGenreChange}
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

        <button type="submit">{editingBook ? "Update" : "Add"} Book</button>
      </form>
    </div>
  );
}

export default BookForm;
