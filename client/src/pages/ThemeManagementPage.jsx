import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './ManagementPage.css'; // Menggunakan CSS bersama

const ThemeManagementPage = () => {
    // State untuk daftar tema, loading, dan form
    const [themes, setThemes] = useState([]);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    const handleLogout = useCallback(() => {
        localStorage.removeItem('token');
        navigate('/login');
    }, [navigate]);

    const createApiInstance = useCallback(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            handleLogout();
            return null;
        }
        return axios.create({
            baseURL: 'http://localhost:5000/api',
            headers: { 'Authorization': `Bearer ${token}` }
        });
    }, [handleLogout]);

    // Fungsi untuk mengambil data tema
     const fetchThemes = useCallback(async () => {
        setLoading(true);
        try {
            const api = createApiInstance();
            if (!api) return;
            const response = await api.get('/themes');
            setThemes(response.data.data || []);
        } catch (err) {
            console.error('Fetch themes error:', err);
        } finally {
            setLoading(false);
        }
    }, [createApiInstance]);

    useEffect(() => {
        fetchThemes();
    }, [fetchThemes]);

    if (loading) {
        return <div className="loading-spinner">Memuat data tema...</div>;
    }

    return (
        <div className="management-page">
             <header className="page-header">
                <h1>Kelola Tema</h1>
            </header>
             <div className="content-grid">
                <div className="form-card card">
                    <h2>Tambah/Edit Tema</h2>
                    {/* Form untuk tema akan dibuat di sini */}
                    <p>Form untuk menambah dan mengedit tema akan ada di sini.</p>
                </div>
                <div className="list-card card">
                    <h2>Daftar Tema</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>Nama</th>
                                <th>Tingkat</th>
                            </tr>
                        </thead>
                        <tbody>
                            {themes.length > 0 ? (
                                themes.map(theme => (
                                    <tr key={theme.id}>
                                        <td>{theme.name}</td>
                                        <td>{theme.tier}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="2">Belum ada tema.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ThemeManagementPage;
