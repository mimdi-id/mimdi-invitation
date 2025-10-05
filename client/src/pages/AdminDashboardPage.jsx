import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './ManagementPage.css'; // Menggunakan styling bersama

const AdminDashboardPage = () => {
    const [invitations, setInvitations] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Fungsi untuk logout, bisa digunakan kembali
    const handleLogout = useCallback(() => {
        localStorage.removeItem('token');
        navigate('/login');
    }, [navigate]);

    // Fungsi untuk membuat instance Axios dengan header otentikasi
    const createApiInstance = useCallback(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            handleLogout(); // Jika tidak ada token, paksa logout
            return null;
        }
        return axios.create({
            baseURL: 'http://localhost:5000/api',
            headers: { 'Authorization': `Bearer ${token}` }
        });
    }, [handleLogout]);

    // Fungsi untuk mengambil data undangan milik admin
    const fetchInvitations = useCallback(async () => {
        setLoading(true);
        const api = createApiInstance();
        if (!api) return;

        try {
            const response = await api.get('/invitations/my-invitations');
            setInvitations(response.data.data || []);
        } catch (err) {
            console.error('Error saat mengambil undangan:', err);
            // Jika token tidak valid atau akses ditolak, logout
            if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                handleLogout();
            }
        } finally {
            // Pastikan loading selalu dihentikan
            setLoading(false);
        }
    }, [createApiInstance, handleLogout]);

    // Panggil fungsi fetchInvitations saat komponen pertama kali dimuat
    useEffect(() => {
        fetchInvitations();
    }, [fetchInvitations]);

    // Tampilkan pesan loading saat data sedang diambil
    if (loading) {
        return <div className="loading-spinner">Memuat data undangan...</div>;
    }

    return (
        <div className="management-page">
            <header className="page-header">
                <h1>Daftar Undangan Saya</h1>
            </header>
            <div className="list-card card" style={{ gridColumn: '1 / -1' }}>
                <h2>Undangan yang Telah Dibuat</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Judul</th>
                            <th>Slug</th>
                            <th>PIN Klien</th>
                            <th>Status</th>
                            <th>Paket</th>
                        </tr>
                    </thead>
                    <tbody>
                        {invitations.length > 0 ? (
                            invitations.map(inv => (
                                <tr key={inv.id}>
                                    <td>{inv.title}</td>
                                    <td>{inv.slug}</td>
                                    <td>{inv.client_pin_plain || '(Tidak Ada)'}</td>
                                    <td>
                                        <span className={`status-badge status-${inv.status.toLowerCase()}`}>
                                            {inv.status}
                                        </span>
                                    </td>
                                    <td>{inv.package?.name || '-'}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5">Anda belum membuat undangan.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminDashboardPage;

