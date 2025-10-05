import React from 'react';
import './Modal.css';

const Modal = ({ isOpen, onClose, onConfirm, title, children }) => {
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
                    <button onClick={onConfirm} className="button-danger">
                        Konfirmasi
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Modal;
