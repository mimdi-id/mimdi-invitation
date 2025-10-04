import React from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = ({ onLogout }) => {
    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <h2>Mimdi Admin</h2>
            </div>
            <nav className="sidebar-nav">
                {/* NavLink akan secara otomatis menambahkan class 'active' */}
                <NavLink to="/dashboard/admins">Kelola Admin</NavLink>
                <NavLink to="/dashboard/packages">Kelola Paket</NavLink>
                <NavLink to="/dashboard/themes">Kelola Tema</NavLink>
            </nav>
            <div className="sidebar-footer">
                <button onClick={onLogout} className="logout-button">
                    Logout
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;

