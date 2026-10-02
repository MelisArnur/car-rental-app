import React from 'react';
// Импортируем картинку напрямую из папки assets
import logoFile from '../../assets/logo.svg'; // Укажите правильное расширение (.png или .svg)!

export const Logo = ({ altText, width = 250, height = 'auto' }) => {
    return (
        <div className="logo-container">
            {/* Меняем {src} на наш импортированный logoFile */}
            <img src={logoFile} alt={altText} style={{ width, height }} />
        </div>
    );
};
