import styles from './Button.module.css';

export const Button = ({ text, variant = 'primary', isDisabled, onClick }) => {
  const btnClass = `${styles.btn} ${styles[variant] || styles.primary}`;
  return (
    <button className={btnClass} disabled={isDisabled} onClick={onClick}>
      {text}
    </button>
  );
};