import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Import komponen-komponen utama yang akan dijadikan halaman
import LoginPage from './pages/LoginPage';
import PrivateRoute from './components/PrivateRoute';
import DashboardLayout from './pages/DashboardLayout';
import AdminManagementPage from './pages/AdminManagementPage';
import PackageManagementPage from './pages/PackageManagementPage';
import ThemeManagementPage from './pages/ThemeManagementPage';

// Import CSS global
import './App.css';

function App() {
  return (
    // Membungkus seluruh aplikasi dengan Router untuk mengaktifkan routing
    <Router>
      {/* 'Routes' adalah komponen yang menampung semua definisi rute */}
      <Routes>
        
        {/* === RUTE PUBLIK === */}
        {/* Siapa pun bisa mengakses rute ini */}
        <Route path="/login" element={<LoginPage />} />
        
        {/* === GRUP RUTE DASBOR (PRIVAT) === */}
        {/* Rute ini dan semua anakannya dilindungi oleh PrivateRoute */}
        <Route 
          path="/dashboard" 
          element={
            <PrivateRoute>
              <DashboardLayout />
            </PrivateRoute>
          }
        >
          {/* Rute-rute ini akan dirender di dalam <Outlet /> pada DashboardLayout */}
          <Route path="admins" element={<AdminManagementPage />} />
          <Route path="packages" element={<PackageManagementPage />} />
          <Route path="themes" element={<ThemeManagementPage />} />
          
          {/* Rute 'index' ini adalah rute default untuk '/dashboard' */}
          {/* Jika pengguna mengunjungi '/dashboard', mereka akan otomatis diarahkan ke '/dashboard/admins' */}
          <Route index element={<Navigate to="admins" replace />} />
        </Route>
        
        {/* === RUTE FALLBACK === */}
        {/* Jika pengguna mengunjungi URL yang tidak terdefinisi, arahkan ke halaman login */}
        <Route path="*" element={<Navigate to="/login" replace />} />

      </Routes>
    </Router>
  );
}

export default App;

