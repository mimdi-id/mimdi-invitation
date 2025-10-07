// File: client/src/components/SocialIcon.jsx
import React from 'react';

const SocialIcon = ({ type, username }) => {
    if (!username) return null;
    const baseUrl = `https://www.${type}.com/`;
    // Gunakan styling inline sederhana atau buat file CSS terpisah jika perlu
    const styles = {
        display: 'inline-block', padding: '0.3rem 0.8rem', borderRadius: '50px',
        textDecoration: 'none', fontSize: '0.8rem', color: 'white', fontWeight: '500',
        textTransform: 'capitalize',
        backgroundColor: type === 'instagram' ? '#E1306C' : '#000000'
    };
    return <a href={`${baseUrl}${username}`} style={styles} target="_blank" rel="noopener noreferrer">{type}</a>;
};

export default SocialIcon;

