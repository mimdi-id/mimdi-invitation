import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import MempelaiForm from '../components/MempelaiForm';
import EventSection from '../components/EventSection';
import MediaSection from '../components/MediaSection';
import LoveStorySection from '../components/LoveStorySection';
import ThemeSelectionSection from '../components/ThemeSelectionSection';
import './ClientDashboardPage.css';

const ClientDashboardPage = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    
    const [invitationData, setInvitationData] = useState(null);
    const [rsvps, setRsvps] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('mempelai');
    
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [galleryFiles, setGalleryFiles] = useState([]);

    const fetchRsvps = useCallback(async () => {
        if (!slug) return;
        try {
            const rsvpResponse = await axios.get(`http://localhost:5000/api/rsvps/${slug}`);
            setRsvps(rsvpResponse.data.data || []);
        } catch (rsvpError) {
            console.error("Gagal memuat data buku tamu:", rsvpError);
        }
    }, [slug]);

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
                if (!data.events) data.events = [];
                if (!data.loveStories) data.loveStories = [];
                if (!data.galleryPhotos) data.galleryPhotos = [];
                
                setInvitationData(data);
                fetchRsvps();

            } catch (e) {
                console.error("Gagal parse data sesi, sesi tidak valid:", e);
                sessionStorage.removeItem(`client_auth_${slug}`);
                navigate(`/u/${slug}/login`);
            }
        } else {
            navigate(`/u/${slug}/login`);
        }
        setLoading(false);
    }, [slug, navigate, fetchRsvps]);

    const handleLogout = () => {
        sessionStorage.removeItem(`client_auth_${slug}`);
        navigate(`/u/${slug}/login`);
    };

    const handleMempelaiUpdate = (type, updatedMempelaiData) => {
        setInvitationData(prevData => {
            const newMempelaiArray = prevData.mempelai.map(m => 
                m.type === type ? updatedMempelaiData : m
            );
            return { ...prevData, mempelai: newMempelaiArray };
        });
    };
    
    const handleEventsUpdate = (updatedEvents) => {
        setInvitationData(prevData => ({ ...prevData, events: updatedEvents }));
    };
    
    const handleMediaUpdate = (fieldName, value) => {
        setInvitationData(prevData => ({ ...prevData, [fieldName]: value }));
    };

    const handleLoveStoriesUpdate = (updatedStories) => {
        setInvitationData(prevData => ({ ...prevData, loveStories: updatedStories }));
    };

    const handleGalleryUpdate = (files) => {
        setGalleryFiles(files);
    };

    const handleThemeSelected = async (themeId) => {
        setSuccess(''); 
        setError('');
        try {
            const response = await axios.put(`http://localhost:5000/api/client/invitations/${slug}/theme`, { themeId });
            if(response.data.success){
                setSuccess(response.data.message);
                const updatedData = response.data.data;
                setInvitationData(updatedData);
                sessionStorage.setItem(`client_auth_${slug}`, JSON.stringify(updatedData));
            }
        } catch (err) {
            setError(err.response?.data?.error || "Gagal mengganti tema.");
        }
    };

    const handleSaveChanges = async () => {
        setError('');
        setSuccess('');

        const formData = new FormData();
        
        formData.append('mempelaiData', JSON.stringify(invitationData.mempelai));
        formData.append('eventData', JSON.stringify(invitationData.events));
        formData.append('loveStoryData', JSON.stringify(invitationData.loveStories));
        formData.append('turutMengundangData', JSON.stringify(invitationData.turutMengundang));
        formData.append('mediaData', JSON.stringify({
            music_url: invitationData.music_url,
            video_url: invitationData.video_url,
        }));
        formData.append('otherData', JSON.stringify({
            doa_quotes: invitationData.doa_quotes,
            turut_mengundang_text: invitationData.turut_mengundang_text // Kirim data teks
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
                
                if (!updatedData.events) updatedData.events = [];
                if (!updatedData.loveStories) updatedData.loveStories = [];
                if (!updatedData.galleryPhotos) updatedData.galleryPhotos = [];
                if (!updatedData.turutMengundang) updatedData.turutMengundang = [];
                if (!updatedData.mempelai || updatedData.mempelai.length < 2) { 
                    updatedData.mempelai = [
                        updatedData.mempelai?.find(m => m.type === 'Pria') || { type: 'Pria' },
                        updatedData.mempelai?.find(m => m.type === 'Wanita') || { type: 'Wanita' }
                    ];
                 }
                
                delete updatedData.cover_image_file;
                
                setInvitationData(updatedData);
                setGalleryFiles([]);
                sessionStorage.setItem(`client_auth_${slug}`, JSON.stringify(updatedData));
                fetchRsvps();
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
                <button onClick={() => setActiveTab('turut-mengundang')} className={activeTab === 'turut-mengundang' ? 'active' : ''}>Turut Mengundang</button>
                <button onClick={() => setActiveTab('tema')} className={activeTab === 'tema' ? 'active' : ''}>Ganti Tema</button>
            </nav>

            <div className="dashboard-content">
                {error && <p className="error-message">{error}</p>}
                {success && <p className="success-message">{success}</p>}

                {activeTab === 'mempelai' && (
                    <div className="mempelai-forms">
                        <MempelaiForm type="Pria" mempelai={invitationData.mempelai.find(m => m.type === 'Pria')} onUpdate={(data) => handleMempelaiUpdate('Pria', data)} />
                        <MempelaiForm type="Wanita" mempelai={invitationData.mempelai.find(m => m.type === 'Wanita')} onUpdate={(data) => handleMempelaiUpdate('Wanita', data)} />
                    </div>
                )}
                
                {activeTab === 'acara' && (
                    <EventSection events={invitationData.events} onUpdate={handleEventsUpdate} />
                )}
                
                {activeTab === 'galeri' && (
                    <>
                        <MediaSection 
                            invitation={invitationData}
                            onUpdate={handleMediaUpdate}
                            onGalleryUpdate={handleGalleryUpdate}
                        />

                        <div className="card" style={{marginTop: '2rem'}}>
                            <h2>Doa / Kutipan</h2>
                            <div className="form-group">
                                <label>Tampilkan Doa atau Kutipan di Undangan</label>
                                <textarea 
                                    name="doa_quotes" 
                                    rows="4" 
                                    value={invitationData.doa_quotes || ''}
                                    onChange={(e) => handleMediaUpdate('doa_quotes', e.target.value)}
                                    placeholder="Contoh: Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu istri-istri dari jenismu sendiri..."
                                ></textarea>
                            </div>
                        </div>
                    </>
                )}

                {activeTab === 'cerita' && (
                    <LoveStorySection stories={invitationData.loveStories} onUpdate={handleLoveStoriesUpdate} />
                )}

                {activeTab === 'turut-mengundang' && (
                    <div className="card">
                        <h2>Turut Mengundang</h2>
                        <p>Masukkan daftar nama yang turut mengundang. Tulis satu nama per baris untuk hasil terbaik.</p>
                        <div className="form-group">
                            <textarea
                                name="turut_mengundang_text"
                                rows="10"
                                value={invitationData.turut_mengundang_text || ''}
                                onChange={(e) => handleMediaUpdate('turut_mengundang_text', e.target.value)}
                                placeholder="Contoh:&#10;Keluarga Besar Bapak John Doe&#10;Keluarga Besar Ibu Jane Roe"
                            ></textarea>
                        </div>
                    </div>
                )}
                {activeTab === 'rsvps' && (
                    <div className="card rsvp-list-section">
                        <h2>Daftar Konfirmasi Kehadiran</h2>
                        <table>
                            <thead>
                                <tr>
                                    <th>Nama Tamu</th>
                                    <th>Status Kehadiran</th>
                                    <th>Ucapan & Doa</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rsvps.length > 0 ? (
                                    rsvps.map(rsvp => (
                                        <tr key={rsvp.id}>
                                            <td>{rsvp.guest_name}</td>
                                            <td><span className={`status-badge status-${rsvp.attendance_status.toLowerCase().replace(' ', '-')}`}>{rsvp.attendance_status}</span></td>
                                            <td>{rsvp.message || '-'}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr><td colSpan="3">Belum ada tamu yang mengisi buku tamu.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
                
                {activeTab === 'tema' && (
                    <ThemeSelectionSection currentThemeId={invitationData.theme?.id} onThemeSelect={handleThemeSelected} />
                )}
            </div>
        </div>
    );
};

export default ClientDashboardPage;

