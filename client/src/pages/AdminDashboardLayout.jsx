import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';
import './DashboardLayout.css'; // Menggunakan styling yang sama

const AdminDashboardLayout = () => {
    const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };
    return (
        <div className="dashboard-layout">
            <AdminSidebar onLogout={handleLogout} />
            <main className="dashboard-main-content">
                <Outlet />
            </main>
        </div>
    );
};
export default AdminDashboardLayout;
