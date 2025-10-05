import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// --- Import Komponen Halaman dan Layout ---

// Komponen Umum
import LoginPage from './pages/LoginPage';

// Komponen untuk Dasbor Super Admin
import PrivateRoute from './components/PrivateRoute';
import DashboardLayout from './pages/DashboardLayout';
import AdminManagementPage from './pages/AdminManagementPage';
import PackageManagementPage from './pages/PackageManagementPage';
import ThemeManagementPage from './pages/ThemeManagementPage';


// Komponen untuk Dasbor Admin
// --- BARIS YANG HILANG ADA DI SINI ---
import AdminPrivateRoute from './components/AdminPrivateRoute'; 
// ---------------------------------
import AdminDashboardLayout from './pages/AdminDashboardLayout';
import AdminDashboardPage from './pages/AdminDashboardPage';
import CreateInvitationPage from './pages/CreateInvitationPage';

// Komponen untuk Klien
import ClientLoginPage from './pages/ClientLoginPage';
import ClientPrivateRoute from './components/ClientPrivateRoute';
import ClientDashboardPage from './pages/ClientDashboardPage';
import PublicInvitationPage from './pages/PublicInvitationPage';

import InvitationManagementPage from './pages/InvitationManagementPage';


// Import CSS Global
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        
        {/* === RUTE PUBLIK === */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/u/:slug/login" element={<ClientLoginPage />} />
        <Route path="/u/:slug" element={<PublicInvitationPage />} />
        
        {/* === GRUP RUTE DASBOR SUPER ADMIN (PRIVAT) === */}
        <Route 
          path="/dashboard" 
          element={ <PrivateRoute><DashboardLayout /></PrivateRoute> }
        >
          <Route path="admins" element={<AdminManagementPage />} />
          <Route path="packages" element={<PackageManagementPage />} />
          <Route path="themes" element={<ThemeManagementPage />} />
          <Route path="invitations" element={<InvitationManagementPage />} />
          <Route index element={<Navigate to="admins" replace />} />
        </Route>

        {/* === GRUP RUTE DASBOR ADMIN (PRIVAT) === */}
        <Route 
          path="/admin"
          element={ <AdminPrivateRoute><AdminDashboardLayout /></AdminPrivateRoute> }
        >
          <Route path="dashboard" element={<AdminDashboardPage />} />
          <Route path="create" element={<CreateInvitationPage />} />
          <Route index element={<Navigate to="dashboard" replace />} />
        </Route>
        
        {/* === GRUP RUTE DASBOR KLIEN (PRIVAT) === */}
        <Route
          path="/u/:slug/dashboard"
          element={ <ClientPrivateRoute><ClientDashboardPage /></ClientPrivateRoute> }
        />
        
        {/* === RUTE FALLBACK === */}
        <Route path="*" element={<Navigate to="/login" replace />} />

      </Routes>
    </Router>
  );
}

export default App;

