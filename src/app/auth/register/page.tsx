'use client';

import { useState } from 'react';
import { useAuth } from '@/components/AuthProvider';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth(); // Ambil fungsi login dari AuthContext

  // Pastikan Anda mengatur NEXT_PUBLIC_API_URL di file .env.local
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password, password_confirmation: passwordConfirmation }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Tangani error dari Laravel (misalnya 422 Validation Error)
        const errorMessage =
          data.message ||
          (data.errors ? Object.values(data.errors).flat().join(', ') : 'Pendaftaran gagal.');
        throw new Error(errorMessage);
      }

      // Pendaftaran berhasil: Langsung login dan simpan token
      login(data.access_token, data.user);

    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan saat mendaftar.');
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
          {/* <div className="d-inline-flex align-items-center justify-content-center bg-black text-white rounded-circle mb-3 p-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="bi bi-person-plus-fill" viewBox="0 0 16 16">
              <path d="M1 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/>
              <path fillRule="evenodd" d="M13.5 5a.5.5 0 0 1 .5.5V7h1.5a.5.5 0 0 1 0 1H14v1.5a.5.5 0 0 1-1 0V8h-1.5a.5.5 0 0 1 0-1H13V5.5a.5.5 0 0 1 .5-.5z"/>
            </svg>
          </div> */}
          <h4 className="fw-bold mb-2">Buat Akun Baru</h4>
          <p className="text-muted">Daftar sekarang untuk memulai</p>
        </div>

        {/* Register Form Card */}
          <form onSubmit={handleSubmit} noValidate>
            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}

            <div className="mb-3">
              <label htmlFor="name" className="form-label">
                Nama Lengkap
              </label>
              <input
                type="text"
                className="form-control"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                required
                disabled={loading}
              />
            </div>

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

            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                Kata Sandi
              </label>
              <input
                type="password"
                className="form-control"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimal 8 karakter"
                required
                disabled={loading}
              />
            </div>

            <div className="mb-4">
              <label htmlFor="password_confirmation" className="form-label">
                Konfirmasi Kata Sandi
              </label>
              <input
                type="password"
                className="form-control"
                id="password_confirmation"
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
                placeholder="Ulangi kata sandi Anda"
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
                  <span>Mendaftar...</span>
                </>
              ) : (
                'Daftar Sekarang'
              )}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}