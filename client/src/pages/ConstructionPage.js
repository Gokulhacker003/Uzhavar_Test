import 'leaflet/dist/leaflet.css';
import { Link } from 'react-router-dom';
import {  FaMapMarkerAlt } from 'react-icons/fa';
import { MdOutlineConstruction } from 'react-icons/md';
import { useState, useEffect } from 'react';
import '../App.css';
import fencingImg from '../assert/fencing.jpg';
import farmhouseImg from '../assert/FArmhouse.jpeg'
import poolImg from '../assert/Swimmingpool.jpeg'
import tankImg from '../assert/tank.jpeg'
import polyhouseImg from '../assert/polly.jpeg'
import shedImg from '../assert/goat.jpg'
import projects from '../data/projects';

function ConstructionPage() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [folders, setFolders] = useState([]);

  // Define folder categories with icons and colors
  const folderCategories = [
    { 
      id: 'all-projects', 
      name: 'All Projects', 
      icon: '📂', 
      color: '#9C27B0',
      description: 'View all construction projects'
    }
  ];

  // Load gallery images organized by folders
  useEffect(() => {
    // Get all images for "All Projects" folder
    const allImages = [
      { id: 1, src: process.env.PUBLIC_URL + '/assert/RENTAL1.jpg', title: 'Construction Project 1' },
      { id: 2, src: process.env.PUBLIC_URL + '/assert/RENTAL2.jpg', title: 'Construction Project 2' },
      { id: 3, src: process.env.PUBLIC_URL + '/assert/RENTAL3.jpg', title: 'Construction Project 3' },
      { id: 4, src: process.env.PUBLIC_URL + '/assert/RENTAL4.jpg', title: 'Construction Project 4' },
      { id: 5, src: process.env.PUBLIC_URL + '/assert/RENTAL5.jpg', title: 'Construction Project 5' },
      { id: 6, src: process.env.PUBLIC_URL + '/assert/RENTAL6.jpg', title: 'Construction Project 6' },
      { id: 7, src: process.env.PUBLIC_URL + '/assert/RENTAL7.jpg', title: 'Construction Project 7' },
      { id: 8, src: process.env.PUBLIC_URL + '/assert/RENTAL8.jpg', title: 'Construction Project 8' },
      { id: 9, src: process.env.PUBLIC_URL + '/assert/RENTAL9.jpg', title: 'Construction Project 9' }
    ];

    const organizedFolders = [
      {
        id: 'all-projects',
        images: allImages
      }
    ];

    setFolders(organizedFolders);
  }, []);

  return (
    <div className="construction-page">
      <section className="page-header">
        <h1><MdOutlineConstruction /> Construction Services</h1>
        <p>Quality infrastructure for your farm with professional teams</p>
      </section>
      
      <section className="construction-intro">
        <div className="intro-content">
          <h2>Farm Infrastructure Experts</h2>
          <p>From water storage to living spaces, we build the facilities your farm needs to thrive.</p>
          <p>All our construction projects come with:</p>
          <ul>
            <li>Detailed planning and estimation</li>
            <li>Quality materials</li>
            <li>Professional construction teams</li>
            <li>Regular progress updates</li>
            <li>Photo documentation</li>
            <li>Transparent billing</li>
          </ul>
          {/* Top Request Quote button removed as requested */}
        </div>
        <div className="intro-image">
          <img src="https://images.unsplash.com/photo-1531834685032-c34bf0d84c77?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" alt="Farm Construction" />
        </div>
      </section>

      
      <section className="construction-services">
        <h2>Our Construction Services</h2>
        <div className="service-cards">
          <div className="service-card">
        <img src={farmhouseImg} alt="Farmhouse" />
        <h3>Farmhouses</h3>
        <p>Elegant farm living with modern comforts.</p>
        <p>Perfect for retreats or permanent residence.</p>
      </div>

      <div className="service-card">
        <img src={poolImg} alt="Swimming Pool" />
        <h3>Swimming Pools</h3>
        <p>Luxury pools designed for relaxation & fun.</p>
        <p>Durable, stylish, and low-maintenance.</p>
      </div>

      <div className="service-card">
        <img src={tankImg} alt="Water Tanks" />
        <h3>Water Tanks</h3>
        <p>Reliable storage for irrigation & livestock.</p>
        <p>Built strong, lasting through all seasons.</p>
      </div>

      <div className="service-card">
        <img src={fencingImg} alt="Fencing" />
        <h3>Fencing</h3>
        <p>Secure & durable fencing solutions.</p>
        <p>Protect crops, livestock, and property.</p>
      </div>

      <div className="service-card">
        <img src={polyhouseImg} alt="Polyhouse" />
        <h3>Polyhouse</h3>
        <p>Climate-controlled farming spaces.</p>
        <p>Boosts yield with advanced technology.</p>
      </div>

      <div className="service-card">
        <img src={shedImg} alt="Cow & Goat Shed" />
        <h3>Cow & Goat Sheds</h3>
        <p>Hygienic, ventilated, and durable shelters.</p>
        <p>Designed for animal comfort & health.</p>
      </div>
        </div>
      </section>
      
      <section className="construction-cta">
        <h2>Ready to Start Your Construction Project?</h2>
        <div className="cta-buttons">
          <Link to="/request-quote" className="btn btn-primary">Request Quote</Link>
          {/* See Past Constructions button removed as requested */}
        </div>
      </section>

      {/* Construction Gallery with Folder System */}
      <section style={{
        padding: '4em 2em',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        margin: '2em 0'
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3em' }}>
            <h2 style={{
              color: 'white',
              fontSize: '2.5em',
              marginBottom: '0.5em',
              fontWeight: 700,
              textShadow: '2px 2px 8px rgba(0,0,0,0.3)'
            }}>
              📁 Construction Projects Gallery
            </h2>
            <p style={{
              fontSize: '1.2em',
              color: 'rgba(255,255,255,0.9)',
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              Browse our projects organized by category
            </p>
          </div>

          {/* Folder View */}
          {!selectedFolder && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '2em',
              padding: '0 1em'
            }}>
              {folderCategories.map(folder => {
                const folderData = folders.find(f => f.id === folder.id);
                const imageCount = folderData ? folderData.images.length : 0;
                
                return (
                  <div
                    key={folder.id}
                    onClick={() => setSelectedFolder(folder)}
                    style={{
                      background: 'white',
                      borderRadius: '20px',
                      padding: '2em',
                      cursor: 'pointer',
                      boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                      textAlign: 'center',
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-10px) scale(1.03)';
                      e.currentTarget.style.boxShadow = '0 20px 50px rgba(0,0,0,0.3)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0) scale(1)';
                      e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.2)';
                    }}
                  >
                    {/* Colored background accent */}
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '8px',
                      background: folder.color
                    }} />

                    {/* Folder Icon */}
                    <div style={{
                      fontSize: '4em',
                      marginBottom: '0.3em',
                      filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))'
                    }}>
                      {folder.icon}
                    </div>

                    {/* Folder Name */}
                    <h3 style={{
                      margin: '0.5em 0',
                      color: '#333',
                      fontSize: '1.3em',
                      fontWeight: 600
                    }}>
                      {folder.name}
                    </h3>

                    {/* Description */}
                    <p style={{
                      color: '#666',
                      fontSize: '0.95em',
                      margin: '0.5em 0 1em',
                      minHeight: '40px'
                    }}>
                      {folder.description}
                    </p>

                    {/* Image Count Badge */}
                    <div style={{
                      display: 'inline-block',
                      background: folder.color,
                      color: 'white',
                      padding: '0.5em 1.5em',
                      borderRadius: '20px',
                      fontSize: '0.9em',
                      fontWeight: 600,
                      boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                    }}>
                      📷 {imageCount} {imageCount === 1 ? 'Image' : 'Images'}
                    </div>

                    {/* Hover indicator */}
                    <div style={{
                      marginTop: '1.5em',
                      color: folder.color,
                      fontSize: '0.9em',
                      fontWeight: 600,
                      opacity: 0.8
                    }}>
                      Click to open →
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Images View (when folder is selected) */}
          {selectedFolder && (
            <div>
              {/* Back Button and Header */}
              <div style={{
                marginBottom: '2em',
                display: 'flex',
                alignItems: 'center',
                gap: '1em',
                flexWrap: 'wrap'
              }}>
                <button
                  onClick={() => setSelectedFolder(null)}
                  style={{
                    background: 'white',
                    color: selectedFolder.color,
                    border: 'none',
                    padding: '1em 2em',
                    borderRadius: '12px',
                    fontSize: '1em',
                    fontWeight: 600,
                    cursor: 'pointer',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5em'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateX(-5px)';
                    e.target.style.boxShadow = '0 6px 20px rgba(0,0,0,0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateX(0)';
                    e.target.style.boxShadow = '0 4px 15px rgba(0,0,0,0.2)';
                  }}
                >
                  ← Back to Folders
                </button>
                
                <div style={{
                  flex: 1,
                  background: 'rgba(255,255,255,0.95)',
                  padding: '1em 2em',
                  borderRadius: '12px',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
                }}>
                  <h3 style={{
                    margin: 0,
                    color: selectedFolder.color,
                    fontSize: '1.5em',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5em'
                  }}>
                    <span style={{ fontSize: '1.2em' }}>{selectedFolder.icon}</span>
                    {selectedFolder.name}
                  </h3>
                </div>
              </div>

              {/* Images Grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '2em',
                padding: '0 1em'
              }}>
                {folders.find(f => f.id === selectedFolder.id)?.images.map(image => (
                  <div
                    key={image.id}
                    onClick={() => setSelectedImage(image)}
                    style={{
                      position: 'relative',
                      height: '280px',
                      borderRadius: '16px',
                      overflow: 'hidden',
                      cursor: 'pointer',
                      boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
                      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                      background: 'white'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-12px) scale(1.02)';
                      e.currentTarget.style.boxShadow = '0 16px 40px rgba(0,0,0,0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0) scale(1)';
                      e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.3)';
                    }}
                  >
                    <div style={{
                      width: '100%',
                      height: '100%',
                      overflow: 'hidden'
                    }}>
                      <img 
                        src={image.src} 
                        alt={image.title}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          transition: 'transform 0.4s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.transform = 'scale(1.1)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.transform = 'scale(1)';
                        }}
                      />
                    </div>
                    
                    <div style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.6) 50%, transparent 100%)',
                      color: 'white',
                      padding: '2.5em 1.5em 1.5em',
                    }}>
                      <h3 style={{
                        margin: 0,
                        fontSize: '1.2em',
                        fontWeight: 600,
                        textTransform: 'capitalize'
                      }}>
                        {image.title}
                      </h3>
                      <div style={{
                        marginTop: '0.5em',
                        fontSize: '0.9em',
                        opacity: 0.9
                      }}>
                        🔍 Click to enlarge
                      </div>
                    </div>

                    <div style={{
                      position: 'absolute',
                      top: '15px',
                      right: '15px',
                      background: selectedFolder.color,
                      borderRadius: '50%',
                      width: '45px',
                      height: '45px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.5em',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
                    }}>
                      {selectedFolder.icon}
                    </div>
                  </div>
                ))}
              </div>

              {folders.find(f => f.id === selectedFolder.id)?.images.length === 0 && (
                <div style={{
                  textAlign: 'center',
                  padding: '4em 2em',
                  background: 'white',
                  borderRadius: '16px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                }}>
                  <div style={{ fontSize: '4em', marginBottom: '0.5em' }}>📷</div>
                  <p style={{ fontSize: '1.2em', color: '#666', margin: 0 }}>
                    No images in this folder yet
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Image Modal */}
      {selectedImage && (
        <div 
          onClick={() => setSelectedImage(null)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2000,
            padding: '2em',
            cursor: 'pointer'
          }}
        >
          <div style={{
            position: 'relative',
            maxWidth: '90%',
            maxHeight: '90%'
          }}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImage(null);
              }}
              style={{
                position: 'absolute',
                top: '-40px',
                right: '0',
                background: 'white',
                color: '#333',
                border: 'none',
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                fontSize: '1.5em',
                cursor: 'pointer',
                fontWeight: 'bold',
                boxShadow: '0 2px 10px rgba(0,0,0,0.3)'
              }}
            >
              ×
            </button>
            <img 
              src={selectedImage.src} 
              alt={selectedImage.title}
              style={{
                maxWidth: '100%',
                maxHeight: '80vh',
                borderRadius: '8px',
                boxShadow: '0 10px 40px rgba(0,0,0,0.5)'
              }}
            />
            <h3 style={{
              color: 'white',
              textAlign: 'center',
              marginTop: '1em',
              fontSize: '1.5em'
            }}>
              {selectedImage.title}
            </h3>
          </div>
        </div>
      )}
      
      <div className="projects-grid">
        {projects.map(project => (
          <div className="gallery-project-card" key={project.id}>
            <div className="project-image">
              <img src={project.image} alt={project.title} />
            </div>
            <div className="project-info">
              <h3>{project.title}</h3>
              <p>{project.description}</p>
              <p className="project-location"><FaMapMarkerAlt /> {project.location}</p>
              <div className="project-rating">
                <span className="star">★</span>
                <span className="star">★</span>
                <span className="star">★</span>
                <span className="star">★</span>
                <span className="star">★</span>
                <span className="rating-text">5.0</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Pagination removed as requested */}
    </div>
  );
}

export default ConstructionPage;