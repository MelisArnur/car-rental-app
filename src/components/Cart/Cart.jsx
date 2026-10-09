import { useEffect, useRef } from 'react';
import { useCart } from '../../context/useContexts';
import styles from './Cart.module.css';

export const Cart = ({ isOpen, onClose }) => {
  const cartRef = useRef(null);
  const { cartItems, removeFromCart, updateQuantity, clearCart, totalCount, totalPrice } = useCart();

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };
    const handlePointerDown = (event) => {
      if (!cartRef.current?.contains(event.target)) onClose();
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('pointerdown', handlePointerDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('pointerdown', handlePointerDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <section ref={cartRef} className={styles.cartPanel} role="dialog" aria-label="Bookings">
      <div className={styles.cartHeader}>
        <h2>Bookings ({totalCount})</h2>
        <button type="button" onClick={onClose} aria-label="Close bookings">×</button>
      </div>

      {cartItems.length === 0 ? (
        <p className={styles.emptyMessage}>No bookings yet.</p>
      ) : (
        <>
          <ul className={styles.cartItems}>
            {cartItems.map((item, index) => {
              const itemPrice = item.bookingPricePerDay ?? item.pricePerDay ?? item.price ?? 0;
              return (
                <li className={styles.cartItem} key={item.cartItemId ?? `${item.id}-${itemPrice}-${index}`}>
                  <div className={styles.itemDetails}>
                    <strong>{item.title}</strong>
                    <span>${itemPrice.toFixed(2)} / day</span>
                  </div>
                  <div className={styles.itemActions}>
                    <button
                      type="button"
                      aria-label={`Decrease ${item.title} rental days`}
                      onClick={() => updateQuantity(item.cartItemId ?? item.id, item.quantity - 1)}
                    >
                      −
                    </button>
                    <span>{item.quantity} day(s)</span>
                    <button
                      type="button"
                      aria-label={`Increase ${item.title} rental days`}
                      onClick={() => updateQuantity(item.cartItemId ?? item.id, item.quantity + 1)}
                    >
                      +
                    </button>
                    <button
                      type="button"
                      className={styles.removeButton}
                      onClick={() => removeFromCart(item.cartItemId ?? item.id)}
                    >
                      Remove
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
          <div className={styles.cartFooter}>
            <strong>Total: ${totalPrice.toFixed(2)}</strong>
            <button type="button" onClick={clearCart}>Clear bookings</button>
          </div>
        </>
      )}
    </section>
  );
};
