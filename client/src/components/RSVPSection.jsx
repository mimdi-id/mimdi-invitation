import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const RSVPSection = ({ slug }) => {
    const [rsvps, setRsvps] = useState([]);
    const [formData, setFormData] = useState({
        guest_name: '',
        attendance_status: 'Hadir',
        message: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const fetchRsvps = useCallback(async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/rsvps/${slug}`);
            setRsvps(response.data.data || []);
        } catch (err) {
            console.error("Gagal memuat buku tamu:", err);
        }
    }, [slug]);

    useEffect(() => {
        fetchRsvps();
    }, [fetchRsvps]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        if (!formData.guest_name) {
            setError('Nama wajib diisi.');
            setLoading(false);
            return;
        }

        try {
            const response = await axios.post(`http://localhost:5000/api/rsvps/${slug}`, formData);
            setSuccess(response.data.message);
            setFormData({ guest_name: '', attendance_status: 'Hadir', message: '' }); // Reset form
            fetchRsvps(); // Muat ulang buku tamu
        } catch (err) {
            setError(err.response?.data?.error || "Gagal mengirim ucapan.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="rsvp-section">
            <div className="rsvp-container">
                {/* Form RSVP */}
                <div className="rsvp-form card">
                    <h2>Konfirmasi Kehadiran</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Nama Anda</label>
                            <input type="text" name="guest_name" value={formData.guest_name} onChange={handleInputChange} disabled={loading} />
                        </div>
                        <div className="form-group">
                            <label>Status Kehadiran</label>
                            <select name="attendance_status" value={formData.attendance_status} onChange={handleInputChange} disabled={loading}>
                                <option value="Hadir">Hadir</option>
                                <option value="Ragu-ragu">Ragu-ragu</option>
                                <option value="Tidak Hadir">Tidak Hadir</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Ucapan & Doa</label>
                            <textarea name="message" rows="4" value={formData.message} onChange={handleInputChange} disabled={loading}></textarea>
                        </div>
                        <button type="submit" className="submit-button" disabled={loading}>
                            {loading ? 'Mengirim...' : 'Kirim'}
                        </button>
                        {error && <p className="error-message">{error}</p>}
                        {success && <p className="success-message">{success}</p>}
                    </form>
                </div>

                {/* Buku Tamu */}
                <div className="guestbook">
                    <h3>Buku Tamu ({rsvps.length} Ucapan)</h3>
                    <div className="guestbook-list">
                        {rsvps.length > 0 ? (
                            rsvps.map(rsvp => (
                                <div key={rsvp.id} className="guestbook-item">
                                    <div className="item-header">
                                        <strong>{rsvp.guest_name}</strong>
                                        <span className={`status-badge status-${rsvp.attendance_status.toLowerCase().replace(' ', '-')}`}>{rsvp.attendance_status}</span>
                                    </div>
                                    <p>{rsvp.message}</p>
                                </div>
                            ))
                        ) : (
                            <p>Jadilah yang pertama memberikan ucapan!</p>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

// INI BAGIAN YANG HILANG DAN PENYEBAB ERROR:
export default RSVPSection;

