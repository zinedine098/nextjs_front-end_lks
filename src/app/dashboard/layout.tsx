'use client';

import { useState, ReactNode, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';

type DashboardLayoutProps = {
  children: ReactNode;
};

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Fungsi untuk toggle sidebar
  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleLogout = () => {
    logout();
  };

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: 'bi-speedometer2' },
    { href: '/dashboard/HomePage', label: 'HomePage', icon: 'bi-person' },
    { href: '/dashboard/MyPost', label: 'MyPost', icon: 'bi-gear' },
  ];

  return (
    <div className="d-flex" style={{ minHeight: '100vh' }}>
      {/* Sidebar */}
      <aside
        className="d-flex flex-column flex-shrink-0 p-3 bg-white border-end transition-all"
        style={{
          width: isCollapsed ? '80px' : '280px',
          transition: 'width 0.3s ease-in-out',
        }}
      >
        {/* Header dengan Tombol Toggle */}
        <div className="d-flex align-items-center justify-content-between">
          <Link
            href="/dashboard"
            className="d-flex align-items-center text-black text-decoration-none"
            style={{ visibility: isCollapsed ? 'hidden' : 'visible' }}
          >
            {/* <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-grid-3x3-gap-fill me-2" viewBox="0 0 16 16">
              <path d="M1 2a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2zm5 0a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V2zm5 0a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1V2zM1 7a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V7zm5 0a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7zm5 0a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1V7zM1 12a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1v-2zm5 0a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1v-2zm5 0a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-2z"/>
            </svg> */}
            {!isCollapsed && <span className="fs-4 fw-bold">Dashboard</span>}
          </Link>
          <button
            onClick={toggleSidebar}
            className="btn btn-link text-black p-0 border-0"
            style={{ marginLeft: isCollapsed ? 'auto' : '0' }}
          >
            <i className={`bi ${isCollapsed ? 'bi-chevron-right' : 'bi-chevron-left'}`}></i>
          </button>
        </div>

        <hr />

        {/* Navigation Menu */}
        <ul className="nav nav-pills flex-column mb-auto">
          {navItems.map((item) => (
            <li className="nav-item" key={item.href}>
              <Link
                href={item.href}
                className={`nav-link d-flex align-items-center gap-3 rounded mb-1 ${
                  pathname === item.href
                    ? 'active text-white bg-black'
                    : 'text-black'
                }`}
                style={{
                  justifyContent: isCollapsed ? 'center' : 'flex-start',
                  padding: isCollapsed ? '12px 0' : '8px 12px',
                }}
                title={item.label} // Tooltip saat collapsed
              >
                <i className={`bi ${item.icon} fs-5`}></i>
                {!isCollapsed && <span>{item.label}</span>}
              </Link>
            </li>
          ))}
        </ul>

        {/* <hr className="mt-auto" /> */}

        {/* User Profile & Logout di Bagian Bawah */}
        <div className="mt-auto">
            <hr />
          {!isCollapsed ? (
            // Tampilan saat sidebar dibuka
            <div className="d-flex align-items-center">
              <img src="https://github.com/mdo.png" alt="User" width="40" height="40" className="rounded-circle me-3" />
              <div className="flex-grow-1">
                <strong className="d-block text-black">{user?.name || 'User'}</strong>
                <small className="text-muted">{user?.email || 'email@example.com'}</small>
              </div>
            </div>
          ) : (
            // Tampilan saat sidebar ditutup (hanya avatar)
            <div className="d-flex justify-content-center">
              <img src="https://github.com/mdo.png" alt="User" width="40" height="40" className="rounded-circle" />
            </div>
          )}

          <button
            onClick={handleLogout}
            className={`btn w-100 mt-3 d-flex align-items-center justify-content-center gap-2 text-white bg-black border-black ${isCollapsed ? 'p-2' : ''}`}
            title="Keluar"
          >
            <i className="bi bi-box-arrow-right"></i>
            {!isCollapsed && <span>Keluar</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main
        className="flex-grow-1 p-4 bg-light"
        style={{
          marginLeft: isCollapsed ? '80px' : '0px',
          transition: 'margin-left 0.3s ease-in-out',
        }}
      >
        {children}
      </main>
    </div>
  );
}