import React from 'react';
import styles from './TestimonialCard.module.css';

export const TestimonialCard = (props) => {
  // Поддерживаем передачу как через testimonial={review}, так и прямо пропсами
  const data = props.testimonial || props.review || props;
  
  const { authorName, authorRole, avatar, text, date } = data;

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        {avatar && <img src={avatar} alt={authorName || 'User'} className={styles.avatar} />}
        <div>
          <h4 className={styles.name}>{authorName || 'Anonymous'}</h4>
          {authorRole && <p className={styles.role}>{authorRole}</p>}
        </div>
      </div>
      <p className={styles.text}>"{text}"</p>
      {date && <span className={styles.date}>{date}</span>}
    </div>
  );
};