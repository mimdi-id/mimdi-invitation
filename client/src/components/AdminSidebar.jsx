import React from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css'; // Bisa menggunakan styling yang sama

const AdminSidebar = ({ onLogout }) => {
    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <h2>Dasbor Admin</h2>
            </div>
            <nav className="sidebar-nav">
                <NavLink to="/admin/dashboard">Daftar Undangan</NavLink>
                <NavLink to="/admin/create">Buat Undangan Baru</NavLink>
            </nav>
            <div className="sidebar-footer">
                <button onClick={onLogout} className="logout-button">
                    Logout
                </button>
            </div>
        </aside>
    );
};
export default AdminSidebar;
