import React from 'react';

const MempelaiForm = ({ mempelai, onUpdate }) => {
    const handleChange = (e) => {
        const { name, value } = e.target;
        onUpdate({ ...mempelai, [name]: value });
    };

    return (
        <div className="form-section card">
            <h2>Data Mempelai {mempelai.type}</h2>
            <div className="form-grid">
                <div className="form-group">
                    <label>Nama Lengkap</label>
                    <input type="text" name="full_name" value={mempelai.full_name || ''} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label>Nama Panggilan</label>
                    <input type="text" name="nickname" value={mempelai.nickname || ''} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label>Putra/Putri Ke-</label>
                    <input type="text" name="child_order" value={mempelai.child_order || ''} onChange={handleChange} placeholder="Contoh: Putra Pertama" />
                </div>
                <div className="form-group">
                    <label>Nama Orang Tua</label>
                    <input type="text" name="parents_name" value={mempelai.parents_name || ''} onChange={handleChange} placeholder="Contoh: Bapak John & Ibu Jane" />
                </div>
            </div>
        </div>
    );
};

export default MempelaiForm;
