import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div>
      {/* Hero Section */}
      <div className="bg-dark text-white py-5">
        <div className="container text-center py-4">
          <h1 className="display-4 fw-bold mb-3">Welcome to 📚 BookBazaar</h1>
          <p className="lead mb-4">Discover thousands of books at your fingertips. Shop, explore, and read!</p>
          <Link to="/books" className="btn btn-primary btn-lg me-3">Browse Books</Link>
          <Link to="/register" className="btn btn-outline-light btn-lg">Get Started</Link>
        </div>
      </div>

      {/* Features Section */}
      <div className="container py-5">
        <h2 className="text-center fw-bold mb-5">Why BookBazaar?</h2>
        <div className="row g-4">
          <div className="col-md-4">
            <div className="card h-100 border-0 shadow-sm text-center p-4">
              <div className="fs-1 mb-3">📖</div>
              <h5 className="fw-bold">Huge Collection</h5>
              <p className="text-muted">Browse thousands of books across all genres and categories.</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card h-100 border-0 shadow-sm text-center p-4">
              <div className="fs-1 mb-3">🚀</div>
              <h5 className="fw-bold">Fast Delivery</h5>
              <p className="text-muted">Get your books delivered quickly right to your doorstep.</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card h-100 border-0 shadow-sm text-center p-4">
              <div className="fs-1 mb-3">💰</div>
              <h5 className="fw-bold">Best Prices</h5>
              <p className="text-muted">Enjoy the best prices on all books with exclusive deals.</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary text-white py-5">
        <div className="container text-center">
          <h3 className="fw-bold mb-3">Ready to start reading?</h3>
          <p className="mb-4">Join thousands of readers who love BookBazaar.</p>
          <Link to="/register" className="btn btn-light btn-lg fw-bold">Join Now</Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-dark text-white text-center py-3 mt-auto">
        <p className="mb-0">© 2024 BookBazaar. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
