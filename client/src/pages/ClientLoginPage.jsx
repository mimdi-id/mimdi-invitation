import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import './LoginPage.css'; // Kita bisa pakai ulang styling login

const ClientLoginPage = () => {
    const [pin, setPin] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    
    const { slug } = useParams(); // Mengambil slug dari URL
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await axios.post('http://localhost:5000/api/client/auth', {
                slug,
                pin,
            });

            if (response.data.success) {
                // Simpan data undangan ke sessionStorage agar bisa diakses di dasbor
                // sessionStorage akan terhapus saat tab browser ditutup
                sessionStorage.setItem(`client_auth_${slug}`, JSON.stringify(response.data.data));
                navigate(`/u/${slug}/dashboard`);
            } else {
                setError(response.data.error || 'Terjadi kesalahan.');
            }
        } catch (err) {
            setError(err.response?.data?.error || 'PIN salah atau undangan tidak ditemukan.');
            console.error('Client login error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="login-header">
                    <h1>Selamat Datang</h1>
                    <p>Silakan masukkan PIN untuk mengelola undangan Anda.</p>
                </div>
                <form className="login-form" onSubmit={handleLogin}>
                    <div className="form-group">
                        <label htmlFor="pin">PIN Akses</label>
                        <input
                            type="password"
                            id="pin"
                            value={pin}
                            onChange={(e) => setPin(e.target.value)}
                            placeholder="Masukkan PIN Anda"
                            disabled={loading}
                        />
                    </div>
                    {error && <p className="error-message">{error}</p>}
                    <button type="submit" className="login-button" disabled={loading}>
                        {loading ? 'Memverifikasi...' : 'Masuk'}
                    </button>
                </form>
            </div>
        </div>
    );
};

// INI BAGIAN YANG HILANG:
export default ClientLoginPage;

