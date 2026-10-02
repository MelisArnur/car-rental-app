import React, { useState } from 'react';
import { Badge } from '../Badge/Badge';
import { RatingStars } from '../RatingStars/RatingStars';
import { Button } from '../Button/Button';
import styles from './CarCard.module.css'; // 1. Импортируем стили модуля

export const CarCard = ({ car, onOpenQuickView, onToggleFavorite, isFav }) => {
  const [days, setDays] = useState(1);

  const incrementDays = (e) => {
    e.stopPropagation();
    setDays((prev) => prev + 1);
  };

  const decrementDays = (e) => {
    e.stopPropagation();
    setDays((prev) => (prev > 1 ? prev - 1 : 1));
  };

  return (
    <div className={styles.carCard}>
      <div className={styles.carCardHeader}>
        <Badge 
          label={car.isAvailable ? 'Available' : 'Rented'} 
          colorScheme={car.isAvailable ? 'green' : 'red'} 
        />
        <button 
          className={`${styles.favBtn} ${isFav ? styles.active : ''}`}
          onClick={() => onToggleFavorite(car.id)}
          title={isFav ? "Remove from favorites" : "Add to favorites"}
        >
          {isFav ? '❤️' : '🤍'}
        </button>
      </div>

      <img src={car.imageUrl} alt={car.title} className={styles.carImage} />

      <div className={styles.carCardBody}>
        <span className={styles.carCategory}>{car.category}</span>
        <h3>{car.title}</h3>
        <p className="car-desc">{car.description}</p>
        
        <RatingStars score={car.rating} reviewsCount={car.reviewsCount} />

        <div className={styles.daysSelector}>
          <span>Rental Period:</span>
          <div className={styles.counterControls}>
            <button type="button" onClick={decrementDays}>-</button>
            <span>{days} day(s)</span>
            <button type="button" onClick={incrementDays}>+</button>
          </div>
        </div>

        <div className={styles.priceTag}>
          <span>Total: </span>
          <span className={styles.priceAmount}>${car.pricePerDay * days}</span>
          <small> (${car.pricePerDay}/day)</small>
        </div>
      </div>

      <div className={styles.carCardFooter}>
        <Button 
          text={car.isAvailable ? "Book Now" : "Currently Unavailable"} 
          variant="primary" 
          isDisabled={!car.isAvailable} 
          onClick={() => car.isAvailable && onOpenQuickView(car, days)} 
        />
      </div>
    </div>
  );
};