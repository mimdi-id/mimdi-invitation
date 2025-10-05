import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './ManagementPage.css'; // Menggunakan styling bersama

const CreateInvitationPage = () => {
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
        const fetchData = async () => {
            setLoading(true);
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
                setError('Gagal memuat data. Pastikan ada Paket & Tema yang sudah dibuat.');
                console.error("Fetch initial data error:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [createApiInstance]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        
        const api = createApiInstance();
        if(!api) return;

        try {
            const response = await api.post('/orders', formData);
            
            // --- PERBAIKAN DI SINI ---
            const baseMessage = response.data.message || 'Undangan berhasil dibuat!';
            const pinMessage = response.data.data?.client_pin 
                ? ` PIN Klien baru: ${response.data.data.client_pin}` 
                : '';
            setSuccess(baseMessage + pinMessage);
            // -------------------------

            setFormData({ 
                client_username: '', 
                title: '', 
                slug: '', 
                packageId: packages[0]?.id || '', 
                themeId: themes[0]?.id || '' 
            });
        } catch (err) {
            setError(err.response?.data?.error || 'Gagal membuat undangan.');
            console.error("Create invitation error:", err);
        }
    };

    if (loading) {
        return <div className="loading-spinner">Memuat data...</div>;
    }

    return (
        <div className="management-page">
            <header className="page-header">
                <h1>Buat Undangan Baru</h1>
            </header>
            <div className="form-card card" style={{ gridColumn: '1 / -1' }}>
                <h2>Informasi Pesanan</h2>
                <form onSubmit={handleSubmit}>
                    {/* ... (semua input form tetap sama) ... */}
                    <div className="form-group">
                        <label htmlFor="client_username">Username Klien</label>
                        <input type="text" id="client_username" name="client_username" value={formData.client_username} onChange={handleInputChange} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="title">Judul Undangan</label>
                        <input type="text" id="title" name="title" value={formData.title} onChange={handleInputChange} placeholder="Contoh: Pernikahan Andin & Budi" required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="slug">Slug URL</label>
                        <input type="text" id="slug" name="slug" value={formData.slug} onChange={handleInputChange} placeholder="Contoh: andin-budi" required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="packageId">Pilih Paket</label>
                        <select id="packageId" name="packageId" value={formData.packageId} onChange={handleInputChange} required>
                           {packages.length > 0 ? (
                                packages.map(pkg => <option key={pkg.id} value={pkg.id}>{pkg.name}</option>)
                           ) : (
                                <option disabled>Tidak ada paket tersedia</option>
                           )}
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="themeId">Pilih Tema</label>
                        <select id="themeId" name="themeId" value={formData.themeId} onChange={handleInputChange} required>
                            {themes.length > 0 ? (
                                themes.map(theme => <option key={theme.id} value={theme.id}>{theme.name} ({theme.tier})</option>)
                            ) : (
                                <option disabled>Tidak ada tema tersedia</option>
                            )}
                        </select>
                    </div>
                    
                    <button type="submit" className="submit-button">Buat Draf Undangan</button>
                    {error && <p className="error-message">{error}</p>}
                    {success && <p className="success-message" style={{ whiteSpace: 'pre-wrap' }}>{success}</p>}
                </form>
            </div>
        </div>
    );
};

export default CreateInvitationPage;

