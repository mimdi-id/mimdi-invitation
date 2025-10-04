import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './ManagementPage.css'; // Menggunakan CSS bersama

const PackageManagementPage = () => {
    // State untuk daftar paket, loading, dan form
    const [packages, setPackages] = useState([]);
    const [loading, setLoading] = useState(true);
    // ... state lainnya untuk form (nama, harga, dll.)

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

    // Fungsi untuk mengambil data paket
    const fetchPackages = useCallback(async () => {
        setLoading(true);
        try {
            const api = createApiInstance();
            if (!api) return;
            const response = await api.get('/packages');
            setPackages(response.data.data || []);
        } catch (err) {
            console.error('Fetch packages error:', err);
        } finally {
            setLoading(false);
        }
    }, [createApiInstance]);

    useEffect(() => {
        fetchPackages();
    }, [fetchPackages]);

    if (loading) {
        return <div className="loading-spinner">Memuat data paket...</div>;
    }

    return (
        <div className="management-page">
            <header className="page-header">
                <h1>Kelola Paket</h1>
            </header>
            <div className="content-grid">
                <div className="form-card card">
                    <h2>Tambah/Edit Paket</h2>
                    {/* Form untuk paket akan dibuat di sini */}
                    <p>Form untuk menambah dan mengedit paket akan ada di sini.</p>
                </div>
                <div className="list-card card">
                    <h2>Daftar Paket</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>Nama</th>
                                <th>Harga</th>
                                <th>Masa Aktif</th>
                                <th>Batas Foto</th>
                            </tr>
                        </thead>
                        <tbody>
                            {packages.length > 0 ? (
                                packages.map(pkg => (
                                    <tr key={pkg.id}>
                                        <td>{pkg.name}</td>
                                        <td>Rp {Number(pkg.price).toLocaleString('id-ID')}</td>
                                        <td>{pkg.active_period_months} bulan</td>
                                        <td>{pkg.photo_limit}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4">Belum ada paket.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default PackageManagementPage;
