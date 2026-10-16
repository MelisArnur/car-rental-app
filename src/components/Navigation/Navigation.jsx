import { Link, NavLink } from 'react-router-dom';
import styles from './Navigation.module.css';

export const Navigation = ({ navItems, onNavigate }) => {
  return (
    <nav className={styles.nav}>
      {navItems.map((item) => item.to.includes('#') ? (
        <Link
          key={item.id}
          className={styles.navLink}
          to={item.to}
          onClick={onNavigate}
        >
          {item.label}
        </Link>
      ) : (
        <NavLink
          key={item.id}
          end={item.end}
          className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}
          to={item.to}
          onClick={onNavigate}
        >
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
};