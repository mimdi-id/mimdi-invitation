import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './LandingPage.css';

const HeroSection = () => {
    return (
        <section className="hero-section-landing" id="hero">
            <div className="landing-container">
                <div className="hero-content">
                    <h1 className="hero-title">
                        Bagikan Momen Bahagia Anda dengan Undangan Digital Terbaik
                    </h1>
                    <p className="hero-subtitle">
                        Buat dan sesuaikan undangan pernikahan digital Anda dengan mudah.
                        Pilih dari puluhan tema eksklusif dan bagikan kebahagiaan tanpa batas.
                    </p>
                    <div className="hero-buttons">
                        <a href="#themes" className="btn btn-primary">Lihat Desain Tema</a>
                        <a href="#pricing" className="btn btn-secondary">Lihat Paket Harga</a>
                    </div>
                </div>
                <div className="hero-image">
                    <img src="https://placehold.co/500x700/FFF0E5/FF5722?text=Contoh\nUndangan" alt="Contoh Undangan Digital" />
                </div>
            </div>
        </section>
    );
};

const ThemeGallerySection = () => {
    // ... (kode di dalam komponen ini tetap sama)
    const [themes, setThemes] = useState([]);
    const [loading, setLoading] = useState(true);
    const serverUrl = 'http://localhost:5000';

    useEffect(() => {
        const fetchThemes = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/themes');
                setThemes(response.data.data || []);
            } catch (error) {
                console.error("Gagal memuat tema:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchThemes();
    }, []);

    return (
        <section className="landing-section" id="themes">
            <div className="landing-container">
                <h2 className="section-title">Desain Eksklusif Sesuai Gayamu</h2>
                <p className="section-subtitle">Pilih dari berbagai tema yang dirancang secara profesional untuk setiap selera.</p>
                <div className="theme-gallery-grid">
                    {loading ? <p>Memuat tema...</p> : themes.map(theme => (
                        <div key={theme.id} className="theme-gallery-card">
                            <img src={`${serverUrl}${theme.preview_image_url}`} alt={theme.name} />
                            <div className="theme-gallery-info">
                                <h3>{theme.name}</h3>
                                <span>{theme.tier}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

// --- KOMPONEN BARU: TABEL HARGA ---
const PricingSection = () => {
    const [packages, setPackages] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPackages = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/packages');
                setPackages(response.data.data || []);
            } catch (error) {
                console.error("Gagal memuat paket:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPackages();
    }, []);

    return (
        <section className="landing-section" id="pricing">
            <div className="landing-container">
                <h2 className="section-title">Paket Harga Transparan</h2>
                <p className="section-subtitle">Pilih paket yang paling sesuai dengan kebutuhan Anda tanpa biaya tersembunyi.</p>
                <div className="pricing-grid">
                    {loading ? <p>Memuat paket...</p> : packages.map(pkg => (
                        <div key={pkg.id} className="pricing-card">
                            <h3>{pkg.name}</h3>
                            <p className="price">Rp {Number(pkg.price).toLocaleString('id-ID')}</p>
                            <ul>
                                <li><strong>{pkg.active_period_months}</strong>  Bulan Masa Aktif</li>
                                <li><strong>{pkg.photo_limit}</strong>  Foto Galeri</li>
                                <li><strong>{pkg.revisions_limit}x</strong>  Revisi</li>
                            </ul>
                            <a href="#" className="btn btn-primary">Pesan Sekarang</a>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

const LandingPage = () => {
    return (
        <div className="landing-page">
            <Navbar />
            <main>
                <HeroSection />
                <ThemeGallerySection />
                <PricingSection />
            </main>
            <Footer />
        </div>
    );
};

export default LandingPage;
