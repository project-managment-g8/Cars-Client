// client/src/components/eventForm.jsx
import React, { useState } from 'react';
import '../assets/style/form.css';
const EventForm = ({ addEvent }) => {
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    date: '',
    img: null,
  });

  const handleEventChange = (e) => {
    setNewEvent({ ...newEvent, [e.target.name]: e.target.value });
  };

  const handleFileUpload = (e) => {
    setNewEvent({ ...newEvent, img: e.target.files[0] });
  };

  const submitEvent = (e) => {
    e.preventDefault();
    addEvent(newEvent);
    setNewEvent({
      title: '',
      description: '',
      date: '',
      img: null,
    });
  };

  return (
    <div className="form-container">
      <input
        type="text"
        name="title"
        value={newEvent.title}
        onChange={handleEventChange}
        placeholder="Event Title"
      />
      <textarea
        name="description"
        value={newEvent.description}
        onChange={handleEventChange}
        placeholder="Event Description"
      />
      <input
        type="date"
        name="date"
        value={newEvent.date}
        onChange={handleEventChange}
      />
      <input type="file" onChange={handleFileUpload} />
      <button onClick={submitEvent}>Add Event</button>
    </div>
  );
};

export default EventForm;