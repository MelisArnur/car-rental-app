import { useCallback, useEffect, useMemo, useState } from 'react';
import { FavoritesContext } from './contexts';

function getSavedFavorites() {
  const savedFavorites = localStorage.getItem('favorites');
  return savedFavorites ? JSON.parse(savedFavorites) : [];
}

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState(getSavedFavorites);
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = useCallback((carId) => {
    const isRemoving = favorites.includes(carId);
    setToastMessage(isRemoving ? 'Removed from favorites' : 'Added to favorites!');
    setFavorites((previous) =>
      previous.includes(carId)
        ? previous.filter((id) => id !== carId)
        : [...previous, carId]
    );
  }, [favorites]);
  const clearToast = useCallback(() => setToastMessage(null), []);
  const contextValue = useMemo(
    () => ({ favorites, toggleFavorite, toastMessage, clearToast }),
    [favorites, toggleFavorite, toastMessage, clearToast]
  );

  return (
    <FavoritesContext.Provider value={contextValue}>
      {children}
    </FavoritesContext.Provider>
  );
}
