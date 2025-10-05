import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Modal from '../components/Modal'; // Import modal
import './ManagementPage.css';

const PackageManagementPage = () => {
    const [packages, setPackages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    
    // State untuk form
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        active_period_months: '',
        photo_limit: '',
        revisions_limit: '',
        features: ''
    });

    // State untuk mode edit dan modal
    const [editingPackageId, setEditingPackageId] = useState(null);
    const [packageToDelete, setPackageToDelete] = useState(null);

    const navigate = useNavigate();

    // --- FUNGSI API ---
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

    const fetchPackages = useCallback(async () => {
        setLoading(true);
        try {
            const api = createApiInstance();
            if (!api) return;
            const response = await api.get('/packages');
            setPackages(response.data.data || []);
        } catch (err) {
            console.error('Error fetching packages:', err);
            if (err.response?.status === 401 || err.response?.status === 403) {
                handleLogout();
            }
        } finally {
            setLoading(false);
        }
    }, [createApiInstance, handleLogout]);

    useEffect(() => {
        fetchPackages();
    }, [fetchPackages]);

    // --- HANDLER FORM ---
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const resetForm = () => {
        setFormData({ name: '', price: '', active_period_months: '', photo_limit: '', revisions_limit: '', features: '' });
        setEditingPackageId(null);
        setError('');
        setSuccess('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        const api = createApiInstance();
        if (!api) return;

        const payload = {
            ...formData,
            // Konversi fitur dari string (dipisahkan koma) menjadi array JSON
            features: JSON.stringify(formData.features.split(',').map(item => item.trim()))
        };
        
        try {
            if (editingPackageId) {
                // Mode Update
                await api.put(`/packages/${editingPackageId}`, payload);
                setSuccess('Paket berhasil diperbarui!');
            } else {
                // Mode Create
                await api.post('/packages', payload);
                setSuccess('Paket berhasil ditambahkan!');
            }
            resetForm();
            fetchPackages();
        } catch (err) {
            setError(err.response?.data?.error || 'Terjadi kesalahan.');
            console.error('Submit package error:', err);
        }
    };

    // --- HANDLER AKSI (EDIT/DELETE) ---
    const handleEdit = (pkg) => {
        setEditingPackageId(pkg.id);
        setFormData({
            ...pkg,
            // Konversi fitur dari array JSON kembali menjadi string
            features: JSON.parse(pkg.features || '[]').join(', ')
        });
        window.scrollTo(0, 0); // Scroll ke atas untuk melihat form
    };

    const handleDelete = async () => {
        if (!packageToDelete) return;
        const api = createApiInstance();
        if (!api) return;
        
        try {
            await api.delete(`/packages/${packageToDelete.id}`);
            setSuccess('Paket berhasil dihapus!');
            setPackageToDelete(null); // Tutup modal
            fetchPackages();
        } catch (err) {
            setError(err.response?.data?.error || 'Gagal menghapus paket.');
            console.error('Delete package error:', err);
        }
    };

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
                    <h2>{editingPackageId ? 'Edit Paket' : 'Tambah Paket Baru'}</h2>
                    <form onSubmit={handleSubmit}>
                        {/* Nama Paket */}
                        <div className="form-group">
                            <label htmlFor="name">Nama Paket</label>
                            <input type="text" id="name" name="name" value={formData.name} onChange={handleInputChange} required />
                        </div>
                        {/* Harga */}
                        <div className="form-group">
                            <label htmlFor="price">Harga (Rp)</label>
                            <input type="number" id="price" name="price" value={formData.price} onChange={handleInputChange} required />
                        </div>
                        {/* Masa Aktif */}
                        <div className="form-group">
                            <label htmlFor="active_period_months">Masa Aktif (Bulan)</label>
                            <input type="number" id="active_period_months" name="active_period_months" value={formData.active_period_months} onChange={handleInputChange} required />
                        </div>
                        {/* Batas Foto */}
                        <div className="form-group">
                            <label htmlFor="photo_limit">Batas Foto</label>
                            <input type="number" id="photo_limit" name="photo_limit" value={formData.photo_limit} onChange={handleInputChange} required />
                        </div>
                        {/* Batas Revisi */}
                        <div className="form-group">
                            <label htmlFor="revisions_limit">Batas Revisi</label>
                            <input type="number" id="revisions_limit" name="revisions_limit" value={formData.revisions_limit} onChange={handleInputChange} required />
                        </div>
                        {/* Fitur */}
                        <div className="form-group">
                            <label htmlFor="features">Fitur (pisahkan dengan koma)</label>
                            <input type="text" id="features" name="features" value={formData.features} onChange={handleInputChange} placeholder="Contoh: RSVP, Galeri Foto" />
                        </div>

                        <button type="submit" className="submit-button">{editingPackageId ? 'Simpan Perubahan' : 'Tambah Paket'}</button>
                        {editingPackageId && <button type="button" onClick={resetForm} className="cancel-button">Batal Edit</button>}
                        
                        {error && <p className="error-message">{error}</p>}
                        {success && <p className="success-message">{success}</p>}
                    </form>
                </div>
                <div className="list-card card">
                    <h2>Daftar Paket</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>Nama</th>
                                <th>Harga</th>
                                <th>Masa Aktif</th>
                                <th>Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {packages.length > 0 ? (
                                packages.map(pkg => (
                                    <tr key={pkg.id}>
                                        <td>{pkg.name}</td>
                                        <td>Rp {Number(pkg.price).toLocaleString('id-ID')}</td>
                                        <td>{pkg.active_period_months} bulan</td>
                                        <td>
                                            <div className="action-buttons">
                                                <button onClick={() => handleEdit(pkg)} className="edit-button">Edit</button>
                                                <button onClick={() => setPackageToDelete(pkg)} className="delete-button">Hapus</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4">Belum ada paket yang ditambahkan.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <Modal
                isOpen={!!packageToDelete}
                onClose={() => setPackageToDelete(null)}
                onConfirm={handleDelete}
                title="Konfirmasi Hapus"
            >
                <p>Apakah Anda yakin ingin menghapus paket <strong>"{packageToDelete?.name}"</strong>? Tindakan ini tidak dapat dibatalkan.</p>
            </Modal>
        </div>
    );
};

export default PackageManagementPage;

