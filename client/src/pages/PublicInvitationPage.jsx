import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { themes } from '../themes'; // Impor "peta" tema kita

const PublicInvitationPage = () => {
    const { slug } = useParams();
    const [invitation, setInvitation] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchInvitation = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`http://localhost:5000/api/invitations/public/${slug}`);
                setInvitation(response.data.data);
            } catch (err) {
                setError(err.response?.data?.error || 'Gagal memuat undangan.');
            } finally {
                setLoading(false);
            }
        };
        fetchInvitation();
    }, [slug]);

    if (loading) {
        return <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'}}>Memuat Undangan...</div>;
    }

    if (error || !invitation) {
        return <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'}}>{error || 'Data undangan tidak ditemukan.'}</div>;
    }

    // --- LOGIKA INTI MESIN TEMA ---
    const themeName = invitation.theme?.component_name;
    const SelectedTheme = themes[themeName]; // Pilih komponen tema secara dinamis dari "peta"

    if (!SelectedTheme) {
        return <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', padding: '2rem', textAlign: 'center'}}>
            Error: Tema dengan nama komponen "{themeName}" tidak ditemukan. Pastikan nama komponen di dasbor Super Admin cocok dengan yang ada di kode.
        </div>;
    }
    // -------------------------

    // Render komponen tema yang terpilih dan berikan semua data undangan sebagai prop
    return <SelectedTheme invitation={invitation} />;
};

export default PublicInvitationPage;

