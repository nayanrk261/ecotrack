/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { User } from '../types';

type RegisteredUser = User & { password?: string };

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AVATAR_GRADIENTS = [
  'from-emerald-400 to-teal-600 text-slate-950',
  'from-green-400 to-emerald-600 text-slate-950',
  'from-cyan-400 to-blue-600 text-slate-950',
  'from-indigo-500 to-purple-600 text-white',
  'from-purple-500 to-pink-600 text-white',
  'from-pink-500 to-rose-600 text-white',
  'from-amber-400 to-orange-600 text-slate-950',
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const activeSession = localStorage.getItem('ecotrack_current_user');
      return activeSession ? (JSON.parse(activeSession) as User) : null;
    } catch (e) {
      console.error('Failed to load user session:', e);
      return null;
    }
  });
  const [isLoading, setIsLoading] = useState(false);

  const login = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    // Simulate API network latency (400ms)
    await new Promise((resolve) => setTimeout(resolve, 400));

    try {
      const registeredUsersRaw = localStorage.getItem('ecotrack_users');
      let users: RegisteredUser[] = [];
      if (registeredUsersRaw) {
        try {
          users = JSON.parse(registeredUsersRaw) as RegisteredUser[];
        } catch {
          users = [];
        }
      }
      
      const foundUser = users.find(
        (u: RegisteredUser) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
      );

      if (!foundUser) {
        throw new Error('Invalid email or password');
      }

      const userSession: User = {
        id: foundUser.id,
        name: foundUser.name,
        email: foundUser.email,
        avatarBg: foundUser.avatarBg,
      };

      localStorage.setItem('ecotrack_current_user', JSON.stringify(userSession));
      setUser(userSession);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string): Promise<void> => {
    setIsLoading(true);
    // Simulate API network latency (400ms)
    await new Promise((resolve) => setTimeout(resolve, 400));

    try {
      const registeredUsersRaw = localStorage.getItem('ecotrack_users');
      let users: RegisteredUser[] = [];
      if (registeredUsersRaw) {
        try {
          users = JSON.parse(registeredUsersRaw) as RegisteredUser[];
        } catch {
          users = [];
        }
      }

      const emailExists = users.some((u: RegisteredUser) => u.email.toLowerCase() === email.toLowerCase());
      if (emailExists) {
        throw new Error('An account with this email already exists');
      }

      // Assign a random premium gradient for user avatar
      const avatarBg = AVATAR_GRADIENTS[Math.floor(Math.random() * AVATAR_GRADIENTS.length)];
      const newUser = {
        id: crypto.randomUUID(),
        name,
        email: email.toLowerCase(),
        password,
        avatarBg,
      };

      const updatedUsers = [...users, newUser];
      localStorage.setItem('ecotrack_users', JSON.stringify(updatedUsers));

      const userSession: User = {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        avatarBg: newUser.avatarBg,
      };

      localStorage.setItem('ecotrack_current_user', JSON.stringify(userSession));
      setUser(userSession);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('ecotrack_current_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

