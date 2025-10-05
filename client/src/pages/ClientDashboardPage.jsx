import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import MempelaiForm from '../components/MempelaiForm';
import './ClientDashboardPage.css';

const ClientDashboardPage = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    
    const [invitationData, setInvitationData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('mempelai');
    
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        const storedDataString = sessionStorage.getItem(`client_auth_${slug}`);
        if (storedDataString) {
            try {
                const data = JSON.parse(storedDataString);
                
                if (!data.mempelai || data.mempelai.length < 2) {
                    data.mempelai = [
                        data.mempelai?.find(m => m.type === 'Pria') || { type: 'Pria' },
                        data.mempelai?.find(m => m.type === 'Wanita') || { type: 'Wanita' }
                    ];
                }
                setInvitationData(data);
            } catch (e) {
                console.error("Gagal parse data sesi, sesi tidak valid:", e);
                sessionStorage.removeItem(`client_auth_${slug}`);
                navigate(`/u/${slug}/login`);
            }
        } else {
            navigate(`/u/${slug}/login`);
        }
        setLoading(false);
    }, [slug, navigate]);
    
    const handleLogout = () => {
        sessionStorage.removeItem(`client_auth_${slug}`);
        navigate(`/u/${slug}/login`);
    };

    const handleMempelaiUpdate = (index, updatedMempelai) => {
        const newMempelaiArray = [...invitationData.mempelai];
        newMempelaiArray[index] = updatedMempelai;
        setInvitationData({ ...invitationData, mempelai: newMempelaiArray });
    };

    const handleSaveChanges = async () => {
        setError('');
        setSuccess('');
        try {
            const response = await axios.put(`http://localhost:5000/api/client/invitations/${slug}/dashboard`, {
                mempelaiData: invitationData.mempelai
            });

            if(response.data.success){
                setSuccess(response.data.message);
                const updatedData = response.data.data;
                // Perbarui state lokal dan sessionStorage dengan data terbaru dari server
                setInvitationData(updatedData); 
                sessionStorage.setItem(`client_auth_${slug}`, JSON.stringify(updatedData));
            }
        } catch (err) {
            setError(err.response?.data?.error || "Gagal menyimpan data.");
            console.error("Save changes error:", err);
        }
    };

    // Tampilkan pesan loading jika data belum siap
    if (loading || !invitationData) {
        return <div className="loading-spinner">Memuat dasbor...</div>;
    }

    return (
        <div className="client-dashboard">
            <header className="client-header">
                <h1>Kelola Undangan: {invitationData.title}</h1>
                <div className="header-actions">
                    <button onClick={handleSaveChanges} className="save-button">Simpan Perubahan</button>
                    <button onClick={handleLogout} className="logout-button">Logout</button>
                </div>
            </header>
            
            <nav className="dashboard-tabs">
                <button onClick={() => setActiveTab('mempelai')} className={activeTab === 'mempelai' ? 'active' : ''}>Data Mempelai</button>
                <button onClick={() => setActiveTab('acara')} className={activeTab === 'acara' ? 'active' : ''}>Data Acara</button>
                <button onClick={() => setActiveTab('galeri')} className={activeTab === 'galeri' ? 'active' : ''}>Galeri & Media</button>
                <button onClick={() => setActiveTab('cerita')} className={activeTab === 'cerita' ? 'active' : ''}>Cerita Cinta</button>
            </nav>

            <div className="dashboard-content">
                {error && <p className="error-message">{error}</p>}
                {success && <p className="success-message">{success}</p>}

                {activeTab === 'mempelai' && (
                    <div className="mempelai-forms">
                        <MempelaiForm 
                            mempelai={invitationData.mempelai.find(m => m.type === 'Pria')}
                            onUpdate={(data) => handleMempelaiUpdate(invitationData.mempelai.findIndex(m => m.type === 'Pria'), data)} 
                        />
                        <MempelaiForm 
                            mempelai={invitationData.mempelai.find(m => m.type === 'Wanita')}
                            onUpdate={(data) => handleMempelaiUpdate(invitationData.mempelai.findIndex(m => m.type === 'Wanita'), data)} 
                        />
                    </div>
                )}
                {activeTab === 'acara' && <div className="card"><p>Bagian untuk mengelola data acara akan muncul di sini.</p></div>}
                {activeTab === 'galeri' && <div className="card"><p>Bagian untuk mengunggah foto galeri akan muncul di sini.</p></div>}
                {activeTab === 'cerita' && <div className="card"><p>Bagian untuk menulis segmen cerita cinta akan muncul di sini.</p></div>}
            </div>
        </div>
    );
};

export default ClientDashboardPage;

