import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Modal from '../components/Modal'; // Pastikan komponen Modal sudah ada
import './ManagementPage.css';

const AdminManagementPage = () => {
    const [admins, setAdmins] = useState([]);
    const [loading, setLoading] = useState(true);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    // State untuk modal kuota
    const [editingAdmin, setEditingAdmin] = useState(null); // Menyimpan objek admin yang akan diedit
    const [newQuota, setNewQuota] = useState(''); // Menyimpan nilai input kuota baru

    // Fungsi untuk membuat instance Axios dengan otentikasi
    const createApiInstance = useCallback(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return null;
        }
        return axios.create({
            baseURL: 'http://localhost:5000/api',
            headers: { 'Authorization': `Bearer ${token}` }
        });
    }, [navigate]);

    // Fungsi untuk mengambil daftar admin
    const fetchAdmins = useCallback(async () => {
        setLoading(true);
        const api = createApiInstance();
        if (!api) return;
        try {
            const response = await api.get('/admins');
            setAdmins(response.data.data || []);
        } catch (err) {
            setError('Gagal memuat daftar admin.');
            console.error("Fetch admins error:", err);
        } finally {
            setLoading(false);
        }
    }, [createApiInstance]);

    useEffect(() => {
        fetchAdmins();
    }, [fetchAdmins]);
    
    // Fungsi untuk menangani penambahan admin baru
    const handleAddAdmin = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        const api = createApiInstance();
        if (!api) return;
        try {
            await api.post('/admins', { username, password });
            setSuccess(`Admin "${username}" berhasil ditambahkan!`);
            setUsername('');
            setPassword('');
            fetchAdmins(); // Muat ulang daftar admin
        } catch (err) {
            setError(err.response?.data?.error || 'Gagal menambahkan admin.');
        }
    };

    // Fungsi untuk membuka modal edit kuota
    const openQuotaModal = (admin) => {
        setEditingAdmin(admin);
        setNewQuota(admin.invitation_quota);
        setError('');
        setSuccess('');
    };

    // Fungsi untuk mengirim pembaruan kuota ke backend
    const handleUpdateQuota = async () => {
        if (!editingAdmin) return;
        const api = createApiInstance();
        if (!api) return;

        try {
            await api.put(`/admins/${editingAdmin.id}/quota`, { newQuota: parseInt(newQuota, 10) });
            setSuccess(`Kuota untuk ${editingAdmin.username} berhasil diperbarui!`);
            setEditingAdmin(null); // Tutup modal
            fetchAdmins(); // Muat ulang daftar
        } catch (err) {
            // Tampilkan error di dalam modal
            setError(err.response?.data?.error || 'Gagal memperbarui kuota.');
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
                        {error && !editingAdmin && <p className="error-message">{error}</p>}
                        {success && !editingAdmin && <p className="success-message">{success}</p>}
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
                                <th>Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {admins.length > 0 ? (
                                admins.map(admin => (
                                    <tr key={admin.id}>
                                        <td>{admin.id}</td>
                                        <td>{admin.username}</td>
                                        <td>{admin.invitation_quota}</td>
                                        <td>
                                            <div className="action-buttons">
                                                <button onClick={() => openQuotaModal(admin)} className="edit-button">
                                                    Ubah Kuota
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : ( 
                                <tr><td colSpan="4">Belum ada admin yang terdaftar.</td></tr> 
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <Modal
                isOpen={!!editingAdmin}
                onClose={() => setEditingAdmin(null)}
                onConfirm={handleUpdateQuota}
                title={`Ubah Kuota untuk ${editingAdmin?.username}`}
            >
                <div className="form-group">
                    <label htmlFor="quota">Jumlah Kuota Undangan Baru</label>
                    <input
                        type="number"
                        id="quota"
                        value={newQuota}
                        onChange={(e) => setNewQuota(e.target.value)}
                        placeholder="Masukkan jumlah kuota"
                        min="0"
                    />
                    {error && editingAdmin && <p className="error-message" style={{textAlign: 'left', marginTop: '1rem'}}>{error}</p>}
                </div>
            </Modal>
        </div>
    );
};

export default AdminManagementPage;

