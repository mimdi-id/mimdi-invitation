import React from 'react';
import { useParams } from 'react-router-dom';

// Ini adalah komponen placeholder untuk halaman undangan publik
// Nanti kita akan mengisinya dengan data undangan yang sesungguhnya

const PublicInvitationPage = () => {
    const { slug } = useParams();

    return (
        <div style={{ padding: '40px', fontFamily: 'sans-serif', textAlign: 'center' }}>
            <h1>Halaman Undangan Publik</h1>
            <p>Ini adalah halaman untuk undangan dengan slug: <strong>{slug}</strong></p>
            <p>Fitur ini sedang dalam pengembangan.</p>
        </div>
    );
};

export default PublicInvitationPage;
