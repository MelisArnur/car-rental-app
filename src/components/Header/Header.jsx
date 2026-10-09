import React from 'react';
import { Logo } from "../Logo/Logo";
import { Navigation } from '../Navigation/Navigation';
import { UserProfile } from '../UserProfile/UserProfile';
import { Button } from '../Button/Button';
import styles from './Header.module.css'; 

export const Header = ({ isDarkMode, setIsDarkMode, navItems, activeTab, onSelectTab, user, favoritesCount }) => {
    return (
        <header className={styles.header}>
            <div className={styles['header-container']}>
                <Logo 
                    src="https://flaticon.com"
                    altText="DriveSelect Logo"
                    width={200}
                />
                
                <div className={styles['header-right-side']}>
                    <Navigation navItems={navItems} activeTab={activeTab} onSelectTab={onSelectTab} />
                    
                    <div className={styles['header-actions']}>
                        <div className={styles['favorites-indicator']} title="Favorite Cars">
                           ❤️ <span className={styles['fav-badge']}>{favoritesCount}</span>
                        </div>

                        <Button 
                            text={isDarkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
                            variant="outline"
                            onClick={() => setIsDarkMode(!isDarkMode)}
                        />

                        <UserProfile user={user} />
                    </div>
                </div>
            </div>
        </header>
    );
};
