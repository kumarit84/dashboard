import React from 'react';
import './Loader.css';

const Loader = ({ size = 'medium', text = 'Loading...' }) => {
  return (
    <div className={`loader-container loader-${size}`}>
      <div className="loader-spinner"></div>
      {text && <div className="loader-text">{text}</div>}
    </div>
  );
};

export default Loader;