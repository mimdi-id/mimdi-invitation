import React, { useState, useRef } from 'react';
import YouTube from 'react-youtube';
import RSVPSection from '../../components/RSVPSection';
import SocialIcon from '../../components/SocialIcon.jsx';
import { getYouTubeID } from '../../utils/youtubeHelper';
import './ElegantTheme.css';

const ElegantTheme = ({ invitation }) => {
    const [isCoverOpen, setIsCoverOpen] = useState(false);
    const [isMusicPlaying, setIsMusicPlaying] = useState(false);
    // STATE BARU: Untuk mengelola Lightbox
    const [selectedImage, setSelectedImage] = useState(null); 
    const musicPlayerRef = useRef(null);

    const serverUrl = 'http://localhost:5000';
    // Mengambil nama tamu dari URL
    const guestName = new URLSearchParams(window.location.search).get('to');

    // FUNGSI LIGHTBOX
    const openLightbox = (url) => {
        setSelectedImage(url);
    };

    const closeLightbox = () => {
        setSelectedImage(null);
    };
    // AKHIR FUNGSI LIGHTBOX

    const handleOpenInvitation = () => {
        setIsCoverOpen(true);
        if (musicPlayerRef.current) {
            // Memulai pemutaran musik saat undangan dibuka
            musicPlayerRef.current.playVideo();
        }
    };
    
    const toggleMusic = () => {
        if (!musicPlayerRef.current) return;
        isMusicPlaying ? musicPlayerRef.current.pauseVideo() : musicPlayerRef.current.playVideo();
    };
    
    const pria = invitation.mempelai?.find(m => m.type === 'Pria') || {};
    const wanita = invitation.mempelai?.find(m => m.type === 'Wanita') || {};
    const firstEventDate = invitation.events?.[0]?.event_datetime;
    
    const musicVideoId = getYouTubeID(invitation.music_url);
    const mainVideoId = getYouTubeID(invitation.video_url);

    return (
        // .elegant-theme-body sekarang berfungsi sebagai latar belakang isolasi global
        <div className="elegant-theme-body"> 
            {/* Pemutar Musik Tersembunyi */}
            {musicVideoId && (
                <div className="hidden-player">
                    <YouTube
                        videoId={musicVideoId}
                        opts={{ height: '0', width: '0', playerVars: { autoplay: 0, loop: 1, playlist: musicVideoId } }}
                        onReady={(e) => { 
                            musicPlayerRef.current = e.target; 
                            musicPlayerRef.current.setVolume(30); 
                        }}
                        onStateChange={(e) => {
                            if (e.data === 1) setIsMusicPlaying(true);
                            if (e.data === 2) setIsMusicPlaying(false);
                        }}
                    />
                </div>
            )}

            {/* CONTAINER UTAMA - Dibatasi 500px dan terpusat */}
            <div className="elegant-theme-container">
                
                {!isCoverOpen && (
                    <div 
                        className="cover-section" 
                        style={{ 
                            backgroundImage: invitation.cover_image_url ? `url(${serverUrl}${invitation.cover_image_url})` : 'none', 
                            backgroundColor: '#eee' 
                        }}
                    >
                        <div className="cover-overlay">
                            {guestName && <div className="guest-greeting"><p>Kepada Yth.</p><h3>{guestName}</h3></div>}
                            <p className="cover-intro">Undangan Pernikahan</p>
                            <h1 className="cover-names">{pria.nickname || ''} & {wanita.nickname || ''}</h1>
                            <button onClick={handleOpenInvitation} className="open-invitation-btn">Buka Undangan</button>
                        </div>
                    </div>
                )}

                {isCoverOpen && (
                    <main className="invitation-main">
                        {/* 1. HERO SECTION (Judul & Tanggal) */}
                        <section className="hero-section">
                            <h2 className="hero-title">{invitation.title}</h2>
                            {firstEventDate && <p className="hero-date">{new Date(firstEventDate).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>}
                        </section>
                        
                        {/* 2. QUOTES/DOA SECTION */}
                        {invitation.doa_quotes && <section className="quotes-section"><p>"{invitation.doa_quotes}"</p></section>}

                        {/* 3. MEMPELAI SECTION */}
                        <section className="mempelai-section">
                            <div className="mempelai-card">
                                <h3>{pria.full_name}</h3>
                                <p className="mempelai-nickname">"{pria.nickname}"</p>
                                <p>Putra dari {pria.parents_name}</p>
                                <div className="social-links">
                                    {/* Komponen Eksternal */}
                                    <SocialIcon type="instagram" username={pria.social_media_urls?.instagram} />
                                    <SocialIcon type="tiktok" username={pria.social_media_urls?.tiktok} />
                                </div>
                            </div>
                            <div className="ampersand">{pria.initials || '&'}</div>
                            <div className="mempelai-card">
                                <h3>{wanita.full_name}</h3>
                                <p className="mempelai-nickname">"{wanita.nickname}"</p>
                                <p>Putri dari {wanita.parents_name}</p>
                                <div className="social-links">
                                    {/* Komponen Eksternal */}
                                    <SocialIcon type="instagram" username={wanita.social_media_urls?.instagram} />
                                    <SocialIcon type="tiktok" username={wanita.social_media_urls?.tiktok} />
                                </div>
                            </div>
                        </section>

                        {/* 4. ACARA SECTION */}
                        {invitation.events?.length > 0 && (
                            <section className="acara-section">
                                <h2>Detail Acara</h2>
                                {invitation.events.map((event, index) => (
                                    <div key={index} className="acara-card">
                                        <h3>{event.title}</h3>
                                        <p><strong>Waktu:</strong> {new Date(event.event_datetime).toLocaleString('id-ID', { dateStyle: 'full', timeStyle: 'short' })}</p>
                                        <p><strong>Tempat:</strong> {event.venue_name}</p>
                                        <p>{event.address}</p>
                                    </div>
                                ))}
                            </section>
                        )}

                        {/* 5. LOVE STORY SECTION */}
                        {invitation.loveStories?.length > 0 && (
                            <section className="love-story-section">
                                <h2>Cerita Kami</h2>
                                <div className="timeline">
                                    {invitation.loveStories.map((story, index) => (
                                        <div key={index} className="timeline-item">
                                            <div className="timeline-content">
                                                <h3>{story.title}</h3>
                                                <p>{story.story}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                        
                        {/* 6. VIDEO SECTION */}
                        {mainVideoId && (
                            <section className="video-section">
                                <h2>Video Pre-wedding</h2>
                                <div className="video-wrapper">
                                    <YouTube videoId={mainVideoId} opts={{ height: '100%', width: '100%' }} className="react-youtube-player" />
                                </div>
                            </section>
                        )}

                        {/* 7. GALLERY SECTION */}
                        {invitation.galleryPhotos?.length > 0 && (
                            <section className="gallery-section">
                                <h2>Momen Bahagia</h2>
                                <div className="gallery-grid">
                                    {invitation.galleryPhotos.map((photo) => (
                                        <div 
                                            key={photo.id} 
                                            className="gallery-item"
                                            // Tambahkan onClick untuk membuka Lightbox
                                            onClick={() => openLightbox(`${serverUrl}${photo.image_url}`)} 
                                            style={{ cursor: 'pointer' }} 
                                        >
                                            <img src={`${serverUrl}${photo.image_url}`} alt="Galeri Pernikahan" />
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                        
                        {/* 8. GIFT SECTION */}
                        {(pria.gift_info?.bank_name || wanita.gift_info?.bank_name) && (
                            <section className="gift-section">
                                <h2>Kirim Hadiah</h2>
                                <div className="gift-container">
                                    {pria.gift_info?.bank_name && (
                                        <div className="gift-card">
                                            <h4>{pria.gift_info.bank_name}</h4>
                                            <p>No. Rek: {pria.gift_info.account_number}</p>
                                            <p>a.n. {pria.gift_info.account_name}</p>
                                        </div>
                                    )}
                                    {wanita.gift_info?.bank_name && (
                                        <div className="gift-card">
                                            <h4>{wanita.gift_info.bank_name}</h4>
                                            <p>No. Rek: {wanita.gift_info.account_number}</p>
                                            <p>a.n. {wanita.gift_info.account_name}</p>
                                        </div>
                                    )}
                                </div>
                            </section>
                        )}
                        
                        {/* 9. RSVP SECTION (Komponen Eksternal) */}
                        <RSVPSection slug={invitation.slug} />

                        {/* 10. TURUT MENGUNDANG SECTION */}
                        {invitation.turut_mengundang_text && (
                        <section className="turut-mengundang-section">
                            <h2>Turut Mengundang</h2>
                            <div className="turut-mengundang-names">
                                {invitation.turut_mengundang_text}
                            </div>
                        </section>
                        )}
                        
                        {/* 11. MUSIC CONTROL BUTTON */}
                        {musicVideoId && (
                            <button onClick={toggleMusic} className="music-control-btn">
                                {isMusicPlaying ? '❚❚' : '▶'} 
                            </button>
                        )}
                    </main>
                )}
            </div> {/* Tutup elegant-theme-container */}

            {/* KOMPONEN LIGHTBOX - Tampil jika ada gambar dipilih */}
            {selectedImage && (
                <div 
                    className="lightbox-overlay" 
                    onClick={closeLightbox}
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'rgba(0, 0, 0, 0.95)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        zIndex: 1000,
                        padding: '10px',
                        cursor: 'pointer' // Klik di luar gambar akan menutup
                    }}
                >
                    <div 
                        className="lightbox-content"
                        // Mencegah penutupan modal saat mengklik gambar itu sendiri
                        onClick={(e) => e.stopPropagation()} 
                        style={{
                            maxWidth: '90vw',
                            maxHeight: '90vh',
                            position: 'relative',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center'
                        }}
                    >
                        <img 
                            src={selectedImage} 
                            alt="Foto Galeri Diperbesar" 
                            style={{
                                maxWidth: '100%',
                                maxHeight: '100%',
                                display: 'block',
                                borderRadius: '8px',
                                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.5)'
                            }}
                        />
                        <button 
                            onClick={closeLightbox} 
                            className="lightbox-close-btn"
                            aria-label="Tutup foto"
                            style={{
                                position: 'absolute',
                                top: '10px', 
                                right: '10px',
                                background: 'rgba(0,0,0,0.5)', 
                                border: 'none',
                                color: 'white',
                                fontSize: '1.5rem',
                                fontWeight: '300',
                                cursor: 'pointer',
                                padding: '5px 15px',
                                borderRadius: '50%',
                                lineHeight: '1',
                                opacity: 0.8,
                                transition: 'opacity 0.2s',
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.opacity = 1}
                            onMouseLeave={(e) => e.currentTarget.style.opacity = 0.8}
                        >
                            &times;
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ElegantTheme;
