import React, { useState, useRef, useCallback, useEffect } from 'react';

// --- UTILITY FUNCTIONS & INLINED COMPONENTS ---

// 1. YouTube ID Extractor (Inlined from utils/youtubeHelper)
const getYouTubeID = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2]?.length === 11) ? match[2] : null;
};

// 2. Ikon Sederhana untuk Kontrol Musik
const MusicIcon = ({ isPlaying }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
        {isPlaying ? (
            // Pause Icon
            <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
        ) : (
            // Play Icon
            <path d="M8 5v14l11-7z"/>
        )}
        <path d="M0 0h24v24H0z" fill="none"/>
    </svg>
);

// 3. Ikon Salin
const CopyIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 ml-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
    </svg>
);

// 4. Social Icon (Disimplifikasi, menggunakan ikon SVG)
const SocialIcon = ({ type, username }) => {
    if (!username) return null;
    let Icon;
    let url = '#';

    // Mendefinisikan warna utama baru untuk tautan sosial
    const iconColor = '#c5a47e';

    switch (type) {
        case 'instagram':
            Icon = (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
            );
            url = `https://instagram.com/${username}`;
            break;
        case 'tiktok':
            Icon = (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 8V5H10v14c0 1.66-1.34 3-3 3s-3-1.34-3-3 1.34-3 3-3c1.07 0 2.01.58 2.5 1.45V8h6.5A.5.5 0 0 1 21 8z"/></svg>
            );
            url = `https://tiktok.com/@${username}`;
            break;
        default:
            return null;
    }

    return (
        <a href={url} target="_blank" rel="noopener noreferrer" className="social-link-icon" aria-label={`Link ${type} ${username}`}>
            {Icon}
        </a>
    );
};

// 5. RSVP Section Placeholder (Inlined from components/RSVPSection)
const RSVPSection = ({ slug }) => {
    // Ini adalah placeholder UI karena Firestore/API integration membutuhkan file terpisah
    const [name, setName] = useState('');
    const [attend, setAttend] = useState('yes');
    const [message, setMessage] = useState('');
    const [status, setStatus] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // Simulasi pengiriman data
        console.log(`RSVP for slug ${slug}: Name=${name}, Attend=${attend}, Message=${message}`);
        
        if (!name.trim()) {
            setStatus('Mohon isi nama Anda.');
            return;
        }

        // Simulasikan success/error
        setStatus(attend === 'yes' 
            ? 'Terima kasih atas konfirmasinya! Kami menantikan kehadiran Anda.'
            : 'Terima kasih telah menginformasikan. Kami akan mendoakan Anda dari sini.'
        );

        // Reset form
        setName('');
        setMessage('');
        setTimeout(() => setStatus(''), 5000);
    };

    return (
        <section className="rsvp-section">
            <h2>Konfirmasi Kehadiran</h2>
            <p className="rsvp-intro">Mohon konfirmasi kehadiran Anda melalui formulir di bawah ini.</p>
            
            <form onSubmit={handleSubmit} className="rsvp-form">
                <div className="form-group">
                    <label htmlFor="name">Nama Anda:</label>
                    <input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Nama Lengkap"
                        required
                    />
                </div>

                <div className="form-group radio-group">
                    <label>Apakah Anda akan hadir?</label>
                    <div className="radio-options">
                        <label>
                            <input type="radio" value="yes" checked={attend === 'yes'} onChange={() => setAttend('yes')} /> Ya, Insya Allah Hadir
                        </label>
                        <label>
                            <input type="radio" value="no" checked={attend === 'no'} onChange={() => setAttend('no')} /> Mohon Maaf, Tidak
                        </label>
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="message">Ucapan & Doa Restu:</label>
                    <textarea
                        id="message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Tulis ucapan terbaik Anda di sini..."
                        rows="4"
                    ></textarea>
                </div>
                
                <button type="submit" className="rsvp-btn">Kirim Konfirmasi</button>
            </form>

            {status && <p className="rsvp-status-message">{status}</p>}
            
            {/* INLINED RSVP FORM STYLES */}
            <style>
                {`
                    .elegant-theme-body .rsvp-section {
                        padding: 4rem 1rem;
                        background-color: #fcfcfc;
                    }
                    .elegant-theme-body .rsvp-intro {
                        margin-bottom: 2rem;
                    }
                    .elegant-theme-body .rsvp-form {
                        display: flex;
                        flex-direction: column;
                        gap: 1.5rem;
                        max-width: 400px;
                        margin: 0 auto;
                        text-align: left;
                        padding: 2rem;
                        border: 1px solid #e0dcd7; /* Menggunakan warna dari skema baru */
                        border-radius: 8px;
                        background-color: white;
                    }
                    .elegant-theme-body .form-group label {
                        display: block;
                        margin-bottom: 0.5rem;
                        font-weight: 500;
                        color: #4a4a4a;
                    }
                    .elegant-theme-body .form-group input[type="text"],
                    .elegant-theme-body .form-group textarea {
                        width: 100%;
                        padding: 0.75rem;
                        border: 1px solid #ddd;
                        border-radius: 4px;
                        font-family: 'Poppins', sans-serif;
                    }
                    .elegant-theme-body .radio-options {
                        display: flex;
                        gap: 1.5rem;
                        font-weight: 300;
                    }
                    .elegant-theme-body .radio-options label {
                        display: flex;
                        align-items: center;
                        gap: 0.5rem;
                    }
                    .elegant-theme-body .rsvp-btn {
                        background-color: #c5a47e; /* Warna primary baru */
                        color: white;
                        padding: 0.8rem;
                        border: none;
                        border-radius: 4px;
                        cursor: pointer;
                        font-size: 1rem;
                        transition: background-color 0.3s;
                    }
                    .elegant-theme-body .rsvp-btn:hover {
                        background-color: #a88a64;
                    }
                    .elegant-theme-body .rsvp-status-message {
                        margin-top: 1.5rem;
                        font-weight: 500;
                        color: #c5a47e;
                    }
                `}
            </style>
        </section>
    );
};

