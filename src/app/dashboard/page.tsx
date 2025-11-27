'use client';

import { useAuth } from '@/components/AuthProvider';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const { user, token, logout, isLoading } = useAuth();
  const router = useRouter();

  // Proteksi Rute (Client-Side Redirect)
  useEffect(() => {
    // Jika token tidak ada dan isLoading selesai, redirect ke login
    if (!token && !isLoading) {
      router.push('/auth/login');
    }
  }, [token, isLoading, router]);

  if (!user || !token) {
    // Tampilkan loading/placeholder saat proses verifikasi token
    return <div className="p-8">Memuat data user...</div>;
  }

  // Tampilkan konten jika user sudah terotentikasi
  return (
    <div className="p-8">
      <h3 className="text-3xl font-bold mb-4">Dashboard Pengguna</h3>
      
      <p className="mb-2">Selamat datang, {user.name}</p>
      <p className="mb-6">Email Anda: {user.email}</p>
      
      {/* Contoh Fetching Data yang Dilindungi */}
      {/* <h2 className="text-2xl mt-8 mb-4">Data API Lain (Contoh)</h2> */}
      {/* Di sini Anda bisa membuat komponen terpisah untuk fetch data yang dilindungi
          dengan menyertakan header 'Authorization': `Bearer ${token}` */}
    </div>
  );
}