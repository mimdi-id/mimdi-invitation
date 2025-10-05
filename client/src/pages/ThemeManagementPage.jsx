import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Modal from '../components/Modal';
import './ManagementPage.css';

const ThemeManagementPage = () => {
    const [themes, setThemes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    
    // State untuk form
    const [formData, setFormData] = useState({
        name: '',
        tier: 'Basic', // Nilai default
        config: ''
    });

    // State untuk mode edit dan modal
    const [editingThemeId, setEditingThemeId] = useState(null);
    const [themeToDelete, setThemeToDelete] = useState(null);

    const navigate = useNavigate();

    // --- FUNGSI API (Sama seperti halaman lain) ---
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

    const fetchThemes = useCallback(async () => {
        setLoading(true);
        try {
            const api = createApiInstance();
            if (!api) return;
            const response = await api.get('/themes');
            setThemes(response.data.data || []);
        } catch (err) {
            console.error('Error fetching themes:', err);
            if (err.response?.status === 401 || err.response?.status === 403) {
                handleLogout();
            }
        } finally {
            setLoading(false);
        }
    }, [createApiInstance, handleLogout]);

    useEffect(() => {
        fetchThemes();
    }, [fetchThemes]);

    // --- HANDLER FORM ---
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const resetForm = () => {
        setFormData({ name: '', tier: 'Basic', config: '' });
        setEditingThemeId(null);
        setError('');
        setSuccess('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        const api = createApiInstance();
        if (!api) return;

        // Validasi JSON sebelum mengirim
        let configPayload;
        try {
            // Kita akan mengirim 'config' sebagai objek JSON, bukan string
            configPayload = JSON.parse(formData.config || '{}');
        } catch (jsonError) {
            setError('Format JSON pada kolom Konfigurasi tidak valid.');
            return;
        }

        const payload = { ...formData, config: configPayload };
        
        try {
            if (editingThemeId) {
                // Mode Update
                await api.put(`/themes/${editingThemeId}`, payload);
                setSuccess('Tema berhasil diperbarui!');
            } else {
                // Mode Create
                await api.post('/themes', payload);
                setSuccess('Tema berhasil ditambahkan!');
            }
            resetForm();
            fetchThemes();
        } catch (err) {
            setError(err.response?.data?.error || 'Terjadi kesalahan.');
            console.error('Submit theme error:', err);
        }
    };

    // --- HANDLER AKSI (EDIT/DELETE) ---
    const handleEdit = (theme) => {
        setEditingThemeId(theme.id);
        setFormData({
            ...theme,
            // Konversi objek JSON kembali menjadi string yang rapi untuk diedit
            config: JSON.stringify(JSON.parse(theme.config || '{}'), null, 2)
        });
        window.scrollTo(0, 0);
    };

    const handleDelete = async () => {
        if (!themeToDelete) return;
        const api = createApiInstance();
        if (!api) return;
        
        try {
            await api.delete(`/themes/${themeToDelete.id}`);
            setSuccess('Tema berhasil dihapus!');
            setThemeToDelete(null); // Tutup modal
            fetchThemes();
        } catch (err) {
            setError(err.response?.data?.error || 'Gagal menghapus tema.');
            console.error('Delete theme error:', err);
        }
    };

    if (loading) {
        return <div className="loading-spinner">Memuat data tema...</div>;
    }

    return (
        <div className="management-page">
            <header className="page-header">
                <h1>Kelola Tema</h1>
            </header>
            <div className="content-grid">
                <div className="form-card card">
                    <h2>{editingThemeId ? 'Edit Tema' : 'Tambah Tema Baru'}</h2>
                    <form onSubmit={handleSubmit}>
                        {/* Nama Tema */}
                        <div className="form-group">
                            <label htmlFor="name">Nama Tema</label>
                            <input type="text" id="name" name="name" value={formData.name} onChange={handleInputChange} required />
                        </div>
                        {/* Tingkatan Tema */}
                        <div className="form-group">
                            <label htmlFor="tier">Tingkatan</label>
                            <select id="tier" name="tier" value={formData.tier} onChange={handleInputChange} required>
                                <option value="Basic">Basic</option>
                                <option value="Premium">Premium</option>
                                <option value="Custom">Custom</option>
                            </select>
                        </div>
                        {/* Konfigurasi (JSON) */}
                        <div className="form-group">
                            <label htmlFor="config">Konfigurasi (JSON)</label>
                            <textarea id="config" name="config" value={formData.config} onChange={handleInputChange} rows="10" placeholder='Contoh: { "warnaPrimer": "#FFFFFF", "font": "Inter" }'></textarea>
                        </div>

                        <button type="submit" className="submit-button">{editingThemeId ? 'Simpan Perubahan' : 'Tambah Tema'}</button>
                        {editingThemeId && <button type="button" onClick={resetForm} className="cancel-button">Batal Edit</button>}
                        
                        {error && <p className="error-message">{error}</p>}
                        {success && <p className="success-message">{success}</p>}
                    </form>
                </div>
                <div className="list-card card">
                    <h2>Daftar Tema</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>Nama</th>
                                <th>Tingkatan</th>
                                <th>Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {themes.length > 0 ? (
                                themes.map(theme => (
                                    <tr key={theme.id}>
                                        <td>{theme.name}</td>
                                        <td>{theme.tier}</td>
                                        <td>
                                            <div className="action-buttons">
                                                <button onClick={() => handleEdit(theme)} className="edit-button">Edit</button>
                                                <button onClick={() => setThemeToDelete(theme)} className="delete-button">Hapus</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="3">Belum ada tema yang ditambahkan.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <Modal
                isOpen={!!themeToDelete}
                onClose={() => setThemeToDelete(null)}
                onConfirm={handleDelete}
                title="Konfirmasi Hapus"
            >
                <p>Apakah Anda yakin ingin menghapus tema <strong>"{themeToDelete?.name}"</strong>? Tindakan ini tidak dapat dibatalkan.</p>
            </Modal>
        </div>
    );
};

export default ThemeManagementPage;

