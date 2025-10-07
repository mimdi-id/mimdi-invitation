import React from 'react';

// Komponen ini akan mengelola seluruh bagian "Cerita Cinta"
const LoveStorySection = ({ stories, onUpdate }) => {

    const handleAddStory = () => {
        const newStory = { title: '', story: '' };
        onUpdate([...stories, newStory]);
    };

    const handleRemoveStory = (indexToRemove) => {
        onUpdate(stories.filter((_, index) => index !== indexToRemove));
    };

    const handleStoryChange = (indexToUpdate, fieldName, value) => {
        const updatedStories = stories.map((story, index) => {
            if (index === indexToUpdate) {
                return { ...story, [fieldName]: value };
            }
            return story;
        });
        onUpdate(updatedStories);
    };

    return (
        <div className="story-section">
            {stories.map((story, index) => (
                <div key={index} className="card story-card">
                    <div className="story-card-header">
                        <h3>Cerita #{index + 1}</h3>
                        <button onClick={() => handleRemoveStory(index)} className="remove-button">&times; Hapus Cerita</button>
                    </div>
                    <div className="form-group">
                        <label>Judul Cerita</label>
                        <input 
                            type="text" 
                            value={story.title || ''} 
                            onChange={(e) => handleStoryChange(index, 'title', e.target.value)} 
                            placeholder="Contoh: Awal Bertemu"
                        />
                    </div>
                    <div className="form-group">
                        <label>Isi Cerita</label>
                        <textarea 
                            value={story.story || ''} 
                            onChange={(e) => handleStoryChange(index, 'story', e.target.value)} 
                            rows="5"
                        ></textarea>
                    </div>
                </div>
            ))}
            <button onClick={handleAddStory} className="add-event-button">
                + Tambah Cerita Baru
            </button>
        </div>
    );
};

// Pastikan komponen diekspor dengan benar
export default LoveStorySection;

