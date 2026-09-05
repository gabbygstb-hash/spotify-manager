import React, { useState } from 'react';

export default function App() {
  const [tracks, setTracks] = useState([]);

  const [formData, setFormData] = useState({
    title: '',
    genre: 'Pop',
    artist: '',
    rating: '',
    label: '',
    role: 'Creator',
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    let tempErrors = {};

    if (!formData.title.trim() || formData.title.length < 3) {
      tempErrors.title = 'Title must be at least 3 chars';
    }
    if (!formData.artist.trim()) {
      tempErrors.artist = 'Artist required';
    }
    const numRating = Number(formData.rating);
    if (!formData.rating || isNaN(numRating) || numRating < 1 || numRating > 100) {
      tempErrors.rating = 'Must be 1-100';
    }
    if (!formData.label.trim()) {
      tempErrors.label = 'Label required';
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const newTrack = { id: Date.now(), ...formData, rating: Number(formData.rating) };
    setTracks((prev) => [...prev, newTrack]);

    setFormData({
      title: '',
      genre: 'Pop',
      artist: '',
      rating: '',
      label: '',
      role: 'Creator',
    });
    setErrors({});
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '500px' }}>
      <h2>Spotify Track Form</h2>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '10px' }}>
          <label>Track Title: </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
          />
          {errors.title && <span style={{ color: 'red', fontSize: '12px', display: 'block' }}>{errors.title}</span>}
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label>Genre: </label>
          <select name="genre" value={formData.genre} onChange={handleChange}>
            <option value="Pop">Pop</option>
            <option value="Rock">Rock</option>
            <option value="Indie">Indie</option>
            <option value="Jazz">Jazz</option>
          </select>
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label>Artist Name: </label>
          <input
            type="text"
            name="artist"
            value={formData.artist}
            onChange={handleChange}
          />
          {errors.artist && <span style={{ color: 'red', fontSize: '12px', display: 'block' }}>{errors.artist}</span>}
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label>Rating/BPM (1-100): </label>
          <input
            type="number"
            name="rating"
            value={formData.rating}
            onChange={handleChange}
          />
          {errors.rating && <span style={{ color: 'red', fontSize: '12px', display: 'block' }}>{errors.rating}</span>}
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label>Record Label: </label>
          <input
            type="text"
            name="label"
            value={formData.label}
            onChange={handleChange}
          />
          {errors.label && <span style={{ color: 'red', fontSize: '12px', display: 'block' }}>{errors.label}</span>}
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label>User Role: </label>
          <label>
            <input
              type="radio"
              name="role"
              value="Creator"
              checked={formData.role === 'Creator'}
              onChange={handleChange}
            />
            Creator
          </label>
          <label>
            <input
              type="radio"
              name="role"
              value="Listener"
              checked={formData.role === 'Listener'}
              onChange={handleChange}
            />
            Listener
          </label>
        </div>

        <button type="submit">Submit</button>
      </form>

      <hr />

      <h3>Submitted Tracks ({tracks.length})</h3>
      <ul>
        {tracks.map((t) => (
          <li key={t.id}>
            {t.title} - {t.artist} ({t.genre}) | BPM: {t.rating} | Label: {t.label} | Role: {t.role}
          </li>
        ))}
      </ul>
    </div>
  );
}