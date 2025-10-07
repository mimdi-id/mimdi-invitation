import React from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';

const AdminSidebar = ({ onLogout }) => {
    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <h2>Dasbor Admin</h2>
            </div>
            <nav className="sidebar-nav">
                <NavLink to="/admin/dashboard">Daftar Undangan</NavLink>
                {/* --- LINK BARU --- */}
                <NavLink to="/admin/orders">Kelola Pesanan</NavLink>
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

