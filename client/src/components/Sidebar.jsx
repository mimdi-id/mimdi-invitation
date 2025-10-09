import React from 'react';
import { NavLink } from 'react-router-dom';
// FIX: Mencoba path impor ikon yang berbeda untuk mengatasi masalah resolusi
import { 
    FaUserShield,
    FaBoxOpen, 
    FaPalette, 
    FaFileInvoice,
} from 'react-icons/fa'; 
// FIX: Menggunakan path absolut dari root src untuk memastikan file ditemukan
import '/src/styling/Dashboard.css';

const Sidebar = ({ isCollapsed }) => {
    return (
        <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
            <div className="sidebar-header">
                <img src="/logo.svg" alt="Mimdi Logo" className="sidebar-logo" />
                {!isCollapsed && <h1>Mimdi Admin</h1>}
            </div>
            <nav className="sidebar-nav">
                <NavLink to="/dashboard/admins" title="Kelola Admin">
                    <FaUserShield />
                    <span>Kelola Admin</span>
                </NavLink>
                <NavLink to="/dashboard/invitations" title="Semua Undangan">
                    <FaFileInvoice />
                    <span>Semua Undangan</span>
                </NavLink>
                <NavLink to="/dashboard/packages" title="Kelola Paket">
                    <FaBoxOpen />
                    <span>Kelola Paket</span>
                </NavLink>
                <NavLink to="/dashboard/themes" title="Kelola Tema">
                    <FaPalette />
                    <span>Kelola Tema</span>
                </NavLink>
            </nav>
        </aside>
    );
};

export default Sidebar;

