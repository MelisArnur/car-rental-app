import React from 'react';
import styles from './Navigation.module.css';

export const Navigation = ({ navItems, activeTab, onSelectTab }) => {
  return (
    <nav className={styles.nav}>
      {navItems.map((item) => (
        <button
          key={item.id}
          className={`${styles.navLink} ${activeTab === item.id ? styles.active : ''}`}
          onClick={() => onSelectTab(item.id)}
        >
          {item.label}
        </button>
      ))}
    </nav>
  );
};