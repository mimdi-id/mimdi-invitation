import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar.jsx';
import { MdMenu, MdLogout } from 'react-icons/md';
import '../styling/Dashboard.css';

const DashboardLayout = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const toggleSidebar = () => {
        setIsCollapsed(!isCollapsed);
    };

    return (
        <div className="dashboard-layout">
            <Sidebar isCollapsed={isCollapsed} />
            <main className="dashboard-main-content">
                <header className="dashboard-header">
                    <div className="header-left">
                        <button onClick={toggleSidebar} className="hamburger-menu">
                            <MdMenu />
                        </button>
                        <h1 className="header-title">Super Admin</h1>
                    </div>
                    <div className="header-right">
                        <button onClick={handleLogout} className="logout-icon-button" title="Logout">
                            <MdLogout />
                        </button>
                    </div>
                </header>
                <div className="dashboard-page-content">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;

