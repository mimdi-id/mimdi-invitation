import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './ThemeSelectionSection.css';

const ThemeSelectionSection = ({ currentThemeId, onThemeSelect }) => {
    const [themes, setThemes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const serverUrl = 'http://localhost:5000';

    const fetchThemes = useCallback(async () => {
        setLoading(true);
        try {
            // API untuk mengambil tema bisa diakses oleh semua pengguna yang login
            // Kita tidak perlu token karena endpoint ini publik (atau setidaknya bisa diakses admin/klien)
            const response = await axios.get('http://localhost:5000/api/themes');
            setThemes(response.data.data || []);
        } catch (err) {
            console.error("Gagal memuat tema:", err);
            setError("Tidak dapat memuat daftar tema. Coba lagi nanti.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchThemes();
    }, [fetchThemes]);

    if (loading) {
        return <div className="loading-spinner">Memuat tema...</div>;
    }
    if (error) {
        return <p className="error-message">{error}</p>
    }

    return (
        <div className="theme-selection-section card">
            <h2>Pilih Tema Undangan Anda</h2>
            <p>Klik "Gunakan Tema Ini" untuk menerapkan desain baru pada undangan publik Anda.</p>
            <div className="theme-grid">
                {themes.map(theme => (
                    <div key={theme.id} className={`theme-card ${currentThemeId === theme.id ? 'active' : ''}`}>
                        <img src={`${serverUrl}${theme.preview_image_url}`} alt={theme.name} className="theme-preview-img" />
                        <div className="theme-info">
                            <h3>{theme.name}</h3>
                            <button 
                                onClick={() => onThemeSelect(theme.id)}
                                disabled={currentThemeId === theme.id}
                                className="apply-theme-btn"
                            >
                                {currentThemeId === theme.id ? 'Tema Aktif' : 'Gunakan Tema Ini'}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ThemeSelectionSection;

