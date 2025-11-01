import { useState, useEffect } from 'react';

export interface User {
  id: string;
  email: string;
  name: string;
  created_at: string;
}

interface AuthState {
  user: User | null;
  loading: boolean;
}

// Create a default user
const defaultUser: User = {
  id: '1',
  email: 'default@user.com',
  name: 'Default User',
  created_at: new Date().toISOString()
};

// Global state to share between all hook instances
let globalAuthState: AuthState = {
  user: defaultUser,  // Always use the default user
  loading: false
};

let authStateListeners: Set<(state: AuthState) => void> = new Set();

// Function to notify all listeners
const notifyListeners = (newState: AuthState) => {
  globalAuthState = newState;
  authStateListeners.forEach(listener => listener(newState));
};

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>(globalAuthState);

  // Register this component as a listener
  useEffect(() => {
    const listener = (newState: AuthState) => {
      setAuthState(newState);
    };
    authStateListeners.add(listener);
    
    return () => {
      authStateListeners.delete(listener);
    };
  }, []);

  // Function to check and update auth state
  const checkAuthState = () => {
    const savedUser = localStorage.getItem('anime_app_user');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        const newState = { user, loading: false };
        notifyListeners(newState);
        return user;
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('anime_app_user');
        const newState = { user: null, loading: false };
        notifyListeners(newState);
        return null;
      }
    } else {
      const newState = { user: null, loading: false };
      notifyListeners(newState);
      return null;
    }
  };

  useEffect(() => {
    // Only check auth state on initial mount if it hasn't been checked yet
    if (globalAuthState.loading) {
      checkAuthState();
    }
  }, []);

  // Listen for storage changes (in case user logs in from another tab)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'anime_app_user') {
        checkAuthState();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const signUp = async (email: string, password: string) => {
    try {
      // Check if user already exists
      const existingUsers = JSON.parse(localStorage.getItem('anime_app_users') || '[]');
      if (existingUsers.find((u: any) => u.email === email)) {
        return { data: null, error: { message: 'User already exists' } };
      }

      // Validate password
      if (password.length < 6) {
        return { data: null, error: { message: 'Password must be at least 6 characters' } };
      }

      // Create new user
      const newUser: User = {
        id: Date.now().toString(),
        email,
        name: email.split('@')[0],
        created_at: new Date().toISOString()
      };

      // Save to users list
      existingUsers.push({ ...newUser, password });
      localStorage.setItem('anime_app_users', JSON.stringify(existingUsers));

      // Set as current user
      localStorage.setItem('anime_app_user', JSON.stringify(newUser));
      
      // Force immediate state update for all components
      const newState = { user: newUser, loading: false };
      notifyListeners(newState);

      return { data: { user: newUser }, error: null };
    } catch (error) {
      return { data: null, error: { message: 'Sign up failed' } };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const existingUsers = JSON.parse(localStorage.getItem('anime_app_users') || '[]');
      const user = existingUsers.find((u: any) => u.email === email && u.password === password);

      if (!user) {
        return { data: null, error: { message: 'Invalid email or password' } };
      }

      const userData: User = {
        id: user.id,
        email: user.email,
        name: user.name,
        created_at: user.created_at
      };

      localStorage.setItem('anime_app_user', JSON.stringify(userData));
      
      // Force immediate state update for all components
      const newState = { user: userData, loading: false };
      notifyListeners(newState);

      return { data: { user: userData }, error: null };
    } catch (error) {
      return { data: null, error: { message: 'Sign in failed' } };
    }
  };

  const signOut = async () => {
    try {
      localStorage.removeItem('anime_app_user');
      const newState = { user: null, loading: false };
      notifyListeners(newState);
      return { error: null };
    } catch (error) {
      return { error: { message: 'Sign out failed' } };
    }
  };

  return {
    user: authState.user,
    loading: authState.loading,
    signUp,
    signIn,
    signOut,
  };
}
