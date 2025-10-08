import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
// import './LoginPage.css'; // Dihapus untuk mengatasi masalah resolusi file CSS

const COLORS = {
    primary: '#ff5722', // Deep Orange
    primaryHover: '#ff1744', // Dark Red
    primaryLight: '#ff8a65', // Light Orange
    bgLight: '#f9fafb',
    cardBg: '#ffffff',
    textPrimary: '#1f2937',
    textSecondary: '#6b7280',
    borderColor: '#e5e7eb',
    errorRed: '#ff5252', // Vivid Red
};

const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        minHeight: '100vh',
        backgroundColor: COLORS.bgLight,
        padding: '20px',
        boxSizing: 'border-box',
    },
    card: {
        background: COLORS.cardBg,
        padding: '48px 32px',
        borderRadius: '16px',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        width: '100%',
        maxWidth: '400px',
        textAlign: 'center',
        borderTop: `4px solid ${COLORS.primary}`,
        fontFamily: 'Inter, system-ui, sans-serif',
    },
    header: {
        marginBottom: '32px',
    },
    logoImage: {
        width: '80px',
        height: '80px',
        margin: '0 auto 16px auto',
        objectFit: 'contain',
        display: 'block',
        opacity: 1,
    },
    title: {
        fontSize: '28px',
        fontWeight: '800',
        marginBottom: '4px',
        color: COLORS.textPrimary,
    },
    subtitle: {
        fontSize: '14px',
        color: COLORS.textSecondary,
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
    },
    inputGroup: {
        textAlign: 'left',
    },
    label: {
        display: 'block',
        fontSize: '13px',
        fontWeight: '600',
        marginBottom: '8px',
        color: COLORS.textPrimary,
    },
    input: {
        width: '100%',
        padding: '12px',
        border: `1px solid ${COLORS.borderColor}`,
        borderRadius: '8px',
        fontSize: '16px',
        boxSizing: 'border-box',
        color: COLORS.textPrimary,
        transition: 'border-color 0.2s, box-shadow 0.2s',
    },
    inputFocus: {
        borderColor: COLORS.primary,
        boxShadow: `0 0 0 3px ${COLORS.primary}33`, // 33 adalah alpha 20%
        outline: 'none',
    },
    forgotPassword: {
        textAlign: 'right',
        marginTop: '-8px',
    },
    forgotLink: {
        color: COLORS.primary,
        fontSize: '14px',
        fontWeight: '600',
        textDecoration: 'none',
        transition: 'color 0.2s',
    },
    button: {
        width: '100%',
        padding: '14px',
        marginTop: '16px',
        border: 'none',
        borderRadius: '8px',
        color: 'white',
        backgroundColor: COLORS.primary,
        fontSize: '16px',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'background-color 0.2s, box-shadow 0.2s, transform 0.2s',
        boxShadow: `0 4px 6px -1px ${COLORS.primary}33, 0 2px 4px -2px ${COLORS.primary}1A`,
    },
    buttonHover: {
        backgroundColor: COLORS.primaryHover,
        transform: 'translateY(-1px)',
        boxShadow: `0 10px 15px -3px ${COLORS.primaryHover}4D`,
    },
    buttonDisabled: {
        backgroundColor: COLORS.primaryLight,
        opacity: 0.8,
        cursor: 'not-allowed',
    },
    errorMessage: {
        color: COLORS.errorRed,
        backgroundColor: '#ffebee',
        padding: '10px',
        borderRadius: '6px',
        fontSize: '13px',
        marginTop: '10px',
        marginBottom: '10px',
        fontWeight: '500',
    },
    footerText: {
        textAlign: 'center',
        fontSize: '12px',
        color: COLORS.textSecondary,
        marginTop: '24px',
    }
};

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // State untuk menangani gaya fokus
    const [isUsernameFocused, setIsUsernameFocused] = useState(false);
    const [isPasswordFocused, setIsPasswordFocused] = useState(false);

    // Pastikan base URL ini diperbarui sesuai lingkungan production/development Anda
    const API_BASE_URL = 'http://localhost:5000/api/auth/login';

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await axios.post(API_BASE_URL, {
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

    // Fungsi untuk menggabungkan gaya, termasuk gaya hover/disabled/focus
    const getButtonStyle = () => {
        let style = styles.button;
        if (loading) {
            style = { ...style, ...styles.buttonDisabled };
        } else {
            // Karena tidak ada pseudo-class :hover di JSX style, kita mengandalkan event listener
            // Namun, untuk kesederhanaan, kita hanya menggunakan gaya statis untuk disabled/enabled
        }
        return style;
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <div style={styles.header}>
                    <img 
                        src="/logo.svg" 
                        alt="Mimdi Invitation Logo" 
                        style={styles.logoImage} 
                    />
                    
                    <h1 style={styles.title}>Mimdi Invitation</h1>
                    <p style={styles.subtitle}>Masuk untuk mengakses dasbor admin Anda.</p>
                </div>
                <form style={styles.form} onSubmit={handleLogin}>
                    {/* Username Input */}
                    <div style={styles.inputGroup}>
                        <label htmlFor="username" style={styles.label}>Username</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="e.g., admin.mimdi"
                            autoComplete="username"
                            disabled={loading}
                            style={isUsernameFocused ? {...styles.input, ...styles.inputFocus} : styles.input}
                            onFocus={() => setIsUsernameFocused(true)}
                            onBlur={() => setIsUsernameFocused(false)}
                        />
                    </div>

                    {/* Password Input */}
                    <div style={styles.inputGroup}>
                        <label htmlFor="password" style={styles.label}>Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="********"
                            autoComplete="current-password"
                            disabled={loading}
                            style={isPasswordFocused ? {...styles.input, ...styles.inputFocus} : styles.input}
                            onFocus={() => setIsPasswordFocused(true)}
                            onBlur={() => setIsPasswordFocused(false)}
                        />
                    </div>
                    
                    {/* TAUTAN LUPA PASSWORD */}
                    <div style={styles.forgotPassword}>
                        <a 
                            href="#" 
                            onClick={(e) => { e.preventDefault(); console.log('Lupa Password clicked'); }} 
                            tabIndex={loading ? -1 : 0}
                            style={styles.forgotLink}
                            onMouseEnter={(e) => e.currentTarget.style.color = COLORS.primaryHover}
                            onMouseLeave={(e) => e.currentTarget.style.color = COLORS.primary}
                        >
                            Lupa Password?
                        </a>
                    </div>
                    
                    {/* Error Message */}
                    {error && <p style={styles.errorMessage}>{error}</p>}
                    
                    {/* Tombol Login */}
                    <button 
                        type="submit" 
                        style={getButtonStyle()} 
                        disabled={loading}
                        onMouseEnter={(e) => {
                            if (!loading) {
                                e.currentTarget.style.backgroundColor = COLORS.primaryHover;
                                e.currentTarget.style.transform = 'translateY(-1px)';
                                e.currentTarget.style.boxShadow = `0 10px 15px -3px ${COLORS.primaryHover}4D`;
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (!loading) {
                                e.currentTarget.style.backgroundColor = COLORS.primary;
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = styles.button.boxShadow;
                            }
                        }}
                    >
                        {loading ? 'Memproses...' : 'Login ke Dasbor'}
                    </button>
                    
                    <p style={styles.footerText}>
                        &copy; 2024 Mimdi Invitation.
                    </p>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
