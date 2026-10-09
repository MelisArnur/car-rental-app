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
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState('cars');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('price-asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('favorites');
    return saved ? JSON.parse(saved) : [];
  });
  const [cars, setCars] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // 1 & 13. Первичная загрузка + AbortController
  useEffect(() => {
    const controller = new AbortController();
    setIsLoading(true);

    // Имитация загрузки с сервера
    const timer = setTimeout(() => {
      setCars(initialCars);
      setIsLoading(false);
    }, 1000);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, []);

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

  // 15. Синхронизация темы с ОС
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => setIsDarkMode(e.matches);
    
    // Устанавливаем при первом входе, если пользователь еще не менял тему вручную
    if (localStorage.getItem('theme') === null) {
      setIsDarkMode(mediaQuery.matches);
    }

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // 9. Имитация загрузки при смене фильтров
  useEffect(() => {
    if (cars.length > 0) {
      console.log(`Fetching data for category: ${selectedCategory}, page: ${currentPage}`);
      // Здесь мог бы быть запрос к API
    }
  }, [selectedCategory, currentPage]);

  const [modalState, setModalState] = useState({
    isOpen: false,
    car: null,
    days: 1,
  });

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.remove('dark-mode');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const toggleFavorite = (carId) => {
    setFavorites((prev) =>
      prev.includes(carId) ? prev.filter((id) => id !== carId) : [...prev, carId]
    );
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
      <Header
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
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
    </div>
  );
}