import styles from './Navigation.module.css';

export const Navigation = ({ navItems, activeTab, onSelectTab }) => {
  return (
    <nav className={styles.nav}>
      {navItems.map((item) => (
        <button
          key={item.id}
          type="button"
          className={`${styles.navLink} ${activeTab === item.id ? styles.active : ''}`}
          aria-current={activeTab === item.id ? 'location' : undefined}
          onClick={() => {
            onSelectTab(item.id);
            const targetId = item.link?.replace(/^#/, '');
            if (targetId) {
              document.getElementById(targetId)?.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
              });
            }
          }}
        >
          {item.label}
        </button>
      ))}
    </nav>
  );
};