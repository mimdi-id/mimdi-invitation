import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
// Memastikan import CSS ini benar sesuai dengan lokasi file
import './DashboardLayout.css'; 

const DashboardLayout = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <div className="dashboard-layout">
            <Sidebar onLogout={handleLogout} />
            <main className="dashboard-main-content">
                {/* Outlet akan merender halaman manajemen (Admin, Paket, Tema) */}
                <Outlet />
            </main>
        </div>
    );
};

export default DashboardLayout;

