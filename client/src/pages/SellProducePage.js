import { MdSell } from "react-icons/md";
import { FaImage,FaHandshake, FaClipboardList,FaCheckCircle,FaFileAlt } from "react-icons/fa";

function SellProducePage() {
  return (
    <div className="sell-produce-page">
      <section className="page-header">
        <h1><MdSell /> Sell My Produce – Uzhavar Bazaar</h1>
        <div className="phase-badge">Phase 2 – Under Construction</div>
      </section>
      
      <div className="coming-soon">
        <div className="coming-soon-image">
          <img src="https://img.freepik.com/premium-photo/indian-vegetable-market-seller-with-lush-fresh-produce_1174497-154470.jpg" alt="Farm Fresh Produce" />
        </div>
        <div className="coming-soon-content">
          <h2>Coming Soon!</h2>
          <p>We're creating a marketplace to connect farmers directly with buyers.</p>
          <div className="features-preview">
            <div className="feature">
              <FaImage className="feature-icon" />
              <p>Upload crop photos</p>
            </div>
            <div className="feature">
              <FaHandshake className="feature-icon" />
              <p>Grading & Buyer Matching</p>
            </div>
            <div className="feature">
              <FaClipboardList className="feature-icon" />
              <p>Market Price Comparison</p>
            </div>
            <div className="feature">
              <FaCheckCircle className="feature-icon" />
              <p>Instant Payment Status</p>
            </div>
            <div className="feature">
              <FaFileAlt className="feature-icon" />
              <p>APEDA / FPC / Invoice help</p>
            </div>
          </div>
          <button className="btn btn-primary">Get Notified When Ready</button>
        </div>
      </div>
    </div>
  );
}

export default SellProducePage;