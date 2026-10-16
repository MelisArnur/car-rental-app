import { Button } from '../Button/Button';
import styles from './HeroSection.module.css';

export const HeroSection = ({ onExploreClick }) => {
  return (
    <section className={styles.heroSection}>
      <h1>Drive the Extraordinary</h1>
      <p>Choose from luxury sports cars, comfortable electric sedans, and rugged SUVs.</p>
      <Button text="Explore Catalog" variant="primary" onClick={onExploreClick} />
    </section>
  );
};