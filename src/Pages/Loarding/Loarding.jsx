import React from 'react';
import './loarding.css';

const Loarding = () => {
  return (
    <div className='full-page-loader'>
      <div className="premium-logo-loader">
        <div className="logo-circle"></div>
        <div className="logo-inner-circle"></div>
      </div>

      <div className="loading-brand">
        Lanka<span>Deal</span>
      </div>

      <div className="loading-status">
        Preparing your experience
        <span className="dot-pulse">.</span>
        <span className="dot-pulse">.</span>
        <span className="dot-pulse">.</span>
      </div>
    </div>
  );
};

export default Loarding;
