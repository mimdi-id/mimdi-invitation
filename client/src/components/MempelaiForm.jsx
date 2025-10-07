import React from 'react';

const MempelaiForm = ({ mempelai, onUpdate, type }) => {
    
    // Handler untuk input biasa (teks)
    const handleChange = (e) => {
        const { name, value } = e.target;
        onUpdate({ ...mempelai, [name]: value });
    };

    // Handler khusus untuk input JSON (media sosial & hadiah)
    const handleJsonChange = (group, field, value) => {
        onUpdate({
            ...mempelai,
            [group]: {
                ...mempelai[group],
                [field]: value
            }
        });
    };

    return (
        <div className="form-section card">
            <h2>Data Mempelai {type}</h2>
            <div className="form-grid">
                <div className="form-group"><label>Nama Lengkap</label><input type="text" name="full_name" value={mempelai.full_name || ''} onChange={handleChange} /></div>
                <div className="form-group"><label>Nama Panggilan</label><input type="text" name="nickname" value={mempelai.nickname || ''} onChange={handleChange} /></div>
                <div className="form-group"><label>Inisial (Contoh: A&B)</label><input type="text" name="initials" value={mempelai.initials || ''} onChange={handleChange} /></div>
                <div className="form-group"><label>Putra/Putri Ke-</label><input type="text" name="child_order" value={mempelai.child_order || ''} onChange={handleChange} /></div>
                <div className="form-group" style={{gridColumn: '1 / -1'}}><label>Nama Orang Tua</label><input type="text" name="parents_name" value={mempelai.parents_name || ''} onChange={handleChange} /></div>
            </div>

            <h3 className="sub-heading">Media Sosial</h3>
            <div className="form-grid">
                <div className="form-group"><label>Instagram</label><input type="text" value={mempelai.social_media_urls?.instagram || ''} onChange={(e) => handleJsonChange('social_media_urls', 'instagram', e.target.value)} placeholder="Username saja" /></div>
                <div className="form-group"><label>TikTok</label><input type="text" value={mempelai.social_media_urls?.tiktok || ''} onChange={(e) => handleJsonChange('social_media_urls', 'tiktok', e.target.value)} placeholder="Username saja" /></div>
            </div>
            
            <h3 className="sub-heading">Info Hadiah (Opsional)</h3>
            <div className="form-grid">
                <div className="form-group"><label>Nama Bank / E-money</label><input type="text" value={mempelai.gift_info?.bank_name || ''} onChange={(e) => handleJsonChange('gift_info', 'bank_name', e.target.value)} placeholder="Contoh: BCA / GoPay" /></div>
                <div className="form-group"><label>Nomor Rekening / No. HP</label><input type="text" value={mempelai.gift_info?.account_number || ''} onChange={(e) => handleJsonChange('gift_info', 'account_number', e.target.value)} /></div>
                <div className="form-group" style={{gridColumn: '1 / -1'}}><label>Atas Nama</label><input type="text" value={mempelai.gift_info?.account_name || ''} onChange={(e) => handleJsonChange('gift_info', 'account_name', e.target.value)} /></div>
            </div>
        </div>
    );
};

export default MempelaiForm;

