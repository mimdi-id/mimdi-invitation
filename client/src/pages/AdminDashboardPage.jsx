import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Modal from '/src/components/Modal.jsx'; // FIX: Menggunakan path absolut
import { FaPlus } from 'react-icons/fa'; // FIX: Menggunakan sub-paket ikon yang benar

const AdminDashboardPage = () => {
    const [invitations, setInvitations] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [packages, setPackages] = useState([]);
    const [themes, setThemes] = useState([]);
    const [formData, setFormData] = useState({
        client_username: '',
        title: '',
        slug: '',
        packageId: '',
        themeId: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    
    const formRef = useRef(null);

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

    const fetchInvitations = useCallback(async () => {
        setLoading(true);
        const api = createApiInstance();
        if (!api) return;
        try {
            const response = await api.get('/invitations/my-invitations');
            setInvitations(response.data.data || []);
        } catch (err) {
            console.error('Error saat mengambil undangan:', err);
        } finally {
            setLoading(false);
        }
    }, [createApiInstance]);

    useEffect(() => {
        fetchInvitations();
    }, [fetchInvitations]);

    const openCreateModal = async () => {
        setError('');
        setSuccess('');
        setFormData({ client_username: '', title: '', slug: '', packageId: '', themeId: '' });
        setIsModalOpen(true);
        
        const api = createApiInstance();
        if (!api) return;
        try {
            const [packagesRes, themesRes] = await Promise.all([
                api.get('/packages'),
                api.get('/themes')
            ]);
            const packagesData = packagesRes.data.data || [];
            const themesData = themesRes.data.data || [];
            setPackages(packagesData);
            setThemes(themesData);
            
            setFormData(prev => ({
                ...prev,
                packageId: packagesData[0]?.id || '',
                themeId: themesData[0]?.id || ''
            }));
        } catch (err) {
            setError('Gagal memuat data untuk form. Pastikan ada Paket & Tema.');
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: value
        }));
    };
    
    const triggerFormSubmit = () => {
        if (formRef.current) {
            formRef.current.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
        }
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        const api = createApiInstance();
        if (!api) return;

        if (!formData.packageId || !formData.themeId) {
            setError('Silakan pilih paket dan tema.');
            return;
        }

        try {
            const response = await api.post('/orders', formData);
            const pinMessage = response.data.data?.client_pin ? ` PIN Klien: ${response.data.data.client_pin}` : '';
            setSuccess(`Undangan berhasil dibuat!${pinMessage}`);
            fetchInvitations();
            setIsModalOpen(false);
        } catch (err) {
            setError(err.response?.data?.error || 'Gagal membuat undangan.');
        }
    };

    if (loading) {
        return <div className="loading-spinner">Memuat data undangan...</div>;
    }

    return (
        <div className="management-page">
            {success && <div className="success-banner">{success}</div>}
            <div className="list-card card">
                <div className="table-header">
                    <h2>Daftar Undangan Saya</h2>
                    <button className="add-new-button" onClick={openCreateModal}>
                        <FaPlus /> Buat Undangan Baru
                    </button>
                </div>
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

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={triggerFormSubmit}
                title="Buat Undangan Baru"
                confirmText="Buat Draf"
            >
                <form ref={formRef} onSubmit={handleFormSubmit} id="create-invitation-form">
                    <div className="form-group">
                        <label>Username Klien</label>
                        <input type="text" name="client_username" value={formData.client_username} onChange={handleInputChange} required />
                    </div>
                    <div className="form-group">
                        <label>Judul Undangan</label>
                        <input type="text" name="title" value={formData.title} onChange={handleInputChange} placeholder="Contoh: Pernikahan Andin & Budi" required />
                    </div>
                    <div className="form-group">
                        <label>Slug URL</label>
                        <input type="text" name="slug" value={formData.slug} onChange={handleInputChange} placeholder="Contoh: andin-budi" required />
                    </div>
                    <div className="form-group">
                        <label>Pilih Paket</label>
                        <select name="packageId" value={formData.packageId} onChange={handleInputChange} required>
                             {packages.length === 0 && <option>Memuat...</option>}
                            {packages.map(pkg => <option key={pkg.id} value={pkg.id}>{pkg.name}</option>)}
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Pilih Tema</label>
                        <select name="themeId" value={formData.themeId} onChange={handleInputChange} required>
                            {themes.length === 0 && <option>Memuat...</option>}
                            {themes.map(theme => <option key={theme.id} value={theme.id}>{theme.name} ({theme.tier})</option>)}
                        </select>
                    </div>
                    {error && <p className="error-message">{error}</p>}
                </form>
            </Modal>
        </div>
    );
};

export default AdminDashboardPage;

