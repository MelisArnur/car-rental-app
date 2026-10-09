import React, { useState, useEffect } from 'react';
import { Button } from '../Button/Button';
import styles from './QuickViewModal.module.css';

export const QuickViewModal = ({ car, days = 1, onClose, onConfirm }) => {
  const [selectedColor, setSelectedColor] = useState(car?.colors?.[0] || '');
  const [promo, setPromo] = useState('');
  const [discount, setDiscount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(600); // 10 минут в секундах

  // 6. Таймер обратного отсчета для акции
  useEffect(() => {
    if (!car) return;
    
    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [car]);

  // 11. Закрытие по Escape
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  // 8. Click outside (уже реализован через overlay в JSX, но добавим для соответствия ДЗ)
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (e.target.classList.contains(styles.modalOverlay)) {
        onClose();
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [onClose]);

  if (!car) return null;

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };


  const handleApplyPromo = () => {
    if (promo.trim().toUpperCase() === 'DRIVE10') {
      setDiscount(0.1);
    }
  };

  const totalPrice = car.pricePerDay * days * (1 - discount);

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h3>Book {car.title}</h3>
          <button className={styles.modalClose} onClick={onClose}>✕</button>
        </div>

                <div className={styles.modalBody}>
          <div style={{ backgroundColor: '#602929', padding: '10px', marginBottom: '15px', borderRadius: '4px', textAlign: 'center' }}>
            🔥 Special Offer! Discount expires in: <strong>{formatTime(timeLeft)}</strong>
          </div>
          <div className={styles.quickviewSummary}>

            <img src={car.imageUrl} alt={car.title} className={styles.previewImg} />
            <div>
              <h4>{car.title}</h4>
              <p>Period: {days} day(s)</p>
              <div className={styles.colorOptions}>
                {car.colors?.map((c) => (
                  <button
                    key={c}
                    className={selectedColor === c ? styles.colorChipSelected : styles.colorChip}
                    onClick={() => setSelectedColor(c)}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className={styles.promoGroup}>
            <input 
              type="text" 
              placeholder="Promo code (DRIVE10)" 
              value={promo} 
              onChange={(e) => setPromo(e.target.value)} 
            />
            <Button text="Apply" variant="outline" onClick={handleApplyPromo} />
          </div>

          <div className={styles.totalPriceBox}>
            Total: <strong>${totalPrice.toFixed(2)}</strong>
          </div>

          <form className={styles.bookingForm} onSubmit={(e) => { e.preventDefault(); onConfirm(); }}>
            <input type="text" placeholder="Full Name" required />
            <input type="tel" placeholder="Phone Number" required />
            <Button text="Confirm Booking" variant="primary" />
          </form>
        </div>
      </div>
    </div>
  );
};