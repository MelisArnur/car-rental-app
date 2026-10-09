import { Logo } from "../Logo/Logo";
import { Navigation } from '../Navigation/Navigation';
import { UserProfile } from '../UserProfile/UserProfile';
import { Button } from '../Button/Button';
import { useTheme, useAuth, useFavorites } from '../../context/useContexts';
import styles from './Header.module.css'; 

export const Header = ({ navItems, activeTab, onSelectTab }) => {
    const { isDarkMode, toggleTheme } = useTheme();
    const { user, login, logout } = useAuth();
    const { favorites } = useFavorites();

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
                           ❤️ <span className={styles['fav-badge']}>{favorites.length}</span>
                        </div>

                        <Button 
                            text={isDarkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
                            variant="outline"
                            onClick={toggleTheme}
                        />

                        <UserProfile user={user} onLogin={login} onLogout={logout} />
                    </div>
                </div>
            </div>
        </header>
    );
};
