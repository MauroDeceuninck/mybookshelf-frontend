import React, { useState, useMemo } from "react";

function BookList({ books, onDelete, onEdit }) {
  const [filterStatus, setFilterStatus] = useState("All");
  const [genreFilter, setGenreFilter] = useState("All");

  const availableGenres = useMemo(() => {
    const uniqueGenres = new Set();
    books.forEach((book) => {
      if (book.genre) uniqueGenres.add(book.genre);
    });
    return Array.from(uniqueGenres);
  }, [books]);

  const filteredBooks = books.filter(
    (book) =>
      (filterStatus === "All" || book.status === filterStatus) &&
      (genreFilter === "All" || book.genre === genreFilter)
  );

  return (
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

      {filteredBooks.length === 0 && <p>No books match your filters.</p>}

      {filteredBooks.map((book) => (
        <div className="book-card" key={book._id}>
          <strong>{book.title}</strong> ({book.status})<br />
          {book.author} - {book.genre}
          <br />
          <em>{book.notes}</em>
          <br />
          <button onClick={() => onDelete(book._id)}>Delete</button>
          <button onClick={() => onEdit(book)}>Edit</button>
        </div>
      ))}
    </div>
  );
}

export default BookList;
