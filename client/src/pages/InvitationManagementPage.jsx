import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './ManagementPage.css'; // Menggunakan styling bersama

const InvitationManagementPage = () => {
    const [invitations, setInvitations] = useState([]);
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

    useEffect(() => {
        const fetchAllInvitations = async () => {
            setLoading(true);
            const api = createApiInstance();
            if (!api) return;
            try {
                const response = await api.get('/invitations/all');
                setInvitations(response.data.data || []);
            } catch (err) {
                console.error('Error fetching all invitations:', err);
                if (err.response?.status === 401 || err.response?.status === 403) {
                    handleLogout();
                }
            } finally {
                setLoading(false);
            }
        };
        fetchAllInvitations();
    }, [createApiInstance, handleLogout]);

    if (loading) {
        return <div className="loading-spinner">Memuat semua undangan...</div>;
    }

    return (
        <div className="management-page">
            <header className="page-header">
                <h1>Semua Undangan</h1>
            </header>
            <div className="list-card card" style={{ gridColumn: '1 / -1' }}>
                <h2>Daftar Seluruh Undangan di Sistem</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Judul</th>
                            <th>Admin Pembuat</th>
                            <th>Slug</th>
                            <th>PIN Klien</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {invitations.length > 0 ? (
                            invitations.map(inv => (
                                <tr key={inv.id}>
                                    <td>{inv.title}</td>
                                    <td>{inv.admin?.username || '-'}</td>
                                    <td>{inv.slug}</td>
                                    <td>{inv.client_pin_plain || '(Tidak Ada)'}</td>
                                    <td>
                                        <span className={`status-badge status-${inv.status.toLowerCase()}`}>
                                            {inv.status}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5">Belum ada undangan yang dibuat di sistem.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default InvitationManagementPage;

