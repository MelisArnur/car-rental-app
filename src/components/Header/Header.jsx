import React from 'react';
import { Logo } from "../Logo/Logo";
import { Navigation } from '../Navigation/Navigation';
import { UserProfile } from '../UserProfile/UserProfile';
import { Button } from '../Button/Button';

export const Header = ({ isDarkMode, setIsDarkMode, navItems, activeTab, onSelectTab, user, favoritesCount }) => {
  return (
    <header className="header">
      <div className="header-container">
        <Logo 
          src="https://cdn-icons-png.flaticon.com/512/744/741407.png" 
          altText="DriveSelect Logo" 
          width={45} 
        />
        <h2 className="brand-name">DriveSelect</h2>

        <Navigation navItems={navItems} activeTab={activeTab} onSelectTab={onSelectTab} />

        <div className="header-actions">
          <div className="favorites-indicator" title="Favorite Cars">
            ❤️ <span className="fav-badge">{favoritesCount}</span>
          </div>

          <Button 
            text={isDarkMode ? "☀️ Light Mode" : "🌙 Dark Mode"} 
            variant="outline" 
            onClick={() => setIsDarkMode(!isDarkMode)} 
          />

          <UserProfile user={user} />
        </div>

        
      </div>
    </header>
  );
};