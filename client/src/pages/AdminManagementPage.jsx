import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Modal from '../components/Modal.jsx'; // FIX: Menggunakan path relatif
import { FaPlus, FaPencil, FaTrash } from 'react-icons/fa6'; // FIX: Menggunakan fa6

const AdminManagementPage = () => {
    const [admins, setAdmins] = useState([]);
    const [loading, setLoading] = useState(true);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [editingAdmin, setEditingAdmin] = useState(null);
    const [newQuota, setNewQuota] = useState('');
    const [adminToDelete, setAdminToDelete] = useState(null);

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

    const fetchAdmins = useCallback(async () => {
        setLoading(true);
        const api = createApiInstance();
        if (!api) return;
        try {
            const response = await api.get('/admins');
            setAdmins(response.data.data || []);
        } catch (err) {
            console.error("Fetch admins error:", err);
        } finally {
            setLoading(false);
        }
    }, [createApiInstance]);

    useEffect(() => {
        fetchAdmins();
    }, [fetchAdmins]);

    const openFormModal = (admin = null) => {
        setError('');
        setSuccess('');
        if (admin) {
            setEditingAdmin(admin);
            setUsername(admin.username);
            setNewQuota(admin.invitation_quota);
            setPassword('');
        } else {
            setEditingAdmin(null);
            setUsername('');
            setPassword('');
            setNewQuota('5');
        }
        setIsFormModalOpen(true);
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        const api = createApiInstance();
        if (!api) return;

        try {
            if (editingAdmin) {
                await api.put(`/admins/${editingAdmin.id}/quota`, { newQuota: parseInt(newQuota, 10) });
                setSuccess(`Kuota untuk ${editingAdmin.username} berhasil diperbarui!`);
            } else {
                await api.post('/admins', { username, password });
                setSuccess(`Admin "${username}" berhasil ditambahkan!`);
            }
            fetchAdmins();
            setIsFormModalOpen(false);
        } catch (err) {
            setError(err.response?.data?.error || 'Gagal memproses permintaan.');
        }
    };
    
    const handleDelete = async () => {
        if (!adminToDelete) return;
        const api = createApiInstance();
        if (!api) return;
        try {
            await api.delete(`/admins/${adminToDelete.id}`);
            setSuccess(`Admin "${adminToDelete.username}" berhasil dihapus.`);
            setAdminToDelete(null);
            fetchAdmins();
        } catch (err) {
             alert(err.response?.data?.error || 'Gagal menghapus admin.');
        }
    };

    if (loading) {
        return <div className="loading-spinner">Memuat data admin...</div>;
    }

    return (
        <div className="management-page">
            {success && <div className="success-banner">{success}</div>}
            <div className="list-card card">
                <div className="table-header">
                    <h2>Daftar Admin</h2>
                    <button className="add-new-button" onClick={() => openFormModal()}>
                        <FaPlus /> Tambah Admin Baru
                    </button>
                </div>
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
                        {admins.map(admin => (
                            <tr key={admin.id}>
                                <td>{admin.id}</td>
                                <td>{admin.username}</td>
                                <td>{admin.invitation_quota}</td>
                                <td>
                                    <div className="action-buttons">
                                        <button onClick={() => openFormModal(admin)} className="edit-button-icon" title="Edit Admin"><FaPencil /></button>
                                        <button onClick={() => setAdminToDelete(admin)} className="edit-button-icon" title="Hapus Admin"><FaTrash /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Modal
                isOpen={isFormModalOpen}
                onClose={() => setIsFormModalOpen(false)}
                formId="admin-form"
                title={editingAdmin ? `Edit Admin: ${editingAdmin.username}` : 'Tambah Admin Baru'}
                confirmText={editingAdmin ? 'Simpan Kuota' : 'Tambah'}
            >
                <form onSubmit={handleFormSubmit} id="admin-form">
                    {!editingAdmin ? (
                        <>
                            <div className="form-group">
                                <label>Username</label>
                                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
                            </div>
                            <div className="form-group">
                                <label>Password</label>
                                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                            </div>
                        </>
                    ) : (
                        <div className="form-group">
                            <label>Jumlah Kuota Undangan Baru</label>
                            <input type="number" value={newQuota} onChange={(e) => setNewQuota(e.target.value)} min="0" required />
                        </div>
                    )}
                    {error && <p className="error-message">{error}</p>}
                </form>
            </Modal>
            
            <Modal isOpen={!!adminToDelete} onClose={() => setAdminToDelete(null)} onConfirm={handleDelete} title="Konfirmasi Hapus">
                <p>Apakah Anda yakin ingin menghapus admin <strong>"{adminToDelete?.username}"</strong>?</p>
            </Modal>
        </div>
    );
};

export default AdminManagementPage;

