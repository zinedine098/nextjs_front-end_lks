'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';

export default function RootPage() {
  const { user, token, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Jika proses loading selesai
    if (!isLoading) {
      if (token && user) {
        // Jika sudah login, arahkan ke Dashboard
        router.push('/dashboard');
      } else {
        // Jika BELUM login, arahkan ke Login
        router.push('/auth/login');
      }
    }
  }, [token, user, isLoading, router]);

  // Tampilkan pesan loading sementara proses pengecekan status
  return (
    <div className="flex justify-center items-center min-h-screen text-lg">
      Memeriksa status otentikasi...
    </div>
  );
}