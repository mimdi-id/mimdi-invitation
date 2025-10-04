import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem('token'); // Cek apakah token ada

  // Jika sudah terotentikasi, tampilkan komponen anak (DashboardPage).
  // Jika tidak, arahkan kembali ke halaman login.
  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default PrivateRoute;

