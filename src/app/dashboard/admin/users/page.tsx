'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';

export default function AdminUsersPage() {
    const { user, token, isAdmin } = useAuth();
    const router = useRouter();
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // 1. PROTEKSI RUTE
    useEffect(() => {
        if (!user) return; // Tunggu data user dimuat

        if (!isAdmin()) {
            // Jika BUKAN Admin, paksa redirect ke Dashboard biasa
            alert("Akses ditolak. Hanya Admin yang dapat melihat halaman ini.");
            router.push('/dashboard');
        } else {
            // Jika Admin, mulai fetching data
            fetchAdminData();
        }
    }, [user, token, router, isAdmin]);
    
    // 2. FETCH DATA YANG DIAMANKAN OLEH LARAVEL ADMIN MIDDLEWARE
    const fetchAdminData = async () => {
        if (!token) return;
        setLoading(true);
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/users`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.status === 403) {
                // Laravel AdminMiddleware menolak akses
                alert("Server menolak akses (403). Role Anda tidak valid.");
                router.push('/dashboard');
                return;
            }

            const data = await response.json();
            setUsers(data);
        } catch (error) {
            console.error("Gagal mengambil data admin:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="p-8">Memuat Data Admin...</div>;
    }

    if (!isAdmin()) {
        // Ini adalah fallback UI sebelum redirect terjadi
        return null; 
    }

    // Tampilkan konten HANYA untuk Admin
    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-6">Kelola Semua Pengguna (Admin Only)</h1>
            <p className="text-green-600 mb-4">Anda berhasil mengakses rute yang dilindungi Role Admin!</p>
            {/* Tampilkan daftar users */}
            <ul>
                {users.map(u => (
                    <li key={u.id}>[{u.role}] - {u.name} ({u.email})</li>
                ))}
            </ul>
        </div>
    );
}