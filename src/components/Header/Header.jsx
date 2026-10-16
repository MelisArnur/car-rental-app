import { useEffect, useState } from 'react';
import { Logo } from "../Logo/Logo";
import { Navigation } from '../Navigation/Navigation';
import { UserProfile } from '../UserProfile/UserProfile';
import { Button } from '../Button/Button';
import { Cart } from '../Cart/Cart';
import { useTheme, useAuth, useCart } from '../../context/useContexts';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Header.module.css'; 

export const Header = ({ navItems, isMobile }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const { isDarkMode, toggleTheme } = useTheme();
    const { user, logout } = useAuth();
    const { favorites, totalCount, totalPrice } = useCart();
    const navigate = useNavigate();

    useEffect(() => {
        const closeMenuOnDesktop = () => {
            if (window.innerWidth >= 768) setIsMenuOpen(false);
        };

        window.addEventListener('resize', closeMenuOnDesktop);
        return () => window.removeEventListener('resize', closeMenuOnDesktop);
    }, []);

    return (
        <header className={styles.header}>
            <div className={styles['header-container']}>
                <Link to="/" aria-label="DriveSelect home">
                    <Logo altText="DriveSelect Logo" width={200} />
                </Link>

                {isMobile && (
                    <button
                        className={styles.mobileMenuToggle}
                        type="button"
                        aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
                        aria-expanded={isMenuOpen}
                        onClick={() => setIsMenuOpen((open) => !open)}
                    >
                        {isMenuOpen ? '✕' : '☰'}
                    </button>
                )}
                
                {(!isMobile || isMenuOpen) && (
                    <div className={`${styles['header-right-side']} ${isMobile ? styles.mobileMenuPanel : ''}`}>
                        {(!isMobile || isMenuOpen) && (
                        <Navigation
                            navItems={navItems}
                            onNavigate={() => setIsMenuOpen(false)}
                        />
                        )}
                    
                    <div className={styles['header-actions']}>
                        <div className={styles['favorites-indicator']} title="Favorite Cars">
                           ❤️ <span className={styles['fav-badge']}>{favorites.length}</span>
                        </div>
                        <div className={styles.bookingsAnchor}>
                            <button
                                className={styles.bookingsButton}
                                type="button"
                                aria-expanded={isCartOpen}
                                onClick={() => setIsCartOpen(true)}
                            >
                                Bookings: {totalCount} {totalCount === 1 ? 'car' : 'cars'} · ${totalPrice.toFixed(2)}
                            </button>
                            <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
                        </div>

                        <Button 
                            text={isDarkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
                            variant="outline"
                            onClick={toggleTheme}
                        />

                        <UserProfile
                            user={user}
                            onLogin={() => navigate('/login')}
                            onLogout={logout}
                        />
                    </div>
                    </div>
                )}
            </div>
        </header>
    );
};
