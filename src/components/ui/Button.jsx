import React from 'react';
import './Button.css';

const Button = ({ 
  children, 
  variant = 'primary', 
  icon, 
  onClick, 
  disabled = false,
  className = '',
  type = 'button',
  ...props 
}) => {
  return (
    <button
      type={type}
      className={`btn btn-${variant} ${className}`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {icon && <span className="btn-icon">{icon}</span>}
      {children}
    </button>
  );
};

export default Button;