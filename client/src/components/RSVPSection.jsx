import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './RSVPSection.css'; // tambahkan file CSS terpisah

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
      setFormData({ guest_name: '', attendance_status: 'Hadir', message: '' });
      fetchRsvps();
    } catch (err) {
      setError(err.response?.data?.error || "Gagal mengirim ucapan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="rsvp-section-modern">
      <div className="rsvp-container-modern">
        {/* Form RSVP */}
        <div className="rsvp-form-modern">
          <h2 className="rsvp-title">Konfirmasi Kehadiran</h2>
          <form onSubmit={handleSubmit}>
            <label>Nama Anda</label>
            <input
              type="text"
              name="guest_name"
              value={formData.guest_name}
              onChange={handleInputChange}
              disabled={loading}
            />

            <label>Status Kehadiran</label>
            <select
              name="attendance_status"
              value={formData.attendance_status}
              onChange={handleInputChange}
              disabled={loading}
            >
              <option value="Hadir">Hadir</option>
              <option value="Ragu-ragu">Ragu-ragu</option>
              <option value="Tidak Hadir">Tidak Hadir</option>
            </select>

            <label>Ucapan & Doa</label>
            <textarea
              name="message"
              rows="4"
              value={formData.message}
              onChange={handleInputChange}
              disabled={loading}
            ></textarea>

            <button type="submit" disabled={loading}>
              {loading ? 'Mengirim...' : 'Kirim'}
            </button>

            {error && <p className="error-text">{error}</p>}
            {success && <p className="success-text">{success}</p>}
          </form>
        </div>

        {/* Buku Tamu */}
        <div className="guestbook-modern">
          <h3>Buku Tamu ({rsvps.length} Ucapan)</h3>
          <div className="guestbook-cards">
  {rsvps.length > 0 ? (
    rsvps.map((rsvp, index) => (
      <div
        key={rsvp.id}
        className={`guest-card ${
          rsvp.attendance_status === 'Hadir'
            ? 'hadir'
            : rsvp.attendance_status === 'Ragu-ragu'
            ? 'ragu'
            : 'tidak-hadir'
        }`}
      >
        <div className="guest-header">
          <strong className="guest-name">{rsvp.guest_name}</strong>
          <span
            className={`status ${
              rsvp.attendance_status.toLowerCase().replace(' ', '-')
            }`}
          >
            {rsvp.attendance_status}
          </span>
        </div>
        {rsvp.message ? (
          <p className="guest-message">💬 {rsvp.message}</p>
        ) : (
          <p className="guest-message muted">-</p>
        )}
      </div>
    ))
  ) : (
    <p className="no-guest">Belum ada ucapan 😄</p>
  )}
</div>

        </div>
      </div>
    </section>
  );
};

export default RSVPSection;
