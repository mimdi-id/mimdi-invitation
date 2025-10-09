import React from 'react';
import { NavLink } from 'react-router-dom';
// FIX: Memperbaiki path import ikon dan CSS
import { FaListUl, FaClipboard } from 'react-icons/fa';
import '../styling/Dashboard.css';

const AdminSidebar = ({ isCollapsed }) => {
    return (
        <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
            <div className="sidebar-header">
                <img src="/logo.svg" alt="Mimdi Logo" className="sidebar-logo" />
                {!isCollapsed && <h1>Admin</h1>}
            </div>
            <nav className="sidebar-nav">
                <NavLink to="/admin/dashboard" title="Daftar Undangan">
                    <FaListUl />
                    {!isCollapsed && <span>Daftar Undangan</span>}
                </NavLink>
                <NavLink to="/admin/orders" title="Kelola Pesanan">
                    <FaClipboard />
                    {!isCollapsed && <span>Kelola Pesanan</span>}
                </NavLink>
                {/* Link "Buat Undangan Baru" telah dihapus karena fungsinya kini ada di halaman Daftar Undangan */}
            </nav>
        </aside>
    );
};

export default AdminSidebar;

