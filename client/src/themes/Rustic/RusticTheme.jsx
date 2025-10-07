import React from 'react';
import './RusticTheme.css'; // CSS yang sama sekali berbeda

const RusticTheme = ({ invitation }) => {
    const pria = invitation.mempelai?.find(m => m.type === 'Pria') || {};
    const wanita = invitation.mempelai?.find(m => m.type === 'Wanita') || {};

    return (
        <div className="rustic-theme-body">
            <header className="rustic-header">
                <p>WE ARE GETTING MARRIED</p>
                <h1>{pria.nickname} & {wanita.nickname}</h1>
                <span>{new Date(invitation.events?.[0]?.event_datetime).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </header>
            <div className="rustic-content">
                <p>Ini adalah contoh tema Rustic yang memiliki struktur dan gaya yang sama sekali berbeda.</p>
                <h2>{invitation.title}</h2>
                <p>Desain lengkap untuk tema ini dapat dikembangkan di sini.</p>
            </div>
        </div>
    );
};

export default RusticTheme;

