'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'user'; // <--- Tipe Role
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string, userData: User) => void;
  logout: () => void;
  isLoading: boolean;
  isAdmin: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Fungsi untuk mendapatkan token dari localStorage
const getToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('api_token');
  }
  return null;
};

// Fungsi untuk mendapatkan user dari localStorage
const getUserData = (): User | null => {
    if (typeof window !== 'undefined') {
        const userJson = localStorage.getItem('user_data');
        return userJson ? JSON.parse(userJson) : null;
    }
    return null;
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(getUserData());
  const [token, setToken] = useState<string | null>(getToken());
  const [isLoading, setIsLoading] = useState(false); // Untuk inisialisasi

  const router = useRouter();

  // Memperbarui state dan localStorage saat login
  const login = (newToken: string, userData: User) => {
    setToken(newToken);
    setUser(userData);
    localStorage.setItem('api_token', newToken);
    localStorage.setItem('user_data', JSON.stringify(userData));
    router.push('/dashboard'); // Redirect setelah login
  };

  // Menghapus state dan localStorage saat logout
  const logout = async () => {
    // Panggil API Logout Laravel (Opsional, tapi disarankan)
    setIsLoading(true);
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/logout`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
        // Tidak peduli sukses/gagal, kita tetap hapus token lokal
    } catch (error) {
        console.error("Logout API call failed, but clearing local state.", error);
    }
    
    setToken(null);
    setUser(null);
    localStorage.removeItem('api_token');
    localStorage.removeItem('user_data');
    router.push('/auth/login'); // Redirect ke halaman login
    setIsLoading(false);
  };

  // Tambahkan helper function
  const isAdmin = () => {
      return user?.role === 'admin';
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoading, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom Hook untuk menggunakan AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};