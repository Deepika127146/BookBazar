import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useUser } from '../context/UserContext';

const BookDetails = () => {
  const { id } = useParams();
  const { user } = useUser();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const res = await API.get(`/api/books/${id}`);
        setBook(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBook();
  }, [id]);

  const handleAddToCart = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    try {
      await API.post('/api/cart/add', { bookId: book.id, quantity }, {
        headers: { 'X-User-Id': user.id }
      });
      setMessage('✅ Added to cart successfully!');
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add to cart');
      setMessage('');
    }
  };

  if (loading) return (
    <div className="text-center py-5">
      <div className="spinner-border text-primary"></div>
    </div>
  );

  if (!book) return <div className="text-center py-5 text-muted">Book not found.</div>;

  return (
    <div className="container py-5">
      <button className="btn btn-outline-secondary mb-4" onClick={() => navigate(-1)}>
        ← Back
      </button>
      <div className="row">
        <div className="col-md-4 text-center mb-4">
          <div className="bg-light rounded p-5 fs-1">📖</div>
        </div>
        <div className="col-md-8">
          <span className="badge bg-primary mb-2">{book.category}</span>
          <h2 className="fw-bold">{book.title}</h2>
          <p className="text-muted fs-5">by {book.author}</p>
          <p className="text-muted">{book.description}</p>
          <hr />
          <div className="d-flex align-items-center gap-3 mb-3">
            <span className="fs-3 fw-bold text-success">₹{book.price}</span>
            <span className={`badge fs-6 ${book.stock > 0 ? 'bg-success' : 'bg-danger'}`}>
              {book.stock > 0 ? `${book.stock} in stock` : 'Out of Stock'}
            </span>
          </div>

          {message && <div className="alert alert-success">{message}</div>}
          {error && <div className="alert alert-danger">{error}</div>}

          {book.stock > 0 && (
            <div className="d-flex align-items-center gap-3">
              <div className="d-flex align-items-center gap-2">
                <label className="fw-semibold">Qty:</label>
                <input
                  type="number"
                  className="form-control"
                  style={{ width: '80px' }}
                  min={1}
                  max={book.stock}
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                />
              </div>
              <button className="btn btn-primary px-4" onClick={handleAddToCart}>
                🛒 Add to Cart
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookDetails;
