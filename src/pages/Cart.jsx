import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useUser } from '../context/UserContext';

const Cart = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const fetchCart = async () => {
    try {
      const res = await API.get('/api/cart', { headers: { 'X-User-Id': user.id } });
      setCart(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    fetchCart();
  }, []);

  const handleRemove = async (cartId) => {
    try {
      await API.delete(`/api/cart/${cartId}`, { headers: { 'X-User-Id': user.id } });
      fetchCart();
    } catch (err) {
      console.error(err);
    }
  };

  const handlePlaceOrder = async () => {
    try {
      await API.post('/api/orders', {}, { headers: { 'X-User-Id': user.id } });
      setMessage('✅ Order placed successfully!');
      setCart([]);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to place order');
    }
  };

  const total = cart.reduce((sum, item) => sum + item.bookPrice * item.quantity, 0);

  if (loading) return <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>;

  return (
    <div className="container py-5">
      <h2 className="fw-bold mb-4">🛒 My Cart</h2>
      {message && <div className="alert alert-success">{message}</div>}
      {cart.length === 0 ? (
        <div className="text-center py-5">
          <p className="text-muted fs-5">Your cart is empty.</p>
          <button className="btn btn-primary" onClick={() => navigate('/books')}>Browse Books</button>
        </div>
      ) : (
        <>
          <div className="table-responsive">
            <table className="table table-bordered align-middle">
              <thead className="table-dark">
                <tr>
                  <th>Book</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Subtotal</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {cart.map((item) => (
                  <tr key={item.id}>
                    <td className="fw-semibold">{item.bookTitle}</td>
                    <td>₹{item.bookPrice}</td>
                    <td>{item.quantity}</td>
                    <td>₹{(item.bookPrice * item.quantity).toFixed(2)}</td>
                    <td>
                      <button className="btn btn-danger btn-sm" onClick={() => handleRemove(item.id)}>
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="text-end mt-3">
            <h4 className="fw-bold">Total: ₹{total.toFixed(2)}</h4>
            <button className="btn btn-success btn-lg mt-2" onClick={handlePlaceOrder}>
              Place Order
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
