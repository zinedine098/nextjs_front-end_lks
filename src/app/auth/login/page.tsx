'use client';

import { useState } from 'react';
import { useAuth } from '@/components/AuthProvider';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMessage =
          data.message ||
          (data.errors ? Object.values(data.errors).flat().join(', ') : 'Login gagal.');
        throw new Error(errorMessage);
      }

      login(data.access_token, data.user);
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan saat login.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="d-flex justify-content-center align-items-center min-vh-100 bg-white">
      <div className="w-100" style={{ maxWidth: '420px' }}>
        {/* Header/Brand Section */}
        <div className="border rounded shadow-sm p-4 p-md-5">
        <div className="text-center mb-4">
          <div className="d-inline-flex align-items-center justify-content-center bg-black text-white rounded-circle mb-3 p-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="bi bi-lock-fill" viewBox="0 0 16 16">
              <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"/>
            </svg>
          </div>
          <h1 className="fw-bold mb-2">Selamat Datang</h1>
          <p className="text-muted">Masuk ke akun Anda untuk melanjutkan</p>
        </div>

        {/* Login Form Card */}
          <form onSubmit={handleSubmit} noValidate>
            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}

            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Alamat Email
              </label>
              <input
                type="email"
                className="form-control"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@example.com"
                required
                disabled={loading}
              />
            </div>

            <div className="mb-4">
              <label htmlFor="password" className="form-label">
                Kata Sandi
              </label>
              <input
                type="password"
                className="form-control"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan kata sandi Anda"
                required
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              className="btn w-100 text-white bg-black border-black"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>
                  <span>Memproses...</span>
                </>
              ) : (
                'Login'
              )}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}