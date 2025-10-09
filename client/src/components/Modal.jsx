import React from 'react';
import '/src/components/Modal.css'; // FIX: Menggunakan path absolut untuk impor CSS

// FIX: Tombol konfirmasi sekarang hanya memanggil onConfirm, membuatnya lebih fleksibel
const Modal = ({ isOpen, onClose, onConfirm, title, children, confirmText }) => {
    if (!isOpen) {
        return null;
    }

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h3 className="modal-title">{title}</h3>
                    <button onClick={onClose} className="modal-close-button">&times;</button>
                </div>
                <div className="modal-body">
                    {children}
                </div>
                <div className="modal-footer">
                    <button onClick={onClose} className="button-secondary">
                        Batal
                    </button>
                    {/* FIX: Tombol ini sekarang secara eksklusif memanggil prop onConfirm */}
                    <button onClick={onConfirm} className="button-primary">
                        {confirmText || 'Konfirmasi'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Modal;

