import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';

const Books = () => {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const res = search
        ? await API.get(`/api/books/search?title=${search}`)
        : await API.get('/api/books');
      setBooks(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchBooks();
  };

  return (
    <div className="container py-5">
      <h2 className="fw-bold mb-4">📚 All Books</h2>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="d-flex mb-4 gap-2">
        <input
          type="text"
          className="form-control"
          placeholder="Search books by title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button type="submit" className="btn btn-primary px-4">Search</button>
        <button type="button" className="btn btn-outline-secondary" onClick={() => { setSearch(''); fetchBooks(); }}>
          Clear
        </button>
      </form>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status"></div>
          <p className="mt-2">Loading books...</p>
        </div>
      ) : books.length === 0 ? (
        <div className="text-center py-5">
          <p className="text-muted fs-5">No books found.</p>
        </div>
      ) : (
        <div className="row g-4">
          {books.map((book) => (
            <div className="col-md-4 col-sm-6" key={book.id}>
              <div className="card h-100 shadow-sm border-0">
                <div className="card-body d-flex flex-column">
                  <span className="badge bg-primary mb-2 align-self-start">{book.category}</span>
                  <h5 className="card-title fw-bold">{book.title}</h5>
                  <p className="text-muted mb-1">by {book.author}</p>
                  <p className="text-muted small mb-2">{book.description?.substring(0, 80)}...</p>
                  <div className="mt-auto">
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="fs-5 fw-bold text-success">₹{book.price}</span>
                      <span className={`badge ${book.stock > 0 ? 'bg-success' : 'bg-danger'}`}>
                        {book.stock > 0 ? `Stock: ${book.stock}` : 'Out of Stock'}
                      </span>
                    </div>
                    <Link to={`/books/${book.id}`} className="btn btn-outline-primary w-100 mt-3">
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Books;
