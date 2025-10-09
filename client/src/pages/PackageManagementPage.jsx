import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Modal from '/src/components/Modal.jsx';
import { FaPlus, FaPencil, FaTrash } from 'react-icons/fa6';

const PackageManagementPage = () => {
    const [packages, setPackages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        active_period_months: '',
        photo_limit: '',
        revisions_limit: '',
        features: ''
    });

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPackageId, setEditingPackageId] = useState(null);
    const [packageToDelete, setPackageToDelete] = useState(null);

    const navigate = useNavigate();

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

    const fetchPackages = useCallback(async () => {
        setLoading(true);
        try {
            const api = createApiInstance();
            if (!api) return;
            const response = await api.get('/packages');
            setPackages(response.data.data || []);
        } catch (err) {
            console.error('Error fetching packages:', err);
        } finally {
            setLoading(false);
        }
    }, [createApiInstance, navigate]);

    useEffect(() => {
        fetchPackages();
    }, [fetchPackages]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const openModalForNew = () => {
        resetForm();
        setEditingPackageId(null);
        setIsModalOpen(true);
    };

    const openModalForEdit = (pkg) => {
        setEditingPackageId(pkg.id);
        setFormData({
            ...pkg,
            features: JSON.parse(pkg.features || '[]').join(', ')
        });
        setIsModalOpen(true);
    };

    const resetForm = () => {
        setFormData({ name: '', price: '', active_period_months: '', photo_limit: '', revisions_limit: '', features: '' });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const api = createApiInstance();
        if (!api) return;

        const payload = {
            ...formData,
            features: JSON.stringify(formData.features.split(',').map(item => item.trim()))
        };
        
        try {
            if (editingPackageId) {
                await api.put(`/packages/${editingPackageId}`, payload);
                setSuccess('Paket berhasil diperbarui!');
            } else {
                await api.post('/packages', payload);
                setSuccess('Paket berhasil ditambahkan!');
            }
            fetchPackages();
            setIsModalOpen(false);
        } catch (err) {
            setError(err.response?.data?.error || 'Terjadi kesalahan.');
        }
    };

    const handleDelete = async () => {
        if (!packageToDelete) return;
        const api = createApiInstance();
        if (!api) return;
        try {
            await api.delete(`/packages/${packageToDelete.id}`);
            setSuccess('Paket berhasil dihapus!');
            setPackageToDelete(null);
            fetchPackages();
        } catch (err) {
            alert(err.response?.data?.error || 'Gagal menghapus paket.');
        }
    };

    if (loading) {
        return <div className="loading-spinner">Memuat data paket...</div>;
    }

    return (
        <div className="management-page">
            {success && <div className="success-banner">{success}</div>}
            <div className="list-card card">
                <div className="table-header">
                    <h2>Daftar Paket</h2>
                    <button className="add-new-button" onClick={openModalForNew}>
                        <FaPlus /> Tambah Paket Baru
                    </button>
                </div>
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
                        {packages.map(pkg => (
                            <tr key={pkg.id}>
                                <td>{pkg.name}</td>
                                <td>Rp {Number(pkg.price).toLocaleString('id-ID')}</td>
                                <td>{pkg.active_period_months} bulan</td>
                                <td>
                                    <div className="action-buttons">
                                        <button onClick={() => openModalForEdit(pkg)} className="edit-button-icon" title="Edit Paket"><FaPencil /></button>
                                        <button onClick={() => setPackageToDelete(pkg)} className="edit-button-icon" title="Hapus Paket"><FaTrash /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                formId="package-form"
                title={editingPackageId ? 'Edit Paket' : 'Tambah Paket Baru'}
                confirmText={editingPackageId ? 'Simpan Perubahan' : 'Tambah'}
            >
                <form onSubmit={handleSubmit} id="package-form">
                    <div className="form-group"><label>Nama Paket</label><input type="text" name="name" value={formData.name} onChange={handleInputChange} required /></div>
                    <div className="form-group"><label>Harga (Rp)</label><input type="number" name="price" value={formData.price} onChange={handleInputChange} required /></div>
                    <div className="form-group"><label>Masa Aktif (Bulan)</label><input type="number" name="active_period_months" value={formData.active_period_months} onChange={handleInputChange} required /></div>
                    <div className="form-group"><label>Batas Foto</label><input type="number" name="photo_limit" value={formData.photo_limit} onChange={handleInputChange} required /></div>
                    <div className="form-group"><label>Batas Revisi</label><input type="number" name="revisions_limit" value={formData.revisions_limit} onChange={handleInputChange} required /></div>
                    <div className="form-group"><label>Fitur (pisahkan koma)</label><input type="text" name="features" value={formData.features} onChange={handleInputChange} /></div>
                    {error && <p className="error-message">{error}</p>}
                </form>
            </Modal>

            {/* FIX: Modal hapus sekarang akan berfungsi */}
            <Modal isOpen={!!packageToDelete} onClose={() => setPackageToDelete(null)} onConfirm={handleDelete} title="Konfirmasi Hapus">
                <p>Apakah Anda yakin ingin menghapus paket <strong>"{packageToDelete?.name}"</strong>?</p>
            </Modal>
        </div>
    );
};

export default PackageManagementPage;

