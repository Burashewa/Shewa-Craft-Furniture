import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import * as authService from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    (async () => {
      try {
        const current = await authService.getCurrentUser();
        if (active) setUser(current);
      } catch {
        if (active) setUser(null);
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  const signIn = useCallback(async ({ email, password, remember }) => {
    const nextUser = await authService.signIn({ email, password, remember });
    setUser(nextUser);
    return nextUser;
  }, []);

  const signUp = useCallback(async ({ fullName, email, password }) => {
    const nextUser = await authService.signUp({ fullName, email, password });
    setUser(nextUser);
    return nextUser;
  }, []);

  const signOut = useCallback(() => {
    authService.signOut();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      loading,
      signIn,
      signUp,
      signOut,
    }),
    [user, loading, signIn, signUp, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
