import React, { useState } from "react";
import './App.css';

const buildApiUrl = (searchType, query) => {
  if (!query) return "";
  if (searchType === "title") {
    return `https://openlibrary.org/search.json?title=${encodeURIComponent(query)}`;
  }
  if (searchType === "author") {
    return `https://openlibrary.org/search.json?author=${encodeURIComponent(query)}`;
  }
  if (searchType === "subject") {
    return `https://openlibrary.org/search.json?subject=${encodeURIComponent(query)}`;
  }
  return "";
};

function App() {
  
  const [query, setQuery] = useState("");
  const [searchType, setSearchType] = useState("title");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  
  const fetchBooks = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setError("");
    setResults([]);
    try {
      const url = buildApiUrl(searchType, query);
      const res = await fetch(url);
      const data = await res.json();
      setResults(data.docs || []);
    } catch (err) {
      setError("Could not fetch books. Check your connection.");
    }
    setLoading(false);
  };

  
  const getCoverUrl = (coverId) =>
    coverId
      ? `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`
      : "https://via.placeholder.com/128x180?text=No+Cover";

  return (
    <div  className="box"style={{ padding: "2rem", fontFamily: "sans-serif", background: "orange", minHeight: "100vh",borderRadius:15,marginTop:10}}>
    <h1>📚 Book Finder</h1>
      <h3>Hello Alex! Search for books by title, author or subject.</h3>
      <form onSubmit={fetchBooks} style={{ marginBottom: 24 }}>
        <select
          value={searchType}
          onChange={(e) => setSearchType(e.target.value)}
          style={{ marginRight: 8, padding: 6, borderRadius: 4 }}
        >
          <option value="title">By Title</option>
          <option value="author">By Author</option>
          <option value="subject">By Subject</option>
        </select>
        <input
          style={{
            padding: "6px 10px",textSizeAdjust:20,
            minWidth: 250,
            marginRight: 8,
            borderRadius: 4,
            border: "1px solid #bbb",
            background:"pink"
          }}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={`Search books by ${searchType}...`}
        />
        <button type="submit" style={{ padding: "8px 16px", borderRadius: 4, background: "#0055bb", color: "#fff"}}>
          Search
        </button>
      </form>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 18 }}>
        {results.map((book) => (
          <div
            key={book.key}
            style={{
              background: "#fff",
              border: "1px solid #ddd",
              borderRadius: 8,
              width: 220,
              padding: 12,
              boxShadow: "0 2px 6px rgba(50,66,74,.07)",
              marginBottom: 18,
            }}
          >
            <img
              src={getCoverUrl(book.cover_i)}
              alt={book.title}
              style={{ width: 128, height: 180, objectFit: "cover", marginBottom: 8, display: "block", marginLeft: "auto", marginRight: "auto" }}
            />
            <h4 style={{ fontSize: "1.08rem", margin: "7px 0" }}>{book.title}</h4>
            {book.author_name && (
              <p style={{ margin: 0, fontSize: ".95rem" }}>
                <strong>Author:</strong> {book.author_name.join(", ")}
              </p>
            )}
            {book.first_publish_year && (
              <p style={{ margin: 0, fontSize: ".95rem" }}>
                <strong>First Published:</strong> {book.first_publish_year}
              </p>
            )}
            {book.subject && (
              <p style={{ margin: 0, fontSize: ".82rem", color: "#777" }}>
                <strong>Subjects:</strong> {book.subject.slice(0, 3).join(", ")}
              </p>
            )}
          </div>
        ))}
      </div>
      {!loading && results.length === 0 && query && (
        <p>No books found. Try a different search.</p>
      )}
    </div>
  );
}

export default App;
