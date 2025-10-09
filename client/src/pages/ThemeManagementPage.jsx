import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Modal from '/src/components/Modal.jsx';
import { FaPlus, FaPencil, FaTrash } from 'react-icons/fa6';

const ThemeManagementPage = () => {
    const [themes, setThemes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [previewImageFile, setPreviewImageFile] = useState(null);

    const [formData, setFormData] = useState({
        name: '',
        tier: 'Basic',
        component_name: '',
        config: ''
    });

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingThemeId, setEditingThemeId] = useState(null);
    const [themeToDelete, setThemeToDelete] = useState(null);
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

    const fetchThemes = useCallback(async () => {
        setLoading(true);
        const api = createApiInstance();
        if (!api) return;
        try {
            const response = await api.get('/themes');
            setThemes(response.data.data || []);
        } catch (err) { 
            console.error('Error fetching themes:', err);
        } finally { 
            setLoading(false); 
        }
    }, [createApiInstance, navigate]);

    useEffect(() => { 
        fetchThemes(); 
    }, [fetchThemes]);

    const handleFileChange = (e) => {
        setPreviewImageFile(e.target.files[0]);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    
    const openModalForNew = () => {
        resetForm();
        setEditingThemeId(null);
        setIsModalOpen(true);
    };

    const openModalForEdit = (theme) => {
        setEditingThemeId(theme.id);
        setFormData({
            name: theme.name,
            tier: theme.tier,
            component_name: theme.component_name,
            config: JSON.stringify(theme.config || '{}', null, 2)
        });
        setPreviewImageFile(null);
        setIsModalOpen(true);
    };

    const resetForm = () => {
        setFormData({ name: '', tier: 'Basic', component_name: '', config: '' });
        setError('');
        setSuccess('');
        setPreviewImageFile(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const api = createApiInstance();
        if (!api) return;

        const submissionData = new FormData();
        Object.keys(formData).forEach(key => {
            submissionData.append(key, formData[key]);
        });
        if (previewImageFile) {
            submissionData.append('preview_image', previewImageFile);
        }
        
        try {
            if (editingThemeId) {
                await api.put(`/themes/${editingThemeId}`, submissionData, { headers: { 'Content-Type': 'multipart/form-data' } });
                setSuccess('Tema berhasil diperbarui!');
            } else {
                await api.post('/themes', submissionData, { headers: { 'Content-Type': 'multipart/form-data' } });
                setSuccess('Tema berhasil ditambahkan!');
            }
            fetchThemes();
            setIsModalOpen(false);
        } catch (err) {
            setError(err.response?.data?.error || 'Terjadi kesalahan.');
        }
    };

    const handleDelete = async () => {
        if (!themeToDelete) return;
        const api = createApiInstance();
        if (!api) return;
        try {
            await api.delete(`/themes/${themeToDelete.id}`);
            setSuccess(`Tema "${themeToDelete.name}" berhasil dihapus.`);
            setThemeToDelete(null);
            fetchThemes();
        } catch (err) {
            alert(err.response?.data?.error || 'Gagal menghapus tema.');
        }
    };

    if (loading) { 
        return <div className="loading-spinner">Memuat data tema...</div>; 
    }

    return (
        <div className="management-page">
            {success && <div className="success-banner">{success}</div>}
            <div className="list-card card">
                <div className="table-header">
                    <h2>Daftar Tema</h2>
                    <button className="add-new-button" onClick={openModalForNew}>
                        <FaPlus /> Tambah Tema Baru
                    </button>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>Nama</th>
                            <th>Tingkatan</th>
                            <th>Nama Komponen</th>
                            <th>Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {themes.map(theme => (
                            <tr key={theme.id}>
                                <td>{theme.name}</td>
                                <td>{theme.tier}</td>
                                <td>{theme.component_name}</td>
                                <td>
                                    <div className="action-buttons">
                                        <button onClick={() => openModalForEdit(theme)} className="edit-button-icon" title="Edit Tema"><FaPencil /></button>
                                        <button onClick={() => setThemeToDelete(theme)} className="edit-button-icon" title="Hapus Tema"><FaTrash /></button>
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
                formId="theme-form"
                title={editingThemeId ? 'Edit Tema' : 'Tambah Tema Baru'} 
                confirmText={editingThemeId ? 'Simpan' : 'Tambah'}
            >
                <form onSubmit={handleSubmit} id="theme-form">
                    <div className="form-group"><label>Nama Tema</label><input type="text" name="name" value={formData.name} onChange={handleInputChange} required /></div>
                    <div className="form-group"><label>Tingkatan</label><select name="tier" value={formData.tier} onChange={handleInputChange}><option value="Basic">Basic</option><option value="Premium">Premium</option><option value="Custom">Custom</option></select></div>
                    <div className="form-group"><label>Nama Komponen</label><input type="text" name="component_name" value={formData.component_name} onChange={handleInputChange} required /></div>
                    <div className="form-group"><label>Konfigurasi (JSON)</label><textarea name="config" value={formData.config} onChange={handleInputChange} rows="5"></textarea></div>
                    <div className="form-group"><label>Gambar Pratinjau</label><input type="file" onChange={handleFileChange} /></div>
                    {error && <p className="error-message">{error}</p>}
                </form>
            </Modal>

            {/* FIX: Modal hapus sekarang akan berfungsi */}
            <Modal isOpen={!!themeToDelete} onClose={() => setThemeToDelete(null)} onConfirm={handleDelete} title="Konfirmasi Hapus">
                <p>Apakah Anda yakin ingin menghapus tema <strong>"{themeToDelete?.name}"</strong>?</p>
            </Modal>
        </div>
    );
};

export default ThemeManagementPage;

