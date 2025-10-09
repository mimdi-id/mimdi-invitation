// File: client/src/components/SocialIcon.jsx
import React from 'react';
import { FaInstagram, FaTiktok, FaFacebookF } from 'react-icons/fa';

const SocialIcon = ({ type, username }) => {
  if (!username) return null;

  const baseUrls = {
    instagram: 'https://www.instagram.com/',
    tiktok: 'https://www.tiktok.com/@',
    facebook: 'https://www.facebook.com/',
  };

  const icons = {
    instagram: <FaInstagram />,
    tiktok: <FaTiktok />,
    facebook: <FaFacebookF />,
  };

  const colors = {
    instagram: '#E1306C',
    tiktok: '#000000',
    facebook: '#1877F2',
  };

  const styles = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    backgroundColor: colors[type] || '#333',
    color: 'white',
    textDecoration: 'none',
    fontSize: '18px',
    margin: '0 5px',
    transition: 'transform 0.2s ease, opacity 0.2s ease',
  };

  return (
    <a
      href={`${baseUrls[type]}${username}`}
      style={styles}
      target="_blank"
      rel="noopener noreferrer"
      title={type.charAt(0).toUpperCase() + type.slice(1)}
      onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
      onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1.0)')}
    >
      {icons[type]}
    </a>
  );
};

export default SocialIcon;
