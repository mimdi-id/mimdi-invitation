import React from 'react';
import './Footer.css'; // CSS khusus untuk Footer

const Footer = () => {
    return (
        <footer className="footer-landing">
            <div className="footer-container">
                <div className="footer-about">
                    <h3>Mimdi.id</h3>
                    <p>Bagikan momen bahagiamu. Platform undangan digital modern untuk pernikahan dan berbagai acara lainnya.</p>
                </div>
                <div className="footer-links">
                    <h4>Navigasi</h4>
                    <ul>
                        <li><a href="#features">Fitur</a></li>
                        <li><a href="#themes">Tema</a></li>
                        <li><a href="#pricing">Harga</a></li>
                        <li><a href="#faq">FAQ</a></li>
                    </ul>
                </div>
                <div className="footer-contact">
                    <h4>Hubungi Kami</h4>
                    <p>Email: support@mimdi.id</p>
                    <p>WhatsApp: +62 812 3456 7890</p>
                </div>
            </div>
            <div className="footer-bottom">
                <p>&copy; {new Date().getFullYear()} Mimdi.id. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;
