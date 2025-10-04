import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
// Memastikan import CSS ini benar sesuai dengan nama file yang sudah diperbaiki
import './ManagementPage.css'; 

const AdminManagementPage = () => {
    // ... (sisa kode di dalam komponen ini tetap sama seperti sebelumnya) ...
    // State, functions (fetchAdmins, handleAddAdmin, dll) tidak berubah
    const [admins, setAdmins] = useState([]);
    const [loading, setLoading] = useState(true);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
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

    const fetchAdmins = useCallback(async () => {
        setLoading(true);
        try {
            const api = createApiInstance();
            if (!api) return;
            const response = await api.get('/admins');
            setAdmins(response.data.data || []);
        } catch (err) {
            console.error('Fetch admins error:', err.response ? err.response.data : err);
            if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                handleLogout();
            }
        } finally {
            setLoading(false);
        }
    }, [createApiInstance, handleLogout]);

    useEffect(() => {
        fetchAdmins();
    }, [fetchAdmins]);
    
    const handleAddAdmin = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        if (!username || !password) {
            setError('Username dan password tidak boleh kosong.');
            return;
        }
        try {
            const api = createApiInstance();
            if (!api) return;
            const response = await api.post('/admins', { username, password });
            setSuccess(response.data.message || 'Admin berhasil ditambahkan!');
            setUsername('');
            setPassword('');
            fetchAdmins();
        } catch (err) {
            setError(err.response?.data?.error || 'Gagal menambahkan admin.');
            console.error('Add admin error:', err.response ? err.response.data : err);
        }
    };
    
    if (loading) {
        return <div className="loading-spinner">Memuat data admin...</div>;
    }

    return (
        <div className="management-page">
            <header className="page-header">
                <h1>Kelola Admin</h1>
            </header>
            <div className="content-grid">
                <div className="form-card card">
                    <h2>Tambah Admin Baru</h2>
                    <form onSubmit={handleAddAdmin}>
                        <div className="form-group">
                            <label htmlFor="username">Username</label>
                            <input
                                type="text"
                                id="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Masukkan username admin"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Masukkan password"
                            />
                        </div>
                        <button type="submit" className="submit-button">Tambah Admin</button>
                        {error && <p className="error-message">{error}</p>}
                        {success && <p className="success-message">{success}</p>}
                    </form>
                </div>
                <div className="list-card card">
                    <h2>Daftar Admin</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Username</th>
                                <th>Kuota</th>
                            </tr>
                        </thead>
                        <tbody>
                            {admins.length > 0 ? (
                                admins.map(admin => (
                                    <tr key={admin.id}>
                                        <td>{admin.id}</td>
                                        <td>{admin.username}</td>
                                        <td>{admin.invitation_quota}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="3">Belum ada admin yang terdaftar.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminManagementPage;

