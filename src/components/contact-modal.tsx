import React from 'react';
import '../css/contact-modal.css';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <span className="title">Contact Me</span>
          <span className="close-button" onClick={onClose}>x</span>
        </div>
        <div className="modal-content">
          <p>Email: jakkrapan.art@gmail.com</p>
          <p>Phone: 086-750-1802</p>
        </div>
      </div>
    </div>
  );
};

export default ContactModal;
