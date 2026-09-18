import { createContext, useContext, useState, useCallback, useEffect } from 'react';

const AuthContext = createContext(null);

function loadUser() {
  try {
    const raw = localStorage.getItem('lm_user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function loadUsers() {
  try {
    const raw = localStorage.getItem('lm_users');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(loadUser);

  useEffect(() => {
    if (user) {
      localStorage.setItem('lm_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('lm_user');
    }
  }, [user]);

  const signUp = useCallback((data) => {
    const users = loadUsers();
    const exists = users.find((u) => u.phone === data.phone);
    if (exists) return { error: 'An account with this phone number already exists.' };

    const newUser = {
      id: Date.now().toString(36),
      name: data.name,
      address: data.address,
      phone: data.phone,
      email: data.email,
      password: data.password,
      card: data.card || null,
      createdAt: new Date().toISOString(),
    };
    users.push(newUser);
    localStorage.setItem('lm_users', JSON.stringify(users));
    const { password: _, ...safeUser } = newUser;
    setUser(safeUser);
    return { success: true };
  }, []);

  const signIn = useCallback((phone, password) => {
    const users = loadUsers();
    const match = users.find((u) => u.phone === phone && u.password === password);
    if (!match) return { error: 'Invalid phone number or password.' };
    const { password: _, ...safeUser } = match;
    setUser(safeUser);
    return { success: true };
  }, []);

  const signOut = useCallback(() => {
    setUser(null);
  }, []);

  const updateProfile = useCallback((updates) => {
    setUser((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, ...updates };
      const users = loadUsers();
      const idx = users.findIndex((u) => u.id === prev.id);
      if (idx >= 0) {
        users[idx] = { ...users[idx], ...updates };
        localStorage.setItem('lm_users', JSON.stringify(users));
      }
      return updated;
    });
  }, []);

  return (
    <AuthContext.Provider value={{ user, signUp, signIn, signOut, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
