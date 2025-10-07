import React, { useState, useRef } from 'react';
import YouTube from 'react-youtube';
import RSVPSection from '../../components/RSVPSection';
import SocialIcon from '../../components/SocialIcon.jsx'; // Memastikan impor benar
import { getYouTubeID } from '../../utils/youtubeHelper';
import './ElegantTheme.css'; // Menggunakan CSS khusus untuk tema ini

const ElegantTheme = ({ invitation }) => {
    const [isCoverOpen, setIsCoverOpen] = useState(false);
    const [isMusicPlaying, setIsMusicPlaying] = useState(false);
    const musicPlayerRef = useRef(null);

    const serverUrl = 'http://localhost:5000';
    const guestName = new URLSearchParams(window.location.search).get('to');

    const handleOpenInvitation = () => {
        setIsCoverOpen(true);
        if (musicPlayerRef.current) {
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
        <div className="elegant-theme-body">
            {musicVideoId && (
                <div className="hidden-player">
                    <YouTube
                        videoId={musicVideoId}
                        opts={{ height: '0', width: '0', playerVars: { autoplay: 0, loop: 1, playlist: musicVideoId } }}
                        onReady={(e) => { musicPlayerRef.current = e.target; musicPlayerRef.current.setVolume(30); }}
                        onStateChange={(e) => {
                            if (e.data === 1) setIsMusicPlaying(true);
                            if (e.data === 2) setIsMusicPlaying(false);
                        }}
                    />
                </div>
            )}

            {!isCoverOpen && (
                <div className="cover-section" style={{ backgroundImage: invitation.cover_image_url ? `url(${serverUrl}${invitation.cover_image_url})` : 'none', backgroundColor: '#eee' }}>
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
                    <section className="hero-section">
                        <h2 className="hero-title">{invitation.title}</h2>
                        {firstEventDate && <p className="hero-date">{new Date(firstEventDate).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>}
                    </section>
                    
                    <section className="mempelai-section">
                        <div className="mempelai-card">
                            <h3>{pria.full_name}</h3>
                            <p className="mempelai-nickname">"{pria.nickname}"</p>
                            <p>Putra dari {pria.parents_name}</p>
                            <div className="social-links">
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
                                <SocialIcon type="instagram" username={wanita.social_media_urls?.instagram} />
                                <SocialIcon type="tiktok" username={wanita.social_media_urls?.tiktok} />
                            </div>
                        </div>
                    </section>

                    {invitation.doa_quotes && <section className="quotes-section"><p>"{invitation.doa_quotes}"</p></section>}

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

                    {invitation.galleryPhotos?.length > 0 && (
                        <section className="gallery-section">
                            <h2>Momen Bahagia</h2>
                            <div className="gallery-grid">
                                {invitation.galleryPhotos.map((photo) => (
                                    <div key={photo.id} className="gallery-item">
                                        <img src={`${serverUrl}${photo.image_url}`} alt="Galeri Pernikahan" />
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                    
                    {mainVideoId && (
                        <section className="video-section">
                            <h2>Video Pre-wedding</h2>
                            <div className="video-wrapper">
                                <YouTube videoId={mainVideoId} opts={{ height: '100%', width: '100%' }} className="react-youtube-player" />
                            </div>
                        </section>
                    )}
                    
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

                    <RSVPSection slug={invitation.slug} />
                    
                    {musicVideoId && (
                        <button onClick={toggleMusic} className="music-control-btn">
                            {isMusicPlaying ? 'Pause Musik' : 'Play Musik'}
                        </button>
                    )}
                </main>
            )}
        </div>
    );
};

export default ElegantTheme;

