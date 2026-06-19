import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../api/axios';
import { useUser } from '../../context/UserContext';

const AdminPanel = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editBook, setEditBook] = useState(null);
  const [message, setMessage] = useState('');
  const [form, setForm] = useState({
    title: '', author: '', price: '', category: '', stock: '', description: ''
  });

  useEffect(() => {
    if (!user || user.role !== 'ROLE_ADMIN') {
      navigate('/');
      return;
    }
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const res = await API.get('/api/books');
      setBooks(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleEdit = (book) => {
    setEditBook(book);
    setForm(book);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this book?')) return;
    try {
      await API.delete(`/api/books/${id}`);
      setMessage('✅ Book deleted successfully!');
      fetchBooks();
    } catch (err) {
      setMessage('❌ Failed to delete book');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editBook) {
        await API.put(`/api/books/${editBook.id}`, form);
        setMessage('✅ Book updated successfully!');
      } else {
        await API.post('/api/books', form);
        setMessage('✅ Book added successfully!');
      }
      setShowForm(false);
      setEditBook(null);
      setForm({ title: '', author: '', price: '', category: '', stock: '', description: '' });
      fetchBooks();
    } catch (err) {
      setMessage('❌ Failed to save book');
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditBook(null);
    setForm({ title: '', author: '', price: '', category: '', stock: '', description: '' });
  };

  if (loading) return <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>;

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold">⚙️ Admin Panel</h2>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>
          + Add New Book
        </button>
      </div>

      {message && <div className="alert alert-info">{message}</div>}

      {showForm && (
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-body p-4">
            <h5 className="fw-bold mb-3">{editBook ? 'Edit Book' : 'Add New Book'}</h5>
            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Title</label>
                  <input type="text" name="title" className="form-control" value={form.title} onChange={handleChange} required />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Author</label>
                  <input type="text" name="author" className="form-control" value={form.author} onChange={handleChange} required />
                </div>
                <div className="col-md-4">
                  <label className="form-label fw-semibold">Price (₹)</label>
                  <input type="number" name="price" className="form-control" value={form.price} onChange={handleChange} required />
                </div>
                <div className="col-md-4">
                  <label className="form-label fw-semibold">Category</label>
                  <input type="text" name="category" className="form-control" value={form.category} onChange={handleChange} required />
                </div>
                <div className="col-md-4">
                  <label className="form-label fw-semibold">Stock</label>
                  <input type="number" name="stock" className="form-control" value={form.stock} onChange={handleChange} required />
                </div>
                <div className="col-12">
                  <label className="form-label fw-semibold">Description</label>
                  <textarea name="description" className="form-control" rows="3" value={form.description} onChange={handleChange}></textarea>
                </div>
              </div>
              <div className="mt-3 d-flex gap-2">
                <button type="submit" className="btn btn-success">{editBook ? 'Update Book' : 'Add Book'}</button>
                <button type="button" className="btn btn-secondary" onClick={handleCancel}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="table-responsive">
        <table className="table table-bordered align-middle">
          <thead className="table-dark">
            <tr>
              <th>#</th>
              <th>Title</th>
              <th>Author</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {books.map((book) => (
              <tr key={book.id}>
                <td>{book.id}</td>
                <td className="fw-semibold">{book.title}</td>
                <td>{book.author}</td>
                <td><span className="badge bg-primary">{book.category}</span></td>
                <td>₹{book.price}</td>
                <td>
                  <span className={`badge ${book.stock > 0 ? 'bg-success' : 'bg-danger'}`}>
                    {book.stock}
                  </span>
                </td>
                <td>
                  <button className="btn btn-warning btn-sm me-2" onClick={() => handleEdit(book)}>Edit</button>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(book.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPanel;
