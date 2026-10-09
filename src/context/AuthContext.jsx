import { useCallback, useMemo, useState } from 'react';
import { currentUser } from '../data/mockData';
import { AuthContext } from './contexts';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(currentUser);

  const login = useCallback((profile = currentUser) => setUser(profile), []);
  const logout = useCallback(() => setUser(null), []);
  const contextValue = useMemo(
    () => ({ user, isAuthenticated: Boolean(user), login, logout }),
    [user, login, logout]
  );

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}
