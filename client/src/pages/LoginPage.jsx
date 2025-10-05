import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './LoginPage.css';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await axios.post('http://localhost:5000/api/auth/login', {
                username,
                password,
            });

            if (response.data.success && response.data.token) {
                // Simpan token ke localStorage
                localStorage.setItem('token', response.data.token);
                
                // Ambil peran pengguna dari respons API
                const userRole = response.data.user?.role?.name;

                // Arahkan berdasarkan peran
                if (userRole === 'Super Admin') {
                    navigate('/dashboard'); // Rute defaultnya akan ke /dashboard/admins
                } else if (userRole === 'Admin') {
                    navigate('/admin');     // Rute defaultnya akan ke /admin/dashboard
                } else {
                    // Jika peran tidak dikenali, tampilkan error
                    setError('Peran pengguna tidak valid atau tidak dikenali.');
                    localStorage.removeItem('token'); // Hapus token jika peran tidak valid
                }
            } else {
                setError(response.data.error || 'Terjadi kesalahan saat login.');
            }
        } catch (err) {
            if (err.code === 'ECONNABORTED' || !err.response) {
                setError('Tidak dapat terhubung ke server. Pastikan server backend berjalan.');
            } else {
                setError(err.response?.data?.error || 'Username atau password salah.');
            }
            console.error('Login error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="login-header">
                    <h1>Mimdi Invitation</h1>
                    <p>Silakan Login</p>
                </div>
                <form className="login-form" onSubmit={handleLogin}>
                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Masukkan username"
                            autoComplete="username"
                            disabled={loading}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Masukkan password"
                            autoComplete="current-password"
                            disabled={loading}
                        />
                    </div>
                    {error && <p className="error-message">{error}</p>}
                    <button type="submit" className="login-button" disabled={loading}>
                        {loading ? 'Memproses...' : 'Login'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;

