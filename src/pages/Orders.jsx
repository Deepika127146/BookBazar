import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useUser } from '../context/UserContext';

const Orders = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    const fetchOrders = async () => {
      try {
        const res = await API.get('/api/orders/history', { headers: { 'X-User-Id': user.id } });
        setOrders(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) return <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>;

  return (
    <div className="container py-5">
      <h2 className="fw-bold mb-4">📦 My Orders</h2>
      {orders.length === 0 ? (
        <div className="text-center py-5">
          <p className="text-muted fs-5">No orders found.</p>
          <button className="btn btn-primary" onClick={() => navigate('/books')}>Start Shopping</button>
        </div>
      ) : (
        <div className="row g-4">
          {orders.map((order) => (
            <div className="col-12" key={order.id}>
              <div className="card border-0 shadow-sm">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="fw-bold mb-1">Order #{order.id}</h6>
                      <p className="text-muted mb-0 small">
                        {new Date(order.orderDate).toLocaleDateString('en-IN', {
                          year: 'numeric', month: 'long', day: 'numeric'
                        })}
                      </p>
                    </div>
                    <div className="text-end">
                      <h5 className="fw-bold text-success mb-1">₹{order.totalAmount}</h5>
                      <span className={`badge ${order.status === 'PENDING' ? 'bg-warning text-dark' : 'bg-success'}`}>
                        {order.status}
                      </span>
                    </div>
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

export default Orders;
