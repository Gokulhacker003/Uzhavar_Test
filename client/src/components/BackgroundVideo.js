import React from 'react';
import '../styles/BackgroundVideo.css';

const BackgroundVideo = () => {
  return (
    <div className="background-video-container">
      <video 
        autoPlay 
        loop 
        muted 
        playsInline
        className="background-video"
      >
        <source src={process.env.PUBLIC_URL + '/videos/farm-bg.mp4'} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="video-overlay"></div>
    </div>
  );
};

export default BackgroundVideo;