// --- MAIN COMPONENT ---

const ElegantTheme = ({ invitation }) => {
    const [isCoverOpen, setIsCoverOpen] = useState(false);
    const [isMusicPlaying, setIsMusicPlaying] = useState(false);
    const [copiedAccount, setCopiedAccount] = useState(null);
    const audioRef = useRef(null); 

    // Mengambil serverUrl dari lingkungan jika tersedia, atau fallback
    const serverUrl = typeof window !== 'undefined' && window.__SERVER_URL__ ? window.__SERVER_URL__ : 'http://localhost:5000';
    const guestName = new URLSearchParams(window.location.search).get('to');

    const pria = invitation.mempelai?.find(m => m.type === 'Pria') || {};
    const wanita = invitation.mempelai?.find(m => m.type === 'Wanita') || {};
    const firstEventDate = invitation.events?.[0]?.event_datetime;

    const musicVideoId = getYouTubeID(invitation.music_url);

    // Fungsi untuk menyalin nomor rekening
    const handleCopy = useCallback((accountNumber, name) => {
        const tempTextArea = document.createElement('textarea');
        tempTextArea.value = accountNumber;
        document.body.appendChild(tempTextArea);
        tempTextArea.select();
        try {
            document.execCommand('copy');
            setCopiedAccount(name);
            setTimeout(() => setCopiedAccount(null), 2000);
        } catch (err) {
            console.error('Gagal menyalin:', err);
        } finally {
            document.body.removeChild(tempTextArea);
        }
    }, []);

    const handleOpenInvitation = () => {
        setIsCoverOpen(true);
        // Kontrol musik setelah undangan dibuka
        if (musicVideoId) {
            // Karena kontrol iframe YouTube terbatas, kita hanya flip state visual
            setIsMusicPlaying(true);
        } else if (audioRef.current) {
            audioRef.current.volume = 0.3;
            audioRef.current.play().catch(e => console.log("Autoplay blocked:", e));
            setIsMusicPlaying(true);
        }
    };
    
    const toggleMusic = () => {
        if (musicVideoId) {
            // Hanya flip state visual jika YouTube
            setIsMusicPlaying(prev => !prev);
        } else if (audioRef.current) {
            if (isMusicPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play();
            }
            setIsMusicPlaying(prev => !prev);
        }
    };

    // Efek untuk memuat font dan memastikan responsif
    useEffect(() => {
        document.body.style.margin = 0;
        document.body.style.padding = 0;
        document.body.style.boxSizing = 'border-box';
    }, []);


    // --- YOUTUBE IFRAME GENERATOR ---
    const YouTubeIframe = ({ videoId, isBackground = false }) => {
        if (!videoId) return null;
        // Gunakan parameter loop, playlist, dan mute yang sesuai untuk musik latar
        const src = `https://www.youtube.com/embed/${videoId}?autoplay=${isBackground ? 1 : 0}&loop=${isBackground ? 1 : 0}&playlist=${isBackground ? videoId : ''}&controls=${isBackground ? 0 : 1}&modestbranding=1&rel=0&showinfo=0&mute=${isBackground ? 1 : 0}`;

        return (
            <div className={isBackground ? "hidden-player" : "video-wrapper"}>
                {/* Iframe dimasukkan secara kondisional. Jika ini adalah musik latar, 
                    display:none/hidden-player memastikan iframe ada tetapi tidak terlihat, 
                    memungkinkan autoplay jika browser mengizinkannya.
                */}
                <iframe
                    title={isBackground ? "Music Player" : "Video Kenangan"}
                    className={isBackground ? "music-iframe" : "react-youtube-player"}
                    src={src}
                    frameBorder="0"
                    // Mengizinkan autoplay saat iframe muncul
                    allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    style={{ 
                        display: isBackground ? 'none' : 'block',
                        width: isBackground ? '0' : '100%',
                        height: isBackground ? '0' : '100%',
                        position: isBackground ? 'absolute' : 'relative' 
                    }}
                />
            </div>
        );
    };

    const mainVideoId = getYouTubeID(invitation.video_url);

    return (
        <div className="elegant-theme-body">
            
            {/* INLINED CSS (Menggantikan CSS sebelumnya dengan yang baru dari user) */}
            <style>
                {`
                    /* -------------------------------------------------------------------
                    * ElegantTheme.css content START
                    * ------------------------------------------------------------------- */
                    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Poppins:wght@300;400;500&display=swap');

                    .elegant-theme-body {
                        font-family: 'Poppins', sans-serif;
                        background-color: #fdfaf6;
                        color: #4a4a4a;
                        line-height: 1.8;
                    }

                    /* Loader dan Halaman Error di dalam tema (jika diperlukan) */
                    .elegant-theme-body .page-loader, .elegant-theme-body .page-error {
                        /* ... styling ... */
                    }

                    /* Cover Section */
                    .elegant-theme-body .cover-section {
                        position: fixed; /* Penting untuk cover */
                        top: 0; left: 0;
                        width: 100%;
                        height: 100%; /* Menggunakan 100% dari viewport height */
                        background-size: cover;
                        background-position: center;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        text-align: center;
                        color: white;
                        z-index: 100;
                        transition: opacity 1s ease-in-out;
                    }
                    .elegant-theme-body .cover-overlay { 
                        background-color: rgba(0, 0, 0, 0.5); 
                        padding: 2rem; 
                        border-radius: 12px; 
                        max-width: 90%;
                    }
                    .elegant-theme-body .cover-intro { font-size: 1.2rem; letter-spacing: 2px; }
                    .elegant-theme-body .cover-names { 
                        font-family: 'Playfair Display', serif; 
                        font-size: 4rem; 
                        margin: 1rem 0; 
                        line-height: 1.1;
                    }
                    .elegant-theme-body .open-invitation-btn {
                        padding: 0.8rem 2rem; border: 2px solid white; background-color: transparent;
                        color: white; font-size: 1rem; font-weight: 500; border-radius: 50px;
                        cursor: pointer; transition: all 0.3s;
                    }
                    .elegant-theme-body .open-invitation-btn:hover { background-color: white; color: #4a4a4a; }
                    .elegant-theme-body .guest-greeting {
                        background-color: rgba(255, 255, 255, 0.1); padding: 0.5rem 1.5rem;
                        border-radius: 8px; margin-bottom: 2rem; border: 1px solid rgba(255, 255, 255, 0.2);
                        max-width: fit-content; margin-left: auto; margin-right: auto;
                    }
                    .elegant-theme-body .guest-greeting p { margin: 0; font-size: 0.9rem; }
                    .elegant-theme-body .guest-greeting h3 { margin: 0.2rem 0 0 0; font-size: 1.5rem; font-weight: 600; font-family: 'Poppins', sans-serif; }

                    /* Main Content */
                    .elegant-theme-body .invitation-main { animation: fadeIn 1s ease-in-out; padding: 4rem 1rem; }
                    .elegant-theme-body section { max-width: 800px; margin: 4rem auto; text-align: center; }
                    .elegant-theme-body .hero-title { font-family: 'Playfair Display', serif; font-size: 3rem; }
                    .elegant-theme-body .hero-date { font-size: 1.2rem; color: #888; }
                    .elegant-theme-body .mempelai-section { display: flex; flex-direction: column; justify-content: center; align-items: center; gap: 2rem; }
                    .elegant-theme-body .mempelai-card { flex: 1; }
                    .elegant-theme-body .mempelai-card h3 { font-family: 'Playfair Display', serif; font-size: 2rem; margin-bottom: 0.5rem; color: #c5a47e; }
                    .elegant-theme-body .mempelai-nickname { font-style: italic; color: #888; margin-top: -0.5rem; }
                    .elegant-theme-body .social-links { margin-top: 1rem; display: flex; justify-content: center; gap: 0.5rem; }
                    .elegant-theme-body .social-link-icon { color: #c5a47e; transition: color 0.3s; }
                    .elegant-theme-body .social-link-icon:hover { color: #4a4a4a; }
                    .elegant-theme-body .ampersand { font-family: 'Playfair Display', serif; font-size: 3rem; color: #c5a47e; }

                    .elegant-theme-body .quotes-section { padding: 2rem; background-color: white; border-left: 5px solid #c5a47e; font-style: italic; font-size: 1.1rem; }
                    .elegant-theme-body .quotes-section p { margin: 0; }
                    
                    .elegant-theme-body h2 {
                         font-family: 'Playfair Display', serif;
                         font-size: 2.5rem;
                         margin-bottom: 2rem;
                         color: #4a4a4a;
                    }

                    .elegant-theme-body .acara-card { background-color: white; padding: 2rem; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); margin-bottom: 1.5rem; }
                    .elegant-theme-body .acara-grid { display: flex; flex-direction: column; gap: 1rem; margin-top: 2rem; }
                    .elegant-theme-body .acara-card h3 { color: #c5a47e; font-family: 'Poppins', sans-serif; }

                    .elegant-theme-body .timeline { position: relative; max-width: 750px; margin: 0 auto; padding-left: 20px; text-align: left; }
                    .elegant-theme-body .timeline::after { content: ''; position: absolute; width: 3px; background-color: #e0dcd7; top: 0; bottom: 0; left: 31px; margin-left: -1.5px; }
                    .elegant-theme-body .timeline-item { padding: 10px 40px; position: relative; background-color: inherit; width: 100%; margin-bottom: 2.5rem; }
                    .elegant-theme-body .timeline-item::after { content: ''; position: absolute; width: 20px; height: 20px; left: 21px; background-color: white; border: 4px solid #c5a47e; top: 25px; border-radius: 50%; z-index: 1; }
                    .elegant-theme-body .timeline-item:nth-child(odd) { left: 0; }
                    .elegant-theme-body .timeline-item:nth-child(even) { left: 0; } /* Diubah agar cocok dengan mobile-first */
                    .elegant-theme-body .timeline-content { padding: 20px 30px; background-color: white; position: relative; border-radius: 8px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); }
                    .elegant-theme-body .timeline-content h3 { font-family: 'Playfair Display', serif; margin-top: 0; color: #c5a47e; }

                    .elegant-theme-body .gallery-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 1rem; margin-top: 2rem; }
                    .elegant-theme-body .gallery-item { aspect-ratio: 1 / 1; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05); } 
                    .elegant-theme-body .gallery-item img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.3s; }
                    .elegant-theme-body .gallery-item:hover img { transform: scale(1.05); }

                    .elegant-theme-body .video-wrapper { position: relative; padding-bottom: 56.25%; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.1); margin: 2rem auto; max-width: 700px; }
                    .elegant-theme-body .video-wrapper .react-youtube-player { position: absolute; top: 0; left: 0; width: 100%; height: 100%; }

                    .elegant-theme-body .gift-container { display: flex; flex-wrap: wrap; justify-content: center; gap: 1rem; }
                    .elegant-theme-body .gift-card { background-color: white; padding: 1.5rem; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); text-align: left; flex: 1 1 300px; max-width: 400px; }
                    .elegant-theme-body .gift-card h4 { margin: 0 0 0.5rem 0; color: #c5a47e; font-family: 'Poppins', sans-serif; font-weight: 500; }
                    .elegant-theme-body .gift-card p { margin: 0.2rem 0; font-size: 0.95rem; }
                    
                    .elegant-theme-body .account-number-wrapper {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        border: 1px dashed #e0dcd7;
                        padding: 0.75rem;
                        border-radius: 6px;
                        margin: 0.5rem 0;
                    }
                    
                    .elegant-theme-body .copy-btn {
                        background: #c5a47e;
                        color: white;
                        padding: 0.5rem;
                        border: none;
                        border-radius: 6px;
                        cursor: pointer;
                        font-size: 0.8rem;
                        display: flex;
                        align-items: center;
                        transition: background-color 0.3s ease;
                    }
                    .elegant-theme-body .copy-btn:hover { background-color: #a88a64; }
                    
                    .elegant-theme-body .turut-mengundang-names {
                        white-space: pre-wrap; 
                        line-height: 2;
                        font-size: 1.1rem;
                    }


                    /* Utilities */
                    .hidden-player { display: none; visibility: hidden; }
                    .music-control-btn { position: fixed; bottom: 20px; right: 20px; z-index: 999; background-color: #c5a47e; color: white; border: none; border-radius: 50%; width: 50px; height: 50px; display: flex; justify-content: center; align-items: center; cursor: pointer; box-shadow: 0 4px 10px rgba(0,0,0,0.2); transition: background-color 0.3s; }
                    .music-control-btn:hover { background-color: #a88a64; }
                    .music-control-btn svg { width: 20px; height: 20px; }

                    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

                    @media screen and (min-width: 601px) {
                        .elegant-theme-body .mempelai-section { 
                            flex-direction: row; 
                            justify-content: center;
                        }
                        .elegant-theme-body .acara-grid { 
                            flex-direction: row; 
                            justify-content: center;
                        }
                        .elegant-theme-body .acara-card {
                            flex: 1;
                            max-width: 50%;
                        }

                        .elegant-theme-body .timeline { padding-left: 0; }
                        .elegant-theme-body .timeline::after { left: 50%; }
                        .elegant-theme-body .timeline-item { width: 50%; }
                        
                        /* Timeline positioning for desktop */
                        .elegant-theme-body .timeline-item:nth-child(odd) { 
                            left: 0; 
                            padding-right: 40px; 
                            padding-left: 0;
                            text-align: right; 
                        }
                        .elegant-theme-body .timeline-item:nth-child(even) { 
                            left: 50%; 
                            padding-left: 40px; 
                            padding-right: 0;
                            text-align: left;
                        }
                        .elegant-theme-body .timeline-item:nth-child(odd)::after { right: -10px; left: unset; }
                        .elegant-theme-body .timeline-item:nth-child(even)::after { left: -10px; right: unset; }
                        
                        .elegant-theme-body .gift-container { gap: 2rem; }
                    }
                    
                    /* -------------------------------------------------------------------
                    * ElegantTheme.css content END
                    * ------------------------------------------------------------------- */
                `}
            </style>
            
            {/* YouTube Player for Music (Hidden) */}
            {musicVideoId && !isCoverOpen && (
                <YouTubeIframe videoId={musicVideoId} isBackground={true} />
            )}


            {/* Cover Section (Tampilan Awal) */}
            {!isCoverOpen && (
                <div 
                    className="cover-section" 
                    style={{ 
                        backgroundImage: invitation.cover_image_url ? `url(${serverUrl}${invitation.cover_image_url})` : 'none', 
                        backgroundColor: '#f5f5f5'
                    }}
                >
                    <div className="cover-overlay">
                        <p className="cover-intro">The Wedding of</p>
                        <h1 className="cover-names">{pria.nickname || 'B'} & {wanita.nickname || 'A'}</h1>
                        {firstEventDate && 
                            <p className="cover-date" style={{ fontFamily: 'Poppins, sans-serif' }}>
                                {new Date(firstEventDate).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
                            </p>
                        }
                        
                        {guestName && 
                            <div className="guest-greeting">
                                <p>Kepada Yth.</p>
                                <h3>{guestName}</h3>
                            </div>
                        }

                        <button onClick={handleOpenInvitation} className="open-invitation-btn">
                            Buka Undangan
                        </button>
                    </div>
                </div>
            )}

            {/* Main Invitation Content */}
            {isCoverOpen && (
                <main className="invitation-main">
                    <section className="hero-section">
                        <p className="hero-greeting" style={{ fontStyle: 'normal', color: '#4a4a4a' }}>Assalamu'alaikum Warahmatullahi Wabarakatuh</p>
                        <h2 className="hero-title">Kami Mengundang Anda</h2>
                        <p className="hero-desc" style={{ maxWidth: '80%', margin: '1rem auto 0 auto', color: '#4a4a4a' }}>Dengan memohon rahmat dan ridho Allah SWT, kami bermaksud menyelenggarakan acara pernikahan putra dan putri kami.</p>
                    </section>
                    
                    <section className="mempelai-section">
                        <div className="mempelai-card">
                            <h3>{pria.full_name || 'Nama Pria Lengkap'}</h3>
                            <p className="mempelai-nickname">({pria.nickname || 'Inisial'})</p>
                            <p className="mempelai-parents">Putra dari Bpk. & Ibu {pria.parents_name || '... '}</p>
                            <div className="social-links">
                                <SocialIcon type="instagram" username={pria.social_media_urls?.instagram} />
                                <SocialIcon type="tiktok" username={pria.social_media_urls?.tiktok} />
                            </div>
                        </div>
                        <div className="ampersand">{pria.initials || 'P'} <span style={{ fontSize: '1.5rem', fontFamily: 'Poppins, sans-serif' }}>&</span> {wanita.initials || 'W'}</div>
                        <div className="mempelai-card">
                            <h3>{wanita.full_name || 'Nama Wanita Lengkap'}</h3>
                            <p className="mempelai-nickname">({wanita.nickname || 'Inisial'})</p>
                            <p className="mempelai-parents">Putri dari Bpk. & Ibu {wanita.parents_name || '... '}</p>
                            <div className="social-links">
                                <SocialIcon type="instagram" username={wanita.social_media_urls?.instagram} />
                                <SocialIcon type="tiktok" username={wanita.social_media_urls?.tiktok} />
                            </div>
                        </div>
                    </section>

                    {invitation.doa_quotes && <section className="quotes-section"><p>"{invitation.doa_quotes}"</p></section>}

                    {/* Acara Section */}
                    {invitation.events?.length > 0 && (
                        <section className="acara-section">
                            <h2>Detail Acara</h2>
                            <div className="acara-grid">
                                {invitation.events.map((event, index) => (
                                    <div key={index} className="acara-card">
                                        <div className="acara-icon-box">
                                            {event.title.toLowerCase().includes('akad') && <span className="icon-text" style={{ fontSize: '2rem' }}>💍</span>}
                                            {event.title.toLowerCase().includes('resepsi') && <span className="icon-text" style={{ fontSize: '2rem' }}>🎉</span>}
                                            <h3 style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 500 }}>{event.title}</h3>
                                        </div>
                                        <p className="acara-date" style={{ fontWeight: 500 }}>{new Date(event.event_datetime).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                        <p className="acara-time" style={{ fontWeight: 500 }}>{new Date(event.event_datetime).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB</p>
                                        <p className="acara-venue" style={{ color: '#c5a47e', fontWeight: 500 }}>{event.venue_name}</p>
                                        <p className="acara-address" style={{ fontSize: '0.9rem' }}>{event.address}</p>
                                        {/* Tombol Map bisa ditambahkan di sini */}
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Love Story Section (Timeline) */}
                    {invitation.loveStories?.length > 0 && (
                        <section className="love-story-section">
                            <h2>Perjalanan Cinta Kami</h2>
                            <div className="timeline">
                                {invitation.loveStories.map((story, index) => (
                                    <div key={index} className="timeline-item">
                                        <div className="timeline-item::after"></div> {/* Pseudo-element dot */}
                                        <div className="timeline-content">
                                            <h3 className="story-title" style={{ fontFamily: 'Playfair Display, serif', color: '#c5a47e' }}>{story.title}</h3>
                                            <p className="story-text" style={{ fontSize: '0.95rem' }}>{story.story}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Gallery Section */}
                    {invitation.galleryPhotos?.length > 0 && (
                        <section className="gallery-section">
                            <h2>Momen Bahagia</h2>
                            <div className="gallery-grid">
                                {invitation.galleryPhotos.map((photo) => (
                                    <div key={photo.id} className="gallery-item">
                                        <img 
                                            src={`${serverUrl}${photo.image_url}`} 
                                            alt="Galeri Pernikahan" 
                                            loading="lazy" 
                                            onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/250x250/c5a47e/ffffff?text=Photo+Error'; }} // Fallback
                                        />
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                    
                    {/* Video Section */}
                    {mainVideoId && (
                        <section className="video-section">
                            <h2>Video Kenangan</h2>
                            <YouTubeIframe videoId={mainVideoId} isBackground={false} />
                        </section>
                    )}
                    
                    {/* Gift Section with Copy Function */}
                    {(pria.gift_info?.bank_name || wanita.gift_info?.bank_name) && (
                        <section className="gift-section">
                            <h2>Amplop Digital & Hadiah</h2>
                            <p className="gift-intro-text" style={{ fontStyle: 'italic', marginBottom: '1rem' }}>Doa restu Anda adalah hadiah terindah. Namun, jika Anda ingin mengirimkan hadiah, Anda bisa melalui cara berikut:</p>
                            <div className="gift-container">
                                {[pria, wanita].filter(m => m.gift_info?.bank_name).map((mempelai, index) => {
                                    const info = mempelai.gift_info;
                                    const uniqueKey = `${mempelai.nickname}-${index}`;

                                    return (
                                        <div key={uniqueKey} className="gift-card">
                                            <h4>{info.bank_name} - a.n. {info.account_name}</h4>
                                            <div className="account-number-wrapper">
                                                <p className="account-number-text" style={{ fontWeight: 500, margin: 0 }}>{info.account_number}</p>
                                                <button 
                                                    onClick={() => handleCopy(info.account_number, mempelai.nickname)} 
                                                    className="copy-btn"
                                                >
                                                    {copiedAccount === mempelai.nickname ? 'Tersalin!' : <CopyIcon />}
                                                </button>
                                            </div>
                                            {info.shipping_address && <p className="shipping-address">Alamat Kado: {info.shipping_address}</p>}
                                        </div>
                                    );
                                })}
                            </div>
                        </section>
                    )}

                    {/* Turut Mengundang Section */}
                    {invitation.turut_mengundang_text && (
                        <section className="turut-mengundang-section">
                            <h2>Turut Mengundang</h2>
                            <div className="turut-mengundang-names">
                                {invitation.turut_mengundang_text}
                            </div>
                            <p className="turut-mengundang-closing" style={{ fontStyle: 'italic', marginTop: '1.5rem', fontSize: '0.9rem' }}>Kami yang berbahagia, Keluarga Besar {pria.parents_name} & {wanita.parents_name}</p>
                        </section>
                    )}

                    {/* RSVP Section (Inlined Placeholder) */}
                    <RSVPSection slug={invitation.slug} />
                </main>
            )}

            {/* Floating Music Control Button */}
            {musicVideoId && isCoverOpen && (
                <button onClick={toggleMusic} className={`music-control-btn ${isMusicPlaying ? 'playing' : 'paused'}`}>
                    <MusicIcon isPlaying={isMusicPlaying} />
                </button>
            )}
        </div>
    );
};

export default ElegantTheme;
