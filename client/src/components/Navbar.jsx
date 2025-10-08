import React from 'react';
import { Link } from 'react-router-dom'; // Gunakan Link untuk navigasi internal
import './Navbar.css'; // CSS khusus untuk Navbar

const Navbar = () => {
    return (
        <header className="navbar-landing">
            <div className="navbar-container">
                <Link to="/" className="navbar-logo">
                    Mimdi.id
                </Link>
                <nav className="navbar-menu">
                    <a href="#features" className="navbar-link">Fitur</a>
                    <a href="#themes" className="navbar-link">Tema</a>
                    <a href="#pricing" className="navbar-link">Harga</a>
                    <a href="#faq" className="navbar-link">FAQ</a>
                </nav>
                <div className="navbar-actions">
                    <Link to="/login" className="btn btn-login">
                        Login
                    </Link>
                    <a href="#pricing" className="btn btn-register">
                        Daftar
                    </a>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
