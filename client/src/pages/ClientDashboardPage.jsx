import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import MempelaiForm from '../components/MempelaiForm';
import EventSection from '../components/EventSection';
import MediaSection from '../components/MediaSection';
import LoveStorySection from '../components/LoveStorySection';
import './ClientDashboardPage.css';

const ClientDashboardPage = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    
    const [invitationData, setInvitationData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('mempelai');
    
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [galleryFiles, setGalleryFiles] = useState([]);

    useEffect(() => {
        const storedDataString = sessionStorage.getItem(`client_auth_${slug}`);
        if (storedDataString) {
            try {
                const data = JSON.parse(storedDataString);
                if (!data.mempelai || data.mempelai.length < 2) { data.mempelai = [{ type: 'Pria' }, { type: 'Wanita' }]; }
                if (!data.events) { data.events = []; }
                if (!data.loveStories) { data.loveStories = []; }
                if (!data.galleryPhotos) { data.galleryPhotos = []; }
                setInvitationData(data);
            } catch (e) {
                console.error("Gagal parse data sesi:", e);
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

    const handleMempelaiUpdate = (type, data) => setInvitationData(p => ({...p, mempelai: p.mempelai.map(m => m.type === type ? data : m)}));
    const handleEventsUpdate = (data) => setInvitationData(p => ({...p, events: data}));
    const handleMediaUpdate = (fieldName, value) => setInvitationData(p => ({...p, [fieldName]: value}));
    const handleLoveStoriesUpdate = (data) => setInvitationData(p => ({...p, loveStories: data}));
    const handleGalleryUpdate = (files) => setGalleryFiles(files);

    const handleSaveChanges = async () => {
        setError(''); setSuccess('');
        const formData = new FormData();
        formData.append('mempelaiData', JSON.stringify(invitationData.mempelai));
        formData.append('eventData', JSON.stringify(invitationData.events));
        formData.append('loveStoryData', JSON.stringify(invitationData.loveStories));
        formData.append('mediaData', JSON.stringify({
            music_url: invitationData.music_url, video_url: invitationData.video_url,
        }));
        if (invitationData.cover_image_file) {
            formData.append('cover_image', invitationData.cover_image_file);
        }
        if (galleryFiles.length > 0) {
            galleryFiles.forEach(file => formData.append('gallery_images', file));
        }
        try {
            const response = await axios.put(`http://localhost:5000/api/client/invitations/${slug}/dashboard`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            if(response.data.success){
                setSuccess(response.data.message);
                const updatedData = response.data.data;
                delete updatedData.cover_image_file;
                setInvitationData(updatedData);
                setGalleryFiles([]);
                sessionStorage.setItem(`client_auth_${slug}`, JSON.stringify(updatedData));
            }
        } catch (err) {
            setError(err.response?.data?.error || "Gagal menyimpan data.");
            console.error("Save changes error:", err);
        }
    };

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
                            type="Pria"
                            mempelai={invitationData.mempelai.find(m => m.type === 'Pria')}
                            onUpdate={(data) => handleMempelaiUpdate('Pria', data)} 
                        />
                        <MempelaiForm 
                            type="Wanita"
                            mempelai={invitationData.mempelai.find(m => m.type === 'Wanita')}
                            onUpdate={(data) => handleMempelaiUpdate('Wanita', data)} 
                        />
                    </div>
                )}
                
                {activeTab === 'acara' && (
                    <EventSection 
                        events={invitationData.events}
                        onUpdate={handleEventsUpdate}
                    />
                )}
                
                {activeTab === 'galeri' && (
                    <MediaSection 
                        invitation={invitationData}
                        onUpdate={handleMediaUpdate}
                        onGalleryUpdate={handleGalleryUpdate}
                    />
                )}

                {activeTab === 'cerita' && (
                    <LoveStorySection
                        stories={invitationData.loveStories}
                        onUpdate={handleLoveStoriesUpdate}
                    />
                )}
            </div>
        </div>
    );
};

export default ClientDashboardPage;

