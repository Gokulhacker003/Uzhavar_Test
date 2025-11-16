

import 'leaflet/dist/leaflet.css';
import {  FaTractor, FaCalendarAlt, FaCheckCircle, FaShoppingCart} from 'react-icons/fa';
import '../App.css';

function BuyInputsPage() {
  return (
    <div className="buy-inputs-page">
      <section className="page-header">
        <h1><FaShoppingCart /> Buy Agri Inputs – Uzhavar Mart</h1>
        <div className="phase-badge">Phase 2 – Under Construction</div>
      </section>
      
      <div className="coming-soon">
        <div className="coming-soon-content">
          <h2>Coming Soon!</h2>
          <p>We're building a comprehensive marketplace for all your agricultural input needs.</p>
          <div className="features-preview">
            <div className="feature">
              <FaShoppingCart className="feature-icon" />
              <p>Buy fertilizers, pesticides, motors, tools</p>
            </div>
            <div className="feature">
              <FaCheckCircle className="feature-icon" />
              <p>Verified brands with farmer reviews</p>
            </div>
            <div className="feature">
              <FaTractor className="feature-icon" />
              <p>Bulk pricing + delivery</p>
            </div>
            <div className="feature">
              <FaCalendarAlt className="feature-icon" />
              <p>AMC-linked auto refill</p>
            </div>
          </div>
          <button className="btn btn-primary">Get Notified When Ready</button>
        </div>
        <div className="coming-soon-image">
          <img src="https://media.gettyimages.com/id/1318237749/photo/female-farm-worker-using-digital-tablet-with-virtual-reality-artificial-intelligence-for.jpg?s=612x612&w=gi&k=20&c=TB5tXFr1kM7uWWKkHuv8ZtDyd-hDBQnaSvBeTXZ-77A=" alt="Agricultural Supplies" />
        </div>
      </div>
    </div>
  );
}

export default BuyInputsPage;