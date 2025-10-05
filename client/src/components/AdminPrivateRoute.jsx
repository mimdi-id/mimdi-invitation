import React from 'react';
import { Navigate } from 'react-router-dom';

/**
 * Komponen PrivateRoute khusus untuk dasbor Admin.
 * Memeriksa otentikasi sebelum memberikan akses.
 * Di masa depan, bisa ditambahkan logika untuk memeriksa peran 'Admin'.
 */
const AdminPrivateRoute = ({ children }) => {
  // Memeriksa apakah token ada di localStorage
  const isAuthenticated = !!localStorage.getItem('token');

  // Jika pengguna terotentikasi, tampilkan komponen anak (yaitu, AdminDashboardLayout).
  // Jika tidak, arahkan kembali ke halaman login.
  return isAuthenticated ? children : <Navigate to="/login" />;
};

// BARIS YANG HILANG SEBELUMNYA ADA DI SINI:
export default AdminPrivateRoute;

