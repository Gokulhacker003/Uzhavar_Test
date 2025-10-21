import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';
import { Link } from 'react-router-dom';
import {  FaSeedling, FaClipboardList } from 'react-icons/fa';
import {  BsCalendarCheck } from 'react-icons/bs';
import '../App.css';
import {
  GiFarmTractor,
  GiPlantRoots,
} from 'react-icons/gi';
import { GiWoodenFence } from 'react-icons/gi';

function ManageFarmPage(props) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('monthly');
  // All modal state and handlers come from props
  const {
    showProjectForm,
    setShowProjectForm,
    projectForm,
    handleProjectInput,
    handleProjectSubmit,
    projectSubmitted,
    onOpenSoilTestModal
  } = props;
  
  return (
    <div className="manage-farm-page" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <section className="page-header" style={{ textAlign: 'center', width: '100%' }}>
        <h1 style={{ textAlign: 'center' }}><GiFarmTractor /> Manage My Farm</h1>
        <p style={{ color: '#388e3c', fontWeight: 'bold', textAlign: 'center' }}>For AMC (maintenance) and Projects</p>
      </section>
      
      <div className="farm-tabs" style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div className="tab-headers" style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
          <button 
            className={`tab-btn ${activeTab === 'monthly' ? 'active' : ''}`}
            style={{ background: activeTab === 'monthly' ? '#e3f2fd' : '#fff', color: '#1976d2', borderColor: '#1976d2' }}
            onClick={() => setActiveTab('monthly')}
          >
            <BsCalendarCheck /> Monthly AMC
          </button>
          <button 
            className={`tab-btn ${activeTab === 'fertilizer' ? 'active' : ''}`}
            style={{ background: activeTab === 'fertilizer' ? '#f1f8e9' : '#fff', color: '#388e3c', borderColor: '#388e3c' }}
            onClick={() => setActiveTab('fertilizer')}
          >
            <GiPlantRoots /> Fertilizer Plan
          </button>
          <button 
            className={`tab-btn ${activeTab === 'pruning' ? 'active' : ''}`}
            style={{ background: activeTab === 'pruning' ? '#fffde7' : '#fff', color: '#fbc02d', borderColor: '#fbc02d' }}
            onClick={() => setActiveTab('pruning')}
          >
            <FaSeedling /> Pruning & Pest Control
          </button>
          {/* Project Work tab fully removed as requested */}
          <button 
            className={`tab-btn ${activeTab === 'construction' ? 'active' : ''}`}
            style={{ background: activeTab === 'construction' ? '#ede7f6' : '#fff', color: '#512da8', borderColor: '#512da8' }}
            onClick={() => setActiveTab('construction')}
          >
            <GiWoodenFence /> Construction
          </button>
          <button 
            className={`tab-btn ${activeTab === 'reports' ? 'active' : ''}`}
            style={{ background: activeTab === 'reports' ? '#e0f7fa' : '#fff', color: '#00838f', borderColor: '#00838f' }}
            onClick={() => setActiveTab('reports')}
          >
            <FaClipboardList /> Reports & Approval
          </button>
        </div>
        
        <div className="tab-content">
          {activeTab === 'monthly' && (
            <div className="tab-pane">
              <h2>Monthly AMC (Annual Maintenance Contract)</h2>
              <p>Our structured monthly maintenance plans keep your farm in optimal condition year-round.</p>
              <div className="plan-cards">
                <div className="plan-card">
                  <h3>Basic Plan</h3>
                  <ul>
                    <li>Monthly farm visit</li>
                    <li>Basic irrigation check</li>
                    <li>Pest monitoring</li>
                    <li>Monthly report</li>
                  </ul>
                  <button className="btn btn-primary" onClick={() => navigate('/confirm-plan?type=basic')}>Select Plan</button>
                </div>
                <div className="plan-card featured">
                  <div className="featured-badge">Popular</div>
                  <h3>Standard Plan</h3>
                  <ul>
                    <li>Bi-weekly farm visit</li>
                    <li>Full irrigation maintenance</li>
                    <li>Pest control application</li>
                    <li>Fertilizer application</li>
                    <li>Detailed bi-weekly reports</li>
                  </ul>
                  <button className="btn btn-primary" onClick={() => navigate('/confirm-plan?type=standard')}>Select Plan</button>
                </div>
                <div className="plan-card">
                  <h3>Premium Plan</h3>
                  <ul>
                    <li>Weekly farm visit</li>
                    <li>Complete farm management</li>
                    <li>Advanced pest management</li>
                    <li>Customized fertilizer program</li>
                    <li>Weekly detailed reports</li>
                    <li>Priority support</li>
                  </ul>
                  <button className="btn btn-primary" onClick={() => navigate('/confirm-plan?type=premium')}>Select Plan</button>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'fertilizer' && (
            <div className="tab-pane">
              <h2>Fertilizer Plan</h2>
              <p>Custom fertilizer scheduling based on crop needs and seasonal conditions.</p>
              <div className="fertilizer-content">
                <div className="fertilizer-image">
                  <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS9r6-1--iDfA2DNKl5-VDVJd6rXMKskzmw3Q&s" alt="Fertilizer Application" />
                </div>
                <div className="fertilizer-info">
                  <h3>Weather-Synced Fertilizer Application</h3>
                  <p>Our system automatically adjusts your fertilizer schedule based on weather forecasts and soil conditions.</p>
                  <ul>
                    <li>Soil testing and analysis</li>
                    <li>Custom nutrient programs</li>
                    <li>Seasonal adjustments</li>
                    <li>Organic and conventional options</li>
                  </ul>
                  <button className="btn btn-primary" onClick={onOpenSoilTestModal}>Schedule Soil Test</button>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'pruning' && (
            <div className="tab-pane">
              <h2>Pruning & Pest Control</h2>
              <p>Maintain healthy growth and protect your crops from pests.</p>
              <div className="service-details">
                <div className="service-image">
                  <img src="https://naturescompanionlandscaping.com/wp-content/uploads/2024/05/General-Landscape-Maintenance.jpg" alt="Pruning & Pest Control" />
                </div>
                <div className="service-text">
                  <h3>Expert Pruning Services</h3>
                  <p>Our trained teams use proper techniques to encourage healthy growth and maximum yield.</p>
                  <ul>
                    <li>Seasonal maintenance pruning</li>
                    <li>Structural pruning for young trees</li>
                    <li>Rejuvenation pruning for older plants</li>
                    <li>Post-harvest pruning</li>
                  </ul>
                </div>
              </div>
              <div className="service-details reversed">
                <div className="service-text">
                  <h3>Integrated Pest Management</h3>
                  <p>Our pest management program uses eco-friendly solutions and expert monitoring to keep your crops healthy.</p>
                </div>
              </div>
            </div>
          )}
          {activeTab === 'construction' && (
            <div className="tab-pane">
              <h2>Construction Services</h2>
              <p>Build essential farm infrastructure with our experienced construction teams.</p>
              <div className="construction-items">
                <div className="construction-item">
                  <img src="https://images.unsplash.com/photo-1584622650111-993a426fbf0a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" alt="Water Tank" />
                  <h3>Water Tanks</h3>
                  <p>Storage solutions for irrigation needs.</p>
                </div>
                <div className="construction-item">
                  <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTg2IXEk5YgEjt7HWuPiCCxdDdIJoDNbTpM7Q&s" alt="Storage Shed" />
                  <h3>Storage Sheds</h3>
                  <p>Protect equipment and harvest.</p>
                </div>
                <div className="construction-item">
                  <img src="https://images.unsplash.com/photo-1564501049412-61c2a3083791?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" alt="Farmhouse" />
                  <h3>Farmhouses</h3>
                  <p>Comfortable on-farm living spaces.</p>
                </div>
              </div>
              <Link to="/construction" className="btn btn-primary center-btn">View All Construction Services</Link>
            </div>
          )}
          
          {activeTab === 'reports' && (
            <div className="tab-pane">
              <h2>Reports & Approval Logs</h2>
              <p>Track all farm activities with detailed documentation.</p>
              <div className="reports-demo">
                <div className="reports-image">
                  <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" alt="Reports Dashboard" />
                </div>
                <div className="reports-features">
                  <h3>Our Reporting System Includes:</h3>
                  <ul>
                    <li>Photo documentation of all work</li>
                    <li>Task completion timestamps</li>
                    <li>Worker performance metrics</li>
                    <li>Material usage tracking</li>
                    <li>Weather condition logs</li>
                    <li>Digital approval systems</li>
                    <li>Monthly summary reports</li>
                  </ul>
                  {/* View Sample Report button removed as requested */}
                </div>
              </div>
              <div className="approval-system">
                <h3>Easy Approval System</h3>
                <p>Review and approve work through our app or WhatsApp messages.</p>
                <div className="approval-demo">
                  <div className="approval-step">
                    <div className="step-number">1</div>
                    <p>Receive notification of completed work</p>
                  </div>
                  <div className="approval-step">
                    <div className="step-number">2</div>
                    <p>View photos and details</p>
                  </div>
                  <div className="approval-step">
                    <div className="step-number">3</div>
                    <p>Approve or request changes</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="farm-cta">
        <div className="cta-buttons">
          <button className="btn btn-primary" onClick={() => setActiveTab('monthly')}>Start AMC</button>
          <button className="btn btn-primary" onClick={() => setShowProjectForm(true)}>Book Project</button>
          <Link to="/farm-details" className="btn btn-primary" style={{marginLeft:'1em',background:'#388e3c',color:'#fff'}}>Upload My Farm Details</Link>
        </div>
        {showProjectForm && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h2>Book a Project</h2>
              <form onSubmit={handleProjectSubmit} className="project-form">
                <div className="form-group">
                  <label>Name</label>
                  <input type="text" name="name" value={projectForm.name} onChange={handleProjectInput} required pattern="^[A-Za-z ]+$" title="Name should contain only letters and spaces" />
                </div>
                <div className="form-group">
                  <label>Phone</label>
                  <input type="tel" name="phone" value={projectForm.phone} onChange={handleProjectInput} required pattern="^[0-9]{10}$" maxLength="10" title="Enter a valid 10-digit phone number" />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input type="email" name="email" value={projectForm.email} onChange={handleProjectInput} required />
                </div>
                <div className="form-group">
                  <label>Project Type</label>
                  <select name="projectType" value={projectForm.projectType} onChange={handleProjectInput} required>
                    <option value="">Select Type</option>
                    <option value="Fencing">Fencing</option>
                    <option value="Drip Irrigation">Drip Irrigation</option>
                    <option value="Plantation">Plantation</option>
                    <option value="Land Preparation">Land Preparation</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea name="description" value={projectForm.description} onChange={handleProjectInput} rows="3" required maxLength="500" title="Describe your project (max 500 characters)" />
                </div>
                <div className="form-actions">
                  <button type="submit" className="btn btn-primary">Submit</button>
                  <button type="button" className="btn btn-secondary" onClick={() => setShowProjectForm(false)}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}
        {projectSubmitted && (
          <div className="project-success">
            <p>Thank you! Your project request has been submitted.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ManageFarmPage;