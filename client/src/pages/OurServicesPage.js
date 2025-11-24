import React, { useState } from 'react';

export default function OurServicesPage() {
  const [selectedVideo, setSelectedVideo] = useState(null);

  // Log the PUBLIC_URL for debugging
  console.log('PUBLIC_URL:', process.env.PUBLIC_URL);

  // Demo videos configuration
  const demoVideos = [
    {
      id: 1,
      title: 'Farm Management Services',
      description: 'Comprehensive farm management and consultation services',
      thumbnail: `${process.env.PUBLIC_URL}/assert/demo1.jpeg`,
      videoUrl: `${process.env.PUBLIC_URL}/videos/demo1.mp4`,
      type: 'video/mp4'
    },
    {
      id: 2,
      title: 'Drone Technology',
      description: 'Advanced drone services for crop monitoring and spraying',
      thumbnail: `${process.env.PUBLIC_URL}/assert/demo2.jpeg`,
      videoUrl: `${process.env.PUBLIC_URL}/videos/demo2.mp4`,
      type: 'video/mp4'
    },
    {
      id: 3,
      title: 'Agricultural Consultation',
      description: 'Expert guidance for sustainable farming practices',
      thumbnail: `${process.env.PUBLIC_URL}/assert/demo3.jpeg`,
      videoUrl: `${process.env.PUBLIC_URL}/videos/demo3.mp4`,
      type: 'video/mp4'
    }
  ];

  // Log video URLs for debugging
  console.log('Demo Videos:', demoVideos);

  // Drone images configuration
  const droneImages = [
    {
      id: 1,
      title: 'Crop Monitoring',
      image: `${process.env.PUBLIC_URL}/assert/demo1.jpeg`,
      description: 'Real-time crop health monitoring with high-resolution imaging'
    },
    {
      id: 2,
      title: 'Precision Spraying',
      image: `${process.env.PUBLIC_URL}/assert/demo2.jpeg`,
      description: 'Efficient and precise pesticide and fertilizer application'
    },
    {
      id: 3,
      title: 'Land Mapping',
      image: `${process.env.PUBLIC_URL}/assert/demo3.jpeg`,
      description: 'Detailed topographical mapping and analysis'
    },
    {
      id: 4,
      title: 'Irrigation Management',
      image: `${process.env.PUBLIC_URL}/assert/demo1.jpeg`,
      description: 'Smart irrigation monitoring and optimization'
    }
  ];

  // Log image URLs for debugging
  console.log('Drone Images:', droneImages);

  const services = [
    {
      title: 'Aadhivelan Drone Services',
      description: 'Advanced aerial solutions for modern farming',
      features: ['Crop monitoring', 'Precision spraying', 'Land surveying', 'Thermal imaging','Manufacturing Drones']
    },
    {
      title: 'Motors & Pumps',
      description: 'Complete motor and pump solutions for agriculture',
      features: ['Manufacturing motors & pumps', 'Sales & distribution', 'Installation services', 'Maintenance & repair', 'AMC contracts']
    },
    {
      title: 'Farm Management',
      description: 'Complete farm management and AMC services',
      features: ['Regular maintenance', 'Soil testing', 'Crop planning', 'Expert consultation']
    },
    {
      title: 'Equipment & Tools',
      description: 'Modern farming equipment and machinery',
      features: ['Equipment rental', 'Installation support', 'Maintenance services', 'Training programs']
    },
    {
      title: 'Consultation',
      description: 'Expert agricultural guidance and support',
      features: ['Crop selection', 'Pest management', 'Yield optimization', 'Market insights']
    }
  ];

  return (
    <div style={{ 
      minHeight: '100vh', 
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          minWidth: '100%',
          minHeight: '100%',
          width: 'auto',
          height: 'auto',
          transform: 'translate(-50%, -50%)',
          zIndex: -1,
          objectFit: 'cover',
          opacity: 0.4,
        }}
      >
        <source src={process.env.PUBLIC_URL + '/videos/farm-bg.mp4'} type="video/mp4" />
      </video>

      {/* Content Wrapper */}
      <div style={{ 
        position: 'relative',
        zIndex: 1,
        padding: '2rem 1rem'
      }}>
      {/* Header Section */}
      <div style={{ 
        maxWidth: 1200, 
        margin: '0 auto 3rem', 
        textAlign: 'center',
        padding: '2rem'
      }}>
        <h1 style={{ 
          color: '#2e7d32', 
          fontSize: '3rem', 
          fontWeight: 800, 
          marginBottom: '1rem',
          textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
        }}>
          Our Services
        </h1>
        <p style={{ 
          color: '#555', 
          fontSize: '1.2rem', 
          maxWidth: 700, 
          margin: '0 auto',
          lineHeight: 1.6
        }}>
          Empowering farmers with cutting-edge technology and expert agricultural solutions
        </p>
      </div>

      {/* Services Grid */}
      <div style={{ 
        maxWidth: 1200, 
        margin: '0 auto 4rem',
        padding: '0 1rem'
      }}>
        <h2 style={{ 
          color: '#2e7d32', 
          fontSize: '2rem', 
          fontWeight: 700, 
          marginBottom: '2rem',
          textAlign: 'center'
        }}>
          What We Offer
        </h2>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
          gap: '2rem' 
        }}>
          {services.map((service, index) => (
            <div 
              key={index}
              style={{ 
                background: 'rgba(255, 255, 255, 0.75)', 
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.5)',
                borderRadius: 16, 
                padding: '2rem',
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.boxShadow = '0 8px 30px rgba(46,125,50,0.2)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.1)';
              }}
            >
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{service.icon}</div>
              <h3 style={{ color: '#2e7d32', fontSize: '1.5rem', marginBottom: '0.5rem' }}>
                {service.title}
              </h3>
              <p style={{ color: '#666', marginBottom: '1rem', lineHeight: 1.6 }}>
                {service.description}
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {service.features.map((feature, idx) => (
                  <li key={idx} style={{ 
                    color: '#444', 
                    padding: '0.5rem 0',
                    borderBottom: idx < service.features.length - 1 ? '1px solid #eee' : 'none'
                  }}>
                    ✓ {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Demo Videos Section */}
      <div style={{ 
        maxWidth: 1200, 
        margin: '0 auto 4rem',
        padding: '0 1rem'
      }}>
        <h2 style={{ 
          color: '#2e7d32', 
          fontSize: '2rem', 
          fontWeight: 700, 
          marginBottom: '2rem',
          textAlign: 'center'
        }}>
          Demo Videos
        </h2>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
          gap: '2rem' 
        }}>
          {demoVideos.map((video) => (
            <div 
              key={video.id}
              style={{ 
                background: 'rgba(255, 255, 255, 0.75)', 
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.5)',
                borderRadius: 16, 
                overflow: 'hidden',
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                cursor: 'pointer',
                transition: 'transform 0.3s ease'
              }}
              onClick={() => setSelectedVideo(video)}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-5px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div style={{ 
                width: '100%', 
                height: 200, 
                background: '#f0f0f0',
                position: 'relative',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {video.thumbnail && (
                  <img 
                    src={video.thumbnail} 
                    alt={video.title}
                    style={{ 
                      width: '100%', 
                      height: '100%', 
                      objectFit: 'cover' 
                    }}
                    onError={(e) => {
                      console.error('Failed to load thumbnail:', e.target.src);
                      e.target.style.display = 'none';
                      e.target.parentElement.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
                    }}
                    onLoad={(e) => {
                      console.log('Successfully loaded thumbnail:', e.target.src);
                    }}
                  />
                )}
                <div style={{ 
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  background: 'rgba(0,0,0,0.3)',
                  zIndex: 1
                }} />
                <div style={{ 
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  zIndex: 2,
                  background: 'rgba(46,125,50,0.9)',
                  borderRadius: '50%',
                  width: 70,
                  height: 70,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '2rem',
                  color: 'white',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                  transition: 'transform 0.3s ease'
                }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1.1)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1)'}
                >
                  ▶
                </div>
              </div>
              <div style={{ padding: '1.5rem' }}>
                <h3 style={{ color: '#2e7d32', fontSize: '1.3rem', marginBottom: '0.5rem' }}>
                  {video.title}
                </h3>
                <p style={{ color: '#666', lineHeight: 1.6 }}>
                  {video.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Drone Images Gallery */}
      <div style={{ 
        maxWidth: 1200, 
        margin: '0 auto 4rem',
        padding: '0 1rem'
      }}>
        <h2 style={{ 
          color: '#2e7d32', 
          fontSize: '2rem', 
          fontWeight: 700, 
          marginBottom: '2rem',
          textAlign: 'center'
        }}>
          Drone Technology Showcase
        </h2>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
          gap: '2rem' 
        }}>
          {droneImages.map((item) => (
            <div 
              key={item.id}
              style={{ 
                background: 'rgba(255, 255, 255, 0.75)', 
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.5)',
                borderRadius: 16, 
                overflow: 'hidden',
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'scale(1.03)';
                e.currentTarget.style.boxShadow = '0 8px 30px rgba(46,125,50,0.2)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.1)';
              }}
            >
              <div style={{ 
                width: '100%', 
                height: 220, 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <img 
                  src={item.image} 
                  alt={item.title}
                  style={{ 
                    width: '100%', 
                    height: '100%', 
                    objectFit: 'cover' 
                  }}
                  onError={(e) => {
                    console.error('Failed to load drone image:', e.target.src);
                    e.target.style.display = 'none';
                    e.target.parentElement.innerHTML = `<div style="display: flex; align-items: center; justify-content: center; width: 100%; height: 100%; color: white; font-size: 3rem;">🚁</div>`;
                  }}
                  onLoad={(e) => {
                    console.log('Successfully loaded drone image:', e.target.src);
                  }}
                />
              </div>
              <div style={{ padding: '1.5rem' }}>
                <h3 style={{ color: '#2e7d32', fontSize: '1.3rem', marginBottom: '0.5rem' }}>
                  {item.title}
                </h3>
                <p style={{ color: '#666', lineHeight: 1.6 }}>
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Video Modal */}
      {selectedVideo && (
        <div 
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
            zIndex: 9999,
            padding: '2rem'
          }}
          onClick={() => setSelectedVideo(null)}
        >
          <div 
            style={{ 
              maxWidth: 900, 
              width: '100%',
              background: 'rgba(255, 255, 255, 0.85)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.5)',
              borderRadius: 16,
              overflow: 'hidden',
              position: 'relative'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedVideo(null)}
              style={{
                position: 'absolute',
                top: 10,
                right: 10,
                background: 'rgba(255,255,255,0.9)',
                border: 'none',
                borderRadius: '50%',
                width: 40,
                height: 40,
                fontSize: '1.5rem',
                cursor: 'pointer',
                zIndex: 10,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#333'
              }}
            >
              ×
            </button>
            <video 
              controls 
              autoPlay
              style={{ 
                width: '100%', 
                maxHeight: '70vh',
                display: 'block'
              }}
            >
              <source src={selectedVideo.videoUrl} type={selectedVideo.type} />
              Your browser does not support the video tag.
            </video>
            <div style={{ padding: '1.5rem' }}>
              <h3 style={{ color: '#2e7d32', fontSize: '1.5rem', marginBottom: '0.5rem' }}>
                {selectedVideo.title}
              </h3>
              <p style={{ color: '#666', lineHeight: 1.6 }}>
                {selectedVideo.description}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Call to Action */}
      <div style={{ 
        maxWidth: 800, 
        margin: '0 auto',
        padding: '3rem 2rem',
        background: 'rgba(255, 255, 255, 0.75)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.5)',
        borderRadius: 16,
        boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
        textAlign: 'center'
      }}>
        <h2 style={{ color: '#2e7d32', fontSize: '2rem', marginBottom: '1rem' }}>
          Ready to Transform Your Farm?
        </h2>
        <p style={{ color: '#666', fontSize: '1.1rem', marginBottom: '2rem', lineHeight: 1.6 }}>
          Contact us today to learn more about our services and how we can help optimize your farming operations.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => window.location.href = '/book-team'}
            style={{
              background: '#2e7d32',
              color: 'white',
              border: 'none',
              padding: '1rem 2rem',
              borderRadius: 8,
              fontSize: '1.1rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'background 0.3s ease'
            }}
            onMouseEnter={e => e.target.style.background = '#1b5e20'}
            onMouseLeave={e => e.target.style.background = '#2e7d32'}
          >
            Book Our Team
          </button>
          <button
            onClick={() => window.location.href = '/request-quote'}
            style={{
              background: 'transparent',
              color: '#2e7d32',
              border: '2px solid #2e7d32',
              padding: '1rem 2rem',
              borderRadius: 8,
              fontSize: '1.1rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={e => {
              e.target.style.background = '#2e7d32';
              e.target.style.color = 'white';
            }}
            onMouseLeave={e => {
              e.target.style.background = 'transparent';
              e.target.style.color = '#2e7d32';
            }}
          >
            Request Quote
          </button>
        </div>
      </div>
      </div> {/* End Content Wrapper */}
    </div>
  );
}
