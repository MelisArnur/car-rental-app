import React from 'react';
import styles from './UserProfile.module.css';

export const UserProfile = ({ user }) => {
  if (!user) return null;
  return (
    <div className={styles.userProfile}>
      <img src={user.avatarUrl || user.avatar} alt={user.name} className={styles.avatar} />
      <div className={styles.userInfo}>
        <span className={styles.userName}>{user.name}</span>
        <small className={styles.userRole}>{user.role}</small>
      </div>
    </div>
  );
};