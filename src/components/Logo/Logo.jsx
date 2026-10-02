import React from 'react';

export const Logo = ({ src, altText, width = 120, height = 'auto' }) => {
  return (
    <div className="logo-container">
      <img src={src} alt={altText} style={{ width, height }} />
    </div>
  );
};