import React, { useState, useEffect } from 'react';
import { Header } from './components/Header/Header';
import { HeroSection } from './components/HeroSection/HeroSection';
import { SectionHeader } from './components/SectionHeader/SectionHeader';
import { CarsCatalog } from './components/CarsCatalog/CarsCatalog';
import { StatCard } from './components/StatCard/StatCard';
import { TestimonialCard } from './components/TestimonialCard/TestimonialCard';
import { QuickViewModal } from './components/QuickViewModal/QuickViewModal';
import { Container } from './components/Container/Container';
import { Footer } from './components/Footer/Footer';
import { ProgressBar } from './components/ProgressBar/ProgressBar';
import { Toast } from './components/Toast/Toast';

import {
  initialCars,
  categoriesList,
  navItemsList,
  currentUser,
  statsList,
  initialReviews,
} from './data/mockData';

import './App.css';

export default function App() {
  const getInitialDarkMode = () => {
    const savedTheme = localStorage.getItem('theme');

    if (savedTheme === 'dark' || savedTheme === 'light') {
      return savedTheme === 'dark';
    }

    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  };

  const [isDarkMode, setIsDarkMode] = useState(getInitialDarkMode);
  const [hasManualTheme, setHasManualTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme === 'dark' || savedTheme === 'light';
  });
  const [activeTab, setActiveTab] = useState('cars');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('price-asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('favorites');
    return saved ? JSON.parse(saved) : [];
  });
  const [modalState, setModalState] = useState({ isOpen: false, car: null, days: 1 });
  const [toast, setToast] = useState(null);
  const [cars, setCars] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const loadCars = (signal) =>
    new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        if (signal.aborted) {
          reject(new DOMException('The operation was aborted.', 'AbortError'));
          return;
        }

        resolve(initialCars);
      }, 400);

      signal.addEventListener(
        'abort',
        () => {
          clearTimeout(timer);
          reject(new DOMException('The operation was aborted.', 'AbortError'));
        },
        { once: true }
      );
    });

  // 1 & 13. Первичная загрузка + AbortController
  useEffect(() => {
    const controller = new AbortController();
    setIsLoading(true);

    loadCars(controller.signal)
      .then((data) => {
        setCars(data);
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });

    return () => controller.abort();
  }, []);

  // 9. Загрузка данных при изменении фильтра/страницы + AbortController
  useEffect(() => {
    const controller = new AbortController();
    setIsLoading(true);

    loadCars(controller.signal)
      .then((data) => {
        setCars(data);
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });

    return () => controller.abort();
  }, [selectedCategory, currentPage, debouncedSearch]);

  // 2. Сохранение избранного в localStorage
  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  // 4. Динамический заголовок
  useEffect(() => {
    document.title = selectedCategory === 'All' 
      ? 'DriveSelect — Premium Car Rental' 
      : `${selectedCategory} Cars | DriveSelect`;
  }, [selectedCategory]);

  // 5. Debounce-поиск
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);

    return () => clearTimeout(handler);
  }, [searchQuery]);

  // 7. Resize listener
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 10. Scroll to top при смене страницы
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);


  // 15. Синхронизация темы с ОС, не затирая выбранную пользователем тему
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleSystemThemeChange = (event) => {
      const savedTheme = localStorage.getItem('theme');

      if (!savedTheme) {
        setIsDarkMode(event.matches);
      }
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleSystemThemeChange);
      return () => mediaQuery.removeEventListener('change', handleSystemThemeChange);
    }

    mediaQuery.addListener(handleSystemThemeChange);
    return () => mediaQuery.removeListener(handleSystemThemeChange);
  }, []);

  useEffect(() => {
    if (hasManualTheme) {
      localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    }
  }, [isDarkMode, hasManualTheme]);

  // Синхронизация класса body с состоянием
  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [isDarkMode]);

  const handleThemeToggle = () => {
    setHasManualTheme(true);
    setIsDarkMode((prev) => !prev);
  };

  const toggleFavorite = (carId) => {
    setFavorites((prev) => {
      const isRemoving = prev.includes(carId);
      if (isRemoving) {
        setToast('Removed from favorites');
        return prev.filter((id) => id !== carId);
      } else {
        setToast('Added to favorites!');
        return [...prev, carId];
      }
    });
  };

  const handleOpenQuickView = (car, days) => {
    setModalState({ isOpen: true, car, days });
  };

  const handleCloseModal = () => {
    setModalState({ isOpen: false, car: null, days: 1 });
  };

  let filteredCars = cars.filter((car) => {
    const matchesCategory = selectedCategory === 'All' || car.category === selectedCategory;
    const matchesSearch = car.title.toLowerCase().includes(debouncedSearch.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (sortBy === 'price-asc') {
    filteredCars.sort((a, b) => a.pricePerDay - b.pricePerDay);
  } else if (sortBy === 'price-desc') {
    filteredCars.sort((a, b) => b.pricePerDay - a.pricePerDay);
  } else if (sortBy === 'rating-desc') {
    filteredCars.sort((a, b) => b.rating - a.rating);
  }

  const itemsPerPage = 4;
  const totalPages = Math.ceil(filteredCars.length / itemsPerPage);
  const displayedCars = filteredCars.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="app-root">
      <ProgressBar />
      <Header
        isDarkMode={isDarkMode}
        setIsDarkMode={handleThemeToggle}
        navItems={navItemsList}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        user={currentUser}
        favoritesCount={favorites.length}
      />

      <Container>
        <HeroSection
          heading="Drive the Extraordinary"
          subheading="Choose from luxury sports cars, comfortable electric sedans, and rugged SUVs."
          buttonText="Explore Catalog"
          onAction={() => window.scrollTo({ top: 400, behavior: 'smooth' })}
        />

        <section id="cars" className="section-padding">
          <SectionHeader
            title={isMobile ? "Fleet" : "Available Vehicles"}
            subtitle="Find the perfect match for your next road trip or business event"
          />

          {isLoading ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>Loading catalog...</div>
          ) : (
            <CarsCatalog
              cars={displayedCars}
              categories={categoriesList}
              selectedCategory={selectedCategory}
              onSelectCategory={(cat) => {
                setSelectedCategory(cat);
                setCurrentPage(1);
              }}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              sortBy={sortBy}
              setSortBy={setSortBy}
              favorites={favorites}
              onToggleFavorite={toggleFavorite}
              onOpenQuickView={handleOpenQuickView}
              currentPage={currentPage}
              totalPages={totalPages}
              setCurrentPage={setCurrentPage}
            />
          )}
        </section>

        <section id="stats" className="section-padding" style={{ marginTop: '40px' }}>
          <SectionHeader title="Platform Analytics" subtitle="Live updates on our service performance" />
          <div className="stats-grid">
            {statsList.map((st) => (
              <StatCard key={st.id} {...st} />
            ))}
          </div>
        </section>

        <section id="reviews" className="section-padding" style={{ marginTop: '40px' }}>
          <SectionHeader title="Customer Testimonials" subtitle="Read what our clients say about us" />
          <div className="reviews-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
            {initialReviews.map((rev) => (
              <TestimonialCard key={rev.id} {...rev} />
            ))}
          </div>
        </section>
      </Container>

      <Footer
        copyrightText="© 2026 DriveSelect Inc. All rights reserved."
        socialLinks={[
          { platform: 'GitHub', url: 'https://github.com' },
          { platform: 'Twitter', url: 'https://twitter.com' },
        ]}
      />

      <QuickViewModal
        isOpen={modalState.isOpen}
        onClose={handleCloseModal}
        car={modalState.car}
        initialDays={modalState.days}
      />

      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </div>
  );
}