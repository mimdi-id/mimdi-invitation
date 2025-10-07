import React, { useState } from 'react';

const MediaSection = ({ invitation, onUpdate, onGalleryUpdate }) => {
    const serverUrl = 'http://localhost:5000';
    
    const initialCover = invitation.cover_image_url ? `${serverUrl}${invitation.cover_image_url}` : null;
    const initialGallery = invitation.galleryPhotos?.map(p => `${serverUrl}${p.image_url}`) || [];

    const [coverPreview, setCoverPreview] = useState(initialCover);
    const [galleryPreviews, setGalleryPreviews] = useState(initialGallery);

    const handleCoverFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            onUpdate('cover_image_file', file);
            setCoverPreview(URL.createObjectURL(file));
        }
    };
    
    const handleGalleryFilesChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
            onGalleryUpdate(files);
            const newPreviews = files.map(file => URL.createObjectURL(file));
            setGalleryPreviews(newPreviews);
        }
    };

    const handleTextChange = (e) => {
        const { name, value } = e.target;
        onUpdate(name, value);
    };

    return (
        <div className="card media-section">
            <h2>Galeri & Media</h2>
            <div className="form-grid" style={{ gridTemplateColumns: '1fr' }}>
                <div className="form-group">
                    <label>Gambar Sampul (Cover)</label>
                    <input type="file" accept="image/*" onChange={handleCoverFileChange} />
                    {coverPreview && (
                        <div className="image-preview">
                            <img src={coverPreview} alt="Preview Sampul" />
                        </div>
                    )}
                </div>

                <div className="form-group">
                    <label>Foto Galeri (Maksimal 10 Foto)</label>
                    <input type="file" accept="image/*" multiple onChange={handleGalleryFilesChange} />
                    <div className="gallery-preview-grid">
                        {galleryPreviews.map((src, index) => (
                            <div key={index} className="gallery-preview-item">
                                <img src={src} alt={`Preview Galeri ${index + 1}`} />
                            </div>
                        ))}
                    </div>
                </div>
                
                <div className="form-group">
                    <label>URL Musik Latar (YouTube)</label>
                    <input type="text" name="music_url" value={invitation.music_url || ''} 
                           onChange={handleTextChange} placeholder="Contoh: https://www.youtube.com/watch?v=..." />
                </div>
                <div className="form-group">
                    <label>URL Video Pre-wedding (YouTube)</label>
                    <input type="text" name="video_url" value={invitation.video_url || ''}
                           onChange={handleTextChange} placeholder="Contoh: https://www.youtube.com/watch?v=..." />
                </div>
            </div>
        </div>
    );
};

export default MediaSection;

