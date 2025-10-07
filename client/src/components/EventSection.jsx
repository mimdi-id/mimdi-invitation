import React from 'react';

// Komponen ini akan mengelola seluruh bagian "Data Acara"
const EventSection = ({ events, onUpdate }) => {

    const handleAddEvent = () => {
        // Tambahkan objek acara baru yang kosong ke dalam array
        const newEvent = {
            title: '',
            event_datetime: '',
            venue_name: '',
            address: '',
            google_maps_url: ''
        };
        onUpdate([...events, newEvent]);
    };

    const handleRemoveEvent = (indexToRemove) => {
        // Hapus acara dari array berdasarkan posisinya (index)
        onUpdate(events.filter((_, index) => index !== indexToRemove));
    };

    const handleEventChange = (indexToUpdate, fieldName, value) => {
        // Perbarui data acara tertentu di dalam array
        const updatedEvents = events.map((event, index) => {
            if (index === indexToUpdate) {
                return { ...event, [fieldName]: value };
            }
            return event;
        });
        onUpdate(updatedEvents);
    };

    return (
        <div className="event-section">
            {events.map((event, index) => (
                <div key={index} className="card event-card">
                    <div className="event-card-header">
                        <h3>Acara #{index + 1}</h3>
                        <button onClick={() => handleRemoveEvent(index)} className="remove-button">&times; Hapus Acara</button>
                    </div>
                    <EventForm 
                        event={event} 
                        onUpdate={(fieldName, value) => handleEventChange(index, fieldName, value)} 
                    />
                </div>
            ))}
            <button onClick={handleAddEvent} className="add-event-button">
                + Tambah Acara Baru
            </button>
        </div>
    );
};


// Komponen Form untuk satu acara
const EventForm = ({ event, onUpdate }) => {
    const handleChange = (e) => {
        const { name, value } = e.target;
        onUpdate(name, value);
    };

    // Format tanggal untuk input datetime-local
    const formatDateTimeForInput = (dateString) => {
        if (!dateString) return '';
        try {
            const date = new Date(dateString);
            // Cek jika tanggal valid sebelum memproses
            if (isNaN(date.getTime())) return '';
            // Mengatasi masalah timezone offset agar waktu lokal benar
            date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
            return date.toISOString().slice(0, 16);
        } catch (error) {
            return '';
        }
    };

    return (
        <div className="form-grid">
            <div className="form-group">
                <label>Judul Acara</label>
                <input type="text" name="title" value={event.title || ''} onChange={handleChange} placeholder="Contoh: Akad Nikah" />
            </div>
            <div className="form-group">
                <label>Tanggal & Waktu</label>
                <input type="datetime-local" name="event_datetime" value={formatDateTimeForInput(event.event_datetime)} onChange={handleChange} />
            </div>
            <div className="form-group" style={{gridColumn: '1 / -1'}}>
                <label>Nama Tempat / Gedung</label>
                <input type="text" name="venue_name" value={event.venue_name || ''} onChange={handleChange} placeholder="Contoh: Gedung Serbaguna ABC" />
            </div>
            <div className="form-group" style={{gridColumn: '1 / -1'}}>
                <label>Alamat Lengkap</label>
                <textarea name="address" value={event.address || ''} onChange={handleChange} rows="3"></textarea>
            </div>
            <div className="form-group" style={{gridColumn: '1 / -1'}}>
                <label>URL Google Maps</label>
                <input type="text" name="google_maps_url" value={event.google_maps_url || ''} onChange={handleChange} />
            </div>
        </div>
    );
};

// INI BAGIAN YANG HILANG DAN PENYEBAB ERROR:
export default EventSection;

