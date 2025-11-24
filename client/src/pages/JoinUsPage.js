import React, { useState, useEffect } from "react";
import "leaflet/dist/leaflet.css";
import { apiUrl } from '../api';
import { FaUser, FaMapMarkerAlt, FaUserFriends, FaSeedling, FaTools } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import '../i18n';

export default function JoinUsPage() {
  const { i18n } = useTranslation();
  
  // Sync with parent language selection
  useEffect(() => {
    const savedLang = localStorage.getItem('selectedLang') || 'en';
    if (i18n.language !== savedLang) {
      i18n.changeLanguage(savedLang);
    }
  }, [i18n]);
  const [userType, setUserType] = useState('');
  const [formData, setFormData] = useState({
    // Common fields
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    
    // Farmer specific
    farmName: '',
    farmSize: '',
    cropTypes: '',
    farmingExperience: '',
    irrigationType: '',
    currentChallenges: '',
    
    // Worker/Contractor specific
    workerType: '',
    experience: '',
    skills: '',
    vehicleOwned: '',
    availability: '',
    previousWork: '',
    idProof: '',
    expectedSalary: ''
  });

  const [errors, setErrors] = useState({});
  const [submitStatus, setSubmitStatus] = useState({ show: false, success: false, message: '' });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Common validations
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state.trim()) newErrors.state = 'State is required';
    if (!formData.pincode.trim()) newErrors.pincode = 'Pincode is required';
    
    // Email validation
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    // Phone validation
    if (formData.phone && !/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }
    
    if (userType === 'farmer') {
      if (!formData.farmName.trim()) newErrors.farmName = 'Farm name is required';
      if (!formData.farmSize.trim()) newErrors.farmSize = 'Farm size is required';
      if (!formData.cropTypes.trim()) newErrors.cropTypes = 'Crop types are required';
      if (!formData.farmingExperience.trim()) newErrors.farmingExperience = 'Farming experience is required';
    } else if (userType === 'worker') {
      if (!formData.workerType.trim()) newErrors.workerType = 'Worker type is required';
      if (!formData.experience.trim()) newErrors.experience = 'Experience is required';
      if (!formData.skills.trim()) newErrors.skills = 'Skills are required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      // Prepare email data
      const emailData = {
        formType: userType === 'farmer' ? 'Register as Farmer' : 'Register as Worker/Contractor',
        name: formData.fullName,
        phone: formData.phone,
        email: formData.email,
        message: `New ${userType} registration`,
        extra: {
          'User Type': userType,
          'Full Name': formData.fullName,
          'Email': formData.email,
          'Phone': formData.phone,
          'Address': formData.address,
          'City': formData.city,
          'State': formData.state,
          'Pincode': formData.pincode,
          ...(userType === 'farmer' && {
            'Farm Name': formData.farmName,
            'Farm Size': formData.farmSize,
            'Crop Types': formData.cropTypes,
            'Farming Experience': formData.farmingExperience,
            'Irrigation Type': formData.irrigationType,
            'Current Challenges': formData.currentChallenges
          }),
          ...(userType === 'worker' && {
            'Worker Type': formData.workerType,
            'Experience': formData.experience,
            'Skills': formData.skills,
            'Vehicle Owned': formData.vehicleOwned,
            'Availability': formData.availability,
            'Previous Work': formData.previousWork,
            'Expected Salary': formData.expectedSalary
          })
        }
      };

      // Send email to Google Sheets
      fetch(apiUrl('/api/send-email'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(emailData)
      })
      .then(res => res.json())
      .then(emailResult => {
        console.log('Registration submitted successfully:', emailResult);
        // Check if there's an error in the response
        if (emailResult.error) {
          console.error('Server error:', emailResult.error);
          setSubmitStatus({
            show: true,
            success: false,
            message: 'Registration submitted, but there was an issue. Please contact us if you don\'t receive confirmation.'
          });
        } else {
          setSubmitStatus({
            show: true,
            success: true,
            message: `Thank you! Your registration as a ${userType} has been submitted successfully. We'll contact you soon.`
          });
          // Reset form after 3 seconds
          setTimeout(() => {
            resetForm();
            setSubmitStatus({ show: false, success: false, message: '' });
          }, 3000);
        }
      })
      .catch(err => {
        console.error('Failed to submit registration:', err);
        setSubmitStatus({
          show: true,
          success: false,
          message: 'There was a network error. Please check your connection and try again.'
        });
      });
    }
  };

  const resetForm = () => {
    setUserType('');
    setFormData({
      fullName: '', email: '', phone: '', address: '', city: '', state: '', pincode: '',
      farmName: '', farmSize: '', cropTypes: '', farmingExperience: '', irrigationType: '', currentChallenges: '',
      workerType: '', experience: '', skills: '', vehicleOwned: '', availability: '', previousWork: '', idProof: '', expectedSalary: ''
    });
    setErrors({});
    setSubmitStatus({ show: false, success: false, message: '' });
  };

  if (!userType) {
    return (
      <div className="join-us-page notranslate">
        <section className="page-header">
          <h1><FaUserFriends /> {i18n.language === 'ta' ? 'உழவர் கனெக்ட்டில் சேருங்கள்' : 'Join Uzhavar Connect'}</h1>
          <p>{i18n.language === 'ta' ? 'தொடங்க உங்கள் பதிவு வகையைத் தேர்ந்தெடுக்கவும்' : 'Choose your registration type to get started'}</p>
        </section>
        
        <div className="join-sections">
          <div className="join-section farmers">
            <div className="join-content" style={{ textAlign: 'center' }}>
              <h2 style={{ textAlign: 'center' }}>
                <FaSeedling /> {i18n.language === 'ta' ? 'விவசாயியாக பதிவு செய்யுங்கள்' : 'Register as Farmer'}
              </h2>
              <p style={{ textAlign: 'center' }}>
                {i18n.language === 'ta' ? 'விவசாய சேவைகளுடன் இணைந்து உங்கள் விவசாய வணிகத்தை வளர்த்துக்கொள்ளுங்கள்' : 'Connect with agricultural services and grow your farming business'}
              </p>
              <ul style={{ display: 'inline-block', textAlign: 'left', margin: '20px auto' }}>
                <li>{i18n.language === 'ta' ? 'தனிப்பயனாக்கப்பட்ட விவசாய தீர்வுகளைப் பெறுங்கள்' : 'Get customized farming solutions'}</li>
                <li>{i18n.language === 'ta' ? 'நவீன விவசாய நுட்பங்களுக்கான அணுகல்' : 'Access to modern agricultural techniques'}</li>
                <li>{i18n.language === 'ta' ? 'சேவை வழங்குநர்களுடன் நேரடி இணைப்பு' : 'Direct connection with service providers'}</li>
                <li>{i18n.language === 'ta' ? 'செயலி அல்லது வாட்ஸ்அப் வழியாக முன்னேற்றத்தைக் கண்காணிக்கவும்' : 'Track progress via app or WhatsApp'}</li>
              </ul>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                <button 
                  className="btn btn-primary" 
                  onClick={() => setUserType('farmer')}
                >
                  {i18n.language === 'ta' ? 'விவசாயியாக பதிவு செய்யுங்கள்' : 'Register as Farmer'}
                </button>
              </div>
            </div>
            <div className="join-image">
              <img src="https://media.istockphoto.com/id/1330214199/photo/indian-farmer-busy-using-mobile-phone-while-sitting-in-between-the-crop-seedlings-inside.jpg?s=612x612&w=0&k=20&c=PmGOwjZlQdOhETmjVwBoT4thL3mJn3VfEm5q9doj4aU=" alt="Farmer Using App" />
            </div>
          </div>
          
          <div className="join-section workers">
            <div className="join-image">
              <img src="https://pub-b47a7c74540d40228598178154fb4b56.r2.dev/2023/10/Azure-OpenAI-Service-India-blog-hero.jpg" alt="Farm Workers" />
            </div>
            <div className="join-content" style={{ textAlign: 'center' }}>
              <h2 style={{ textAlign: 'center' }}>
                <FaTools /> {i18n.language === 'ta' ? 'தொழிலாளி/ஒப்பந்ததாரராக பதிவு செய்யுங்கள்' : 'Register as Worker/Contractor'}
              </h2>
              <p style={{ textAlign: 'center' }}>
                {i18n.language === 'ta' ? 'திறமையான விவசாய வல்லுநர்களின் எங்கள் வலையமைப்பில் சேருங்கள்' : 'Join our network of skilled agricultural professionals'}
              </p>
              <ul style={{ display: 'inline-block', textAlign: 'left', margin: '20px auto' }}>
                <li>{i18n.language === 'ta' ? 'முடிக்கப்பட்ட வேலைக்கான வாராந்திர கொடுப்பனவுகள்' : 'Weekly payments for completed work'}</li>
                <li>{i18n.language === 'ta' ? 'செயல்திறன் அடிப்படையிலான வேலை வாய்ப்புகள்' : 'Performance-based job opportunities'}</li>
                <li>{i18n.language === 'ta' ? 'பயிற்சி மற்றும் திறன் மேம்பாடு' : 'Training and skill development'}</li>
                <li>{i18n.language === 'ta' ? 'நெகிழ்வான பணி ஏற்பாடுகள்' : 'Flexible working arrangements'}</li>
              </ul>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                <button 
                  className="btn btn-primary" 
                  onClick={() => setUserType('worker')}
                >
                  {i18n.language === 'ta' ? 'தொழிலாளி/ஒப்பந்ததாரராக பதிவு செய்யுங்கள்' : 'Register as Worker/Contractor'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="join-us-page notranslate">
      <section className="page-header">
        <h1>
          {userType === 'farmer' ? <FaSeedling /> : <FaTools />}
          {userType === 'farmer' 
            ? (i18n.language === 'ta' ? 'விவசாயி பதிவு' : 'Farmer Registration')
            : (i18n.language === 'ta' ? 'தொழிலாளி/ஒப்பந்ததாரர் பதிவு' : 'Worker/Contractor Registration')
          }
        </h1>
        <p>{i18n.language === 'ta' ? 'தயவுசெய்து அனைத்து தேவையான தகவல்களையும் நிரப்பவும்' : 'Please fill out all required information'}</p>
        <button 
          onClick={resetForm}
          style={{
            background: 'none',
            border: '1px solid #ccc',
            padding: '8px 16px',
            borderRadius: '4px',
            cursor: 'pointer',
            marginTop: '10px'
          }}
        >
          ← Change Registration Type
        </button>
      </section>

      <div className="join-sections">
        <div className="join-section" style={{flexDirection: 'column', maxWidth: '800px', margin: '0 auto'}}>
          <div className="registration-form">
            
            {/* Personal Information Section */}
            <div className="form-section">
              <h3><FaUser /> Personal Information</h3>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="fullName">Full Name *</label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className={errors.fullName ? 'error' : ''}
                    placeholder="Enter your full name"
                  />
                  {errors.fullName && <span className="error-message">{errors.fullName}</span>}
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email Address *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={errors.email ? 'error' : ''}
                    placeholder="Enter your email"
                  />
                  {errors.email && <span className="error-message">{errors.email}</span>}
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="phone">Phone Number *</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={errors.phone ? 'error' : ''}
                    placeholder="10-digit mobile number"
                    maxLength="10"
                  />
                  {errors.phone && <span className="error-message">{errors.phone}</span>}
                </div>
                <div className="form-group">
                  <label htmlFor="pincode">Pincode *</label>
                  <input
                    type="text"
                    id="pincode"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleInputChange}
                    className={errors.pincode ? 'error' : ''}
                    placeholder="Enter pincode"
                    maxLength="6"
                  />
                  {errors.pincode && <span className="error-message">{errors.pincode}</span>}
                </div>
              </div>
            </div>

            {/* Address Information Section */}
            <div className="form-section">
              <h3><FaMapMarkerAlt /> Address Information</h3>
              <div className="form-group">
                <label htmlFor="address">Full Address *</label>
                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className={errors.address ? 'error' : ''}
                  placeholder="Enter your complete address"
                  rows="3"
                />
                {errors.address && <span className="error-message">{errors.address}</span>}
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="city">City *</label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className={errors.city ? 'error' : ''}
                    placeholder="Enter city"
                  />
                  {errors.city && <span className="error-message">{errors.city}</span>}
                </div>
                <div className="form-group">
                  <label htmlFor="state">State *</label>
                  <select
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    className={errors.state ? 'error' : ''}
                  >
                    <option value="">Select State</option>
                    <option value="Tamil Nadu">Tamil Nadu</option>
                    <option value="Karnataka">Karnataka</option>
                    <option value="Kerala">Kerala</option>
                    <option value="Andhra Pradesh">Andhra Pradesh</option>
                    <option value="Telangana">Telangana</option>
                    <option value="Other">Other</option>
                  </select>
                  {errors.state && <span className="error-message">{errors.state}</span>}
                </div>
              </div>
            </div>

            {/* Farmer Specific Fields */}
            {userType === 'farmer' && (
              <div className="form-section">
                <h3><FaSeedling /> Farm Information</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="farmName">Farm Name *</label>
                    <input
                      type="text"
                      id="farmName"
                      name="farmName"
                      value={formData.farmName}
                      onChange={handleInputChange}
                      className={errors.farmName ? 'error' : ''}
                      placeholder="Enter your farm name"
                    />
                    {errors.farmName && <span className="error-message">{errors.farmName}</span>}
                  </div>
                  <div className="form-group">
                    <label htmlFor="farmSize">Farm Size (in acres) *</label>
                    <input
                      type="text"
                      id="farmSize"
                      name="farmSize"
                      value={formData.farmSize}
                      onChange={handleInputChange}
                      className={errors.farmSize ? 'error' : ''}
                      placeholder="e.g., 5 acres"
                    />
                    {errors.farmSize && <span className="error-message">{errors.farmSize}</span>}
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="cropTypes">Primary Crops *</label>
                    <input
                      type="text"
                      id="cropTypes"
                      name="cropTypes"
                      value={formData.cropTypes}
                      onChange={handleInputChange}
                      className={errors.cropTypes ? 'error' : ''}
                      placeholder="e.g., Empty, Coconut, Mango"
                    />
                    {errors.cropTypes && <span className="error-message">{errors.cropTypes}</span>}
                  </div>
                  <div className="form-group">
                    <label htmlFor="farmingExperience">Farming Experience *</label>
                    <select
                      id="farmingExperience"
                      name="farmingExperience"
                      value={formData.farmingExperience}
                      onChange={handleInputChange}
                      className={errors.farmingExperience ? 'error' : ''}
                    >
                      <option value="">Select Experience</option>
                      <option value="0-2 years">0-2 years</option>
                      <option value="3-5 years">3-5 years</option>
                      <option value="6-10 years">6-10 years</option>
                      <option value="10+ years">10+ years</option>
                    </select>
                    {errors.farmingExperience && <span className="error-message">{errors.farmingExperience}</span>}
                  </div>
                </div>
                
                
                
                <div className="form-group">
                  <label htmlFor="currentChallenges">Current Farming Challenges</label>
                  <textarea
                    id="currentChallenges"
                    name="currentChallenges"
                    value={formData.currentChallenges}
                    onChange={handleInputChange}
                    placeholder="Describe any current challenges you face in farming"
                    rows="3"
                  />
                </div>
              </div>
            )}

            {/* Worker/Contractor Specific Fields */}
            {userType === 'worker' && (
              <div className="form-section">
                <h3><FaTools /> Professional Information</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="workerType">Worker Type *</label>
                    <select
                      id="workerType"
                      name="workerType"
                      value={formData.workerType}
                      onChange={handleInputChange}
                      className={errors.workerType ? 'error' : ''}
                    >
                      <option value="">Select Worker Type</option>
                      <option value="Sprayer">Sprayer</option>
                      <option value="Fencer">Fencer</option>
                      <option value="Driver">Driver</option>
                      <option value="Tractor Operator">Tractor Operator</option>
                      <option value="Harvesting Contractor">Harvesting Contractor</option>
                      <option value="General Farm Worker">General Farm Worker</option>
                      <option value="Irrigation Specialist">Irrigation Specialist</option>
                      <option value="Other">Other</option>
                    </select>
                    {errors.workerType && <span className="error-message">{errors.workerType}</span>}
                  </div>
                  <div className="form-group">
                    <label htmlFor="experience">Experience *</label>
                    <select
                      id="experience"
                      name="experience"
                      value={formData.experience}
                      onChange={handleInputChange}
                      className={errors.experience ? 'error' : ''}
                    >
                      <option value="">Select Experience</option>
                      <option value="0-1 years">0-1 years</option>
                      <option value="1-3 years">1-3 years</option>
                      <option value="3-5 years">3-5 years</option>
                      <option value="5-10 years">5-10 years</option>
                      <option value="10+ years">10+ years</option>
                    </select>
                    {errors.experience && <span className="error-message">{errors.experience}</span>}
                  </div>
                </div>
                
                <div className="form-group">
                  <label htmlFor="skills">Skills & Expertise *</label>
                  <textarea
                    id="skills"
                    name="skills"
                    value={formData.skills}
                    onChange={handleInputChange}
                    className={errors.skills ? 'error' : ''}
                    placeholder="Describe your skills and areas of expertise"
                    rows="3"
                  />
                  {errors.skills && <span className="error-message">{errors.skills}</span>}
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="vehicleOwned">Vehicle Owned</label>
                    <select
                      id="vehicleOwned"
                      name="vehicleOwned"
                      value={formData.vehicleOwned}
                      onChange={handleInputChange}
                    >
                      <option value="">Select Vehicle</option>
                      <option value="Four Wheeler">Four Wheeler</option>
                      <option value="Tractor">Tractor</option>
                      <option value="None">None</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="availability">Availability</label>
                    <select
                      id="availability"
                      name="availability"
                      value={formData.availability}
                      onChange={handleInputChange}
                    >
                      <option value="">Select Availability</option>
                      <option value="Full Time">Full Time</option>
                      <option value="Part Time">Part Time</option>
                      <option value="Seasonal">Seasonal</option>
                      <option value="Weekend Only">Weekend Only</option>
                    </select>
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="expectedSalary">Expected Daily Rate (₹)</label>
                    <input
                      type="number"
                      id="expectedSalary"
                      name="expectedSalary"
                      value={formData.expectedSalary}
                      onChange={handleInputChange}
                      placeholder="Enter expected daily rate"
                      min="0"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="idProof">ID Proof Type</label>
                    <select
                      id="idProof"
                      name="idProof"
                      value={formData.idProof}
                      onChange={handleInputChange}
                    >
                      <option value="">Select ID Proof</option>
                      <option value="Aadhaar Card">Aadhaar Card</option>
                      <option value="Driving License">Driving License</option>
                      <option value="Voter ID">Voter ID</option>
                      <option value="PAN Card">PAN Card</option>
                      <option value="Passport">Passport</option>
                    </select>
                  </div>
                </div>
                
                <div className="form-group">
                  <label htmlFor="previousWork">Previous Work Experience</label>
                  <textarea
                    id="previousWork"
                    name="previousWork"
                    value={formData.previousWork}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="form-section">
              <button 
                type="button" 
                onClick={handleSubmit} 
                className="btn btn-primary" 
                style={{
                  width: '100%', 
                  padding: '15px', 
                  fontSize: '18px',
                  transition: 'all 0.3s ease'
                }}
                disabled={submitStatus.show && submitStatus.success}
              >
                {submitStatus.show && submitStatus.success 
                  ? 'Registration Submitted ✓' 
                  : (userType === 'farmer' ? 'Register My Farm' : 'Apply as Partner')
                }
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modern Toast Notification - Top Right Corner */}
      {submitStatus.show && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          zIndex: 9999,
          minWidth: '320px',
          maxWidth: '400px',
          background: 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(10px)',
          border: `3px solid ${submitStatus.success ? '#4CAF50' : '#f44336'}`,
          borderRadius: '12px',
          boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
          overflow: 'hidden',
          animation: 'toastSlideIn 0.5s ease-out'
        }}>
          {/* Colored header bar */}
          <div style={{
            background: submitStatus.success 
              ? 'linear-gradient(135deg, #4CAF50 0%, #81C784 100%)'
              : 'linear-gradient(135deg, #f44336 0%, #e57373 100%)',
            padding: '1em 1.5em',
            display: 'flex',
            alignItems: 'center',
            gap: '1em'
          }}>
            <div style={{
              fontSize: '2em',
              animation: 'scaleIn 0.5s ease-out'
            }}>
              {submitStatus.success ? '✓' : '✕'}
            </div>
            <div>
              <h4 style={{ margin: 0, color: 'white', fontSize: '1.1em', fontWeight: 600 }}>
                {submitStatus.success ? 'Success!' : 'Error'}
              </h4>
            </div>
          </div>

          {/* Message content */}
          <div style={{
            padding: '1.5em',
            color: '#333',
            fontSize: '0.95em',
            lineHeight: '1.6'
          }}>
            {submitStatus.message}
          </div>

          {/* Progress bar */}
          {submitStatus.success && (
            <div style={{
              height: '4px',
              background: '#e0e0e0',
              overflow: 'hidden'
            }}>
              <div style={{
                height: '100%',
                background: submitStatus.success ? '#4CAF50' : '#f44336',
                animation: 'progressBar 3s linear'
              }} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}