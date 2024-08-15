import React, { useState ,useEffect} from 'react';
import axios from "axios";
import { Link } from 'react-router-dom';
import apiBaseUrl from '../constants';
const EventList = ({ events, user, editEvent, deleteEvent,showButtons = true }) => {
  const [editingEventId, setEditingEventId] = useState(null);
  const [editingEventDetails, setEditingEventDetails] = useState({
    title: '',
    description: '',
    date: '',
  });
  const [editingEventImage, setEditingEventImage] = useState(null);
  const [rsvpStatus, setRsvpStatus] = useState({});

  useEffect(() => {
    const initialRsvpStatus = {};
    events.forEach(event => {
      initialRsvpStatus[event._id] = event.rsvps.includes(user._id);
    });
    setRsvpStatus(initialRsvpStatus);
  }, [events, user]);

  const handleEditClick = (event) => {
    setEditingEventId(event._id);
    setEditingEventDetails({
      title: event.title,
      description: event.description,
      date: event.date,
    });
    setEditingEventImage(null);
  };
  const handleRsvpToggle = async (eventId) => {
    try {
      if (rsvpStatus[eventId]) {
        await axios.put(`/api/events/unrsvp/${eventId}`);
        setRsvpStatus({ ...rsvpStatus, [eventId]: false });
        alert("RSVP removed");
      } else {
        await axios.put(`/api/events/rsvp/${eventId}`);
        setRsvpStatus({ ...rsvpStatus, [eventId]: true });
        alert("RSVP successful!");
      }
    } catch (error) {
      console.error("Error toggling RSVP:", error);
      alert("Failed to update RSVP status");
    }
  };

  const handleEditChange = (e) => {
    setEditingEventDetails({
      ...editingEventDetails,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    setEditingEventImage(e.target.files[0]);
  };

  const handleEditSubmit = (event) => {
    const updatedEvent = new FormData();
    updatedEvent.append('title', editingEventDetails.title);
    updatedEvent.append('description', editingEventDetails.description);
    updatedEvent.append('date', editingEventDetails.date);
    if (editingEventImage) {
      updatedEvent.append('image', editingEventImage);
    }
    editEvent(event._id, updatedEvent);
    setEditingEventId(null);
  };

  return (
    <ul>
      {events.map((event) => (
        <li key={event._id} style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ddd', borderRadius: '8px', backgroundColor: '#fff', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}>
          <Link to={`/profile/${event.user?._id}`}>
            <strong>{event.user?.userName}</strong>
          </Link>
          {editingEventId === event._id ? (
            <>
              <input
                type="text"
                name="title"
                value={editingEventDetails.title}
                onChange={handleEditChange}
                style={{ width: '100%', padding: '10px', borderRadius: '4px', borderColor: '#ccc', marginBottom: '10px' }}
              />
              <textarea
                name="description"
                value={editingEventDetails.description}
                onChange={handleEditChange}
                style={{ width: '100%', padding: '10px', borderRadius: '4px', borderColor: '#ccc', marginBottom: '10px' }}
              />
              <input
                type="date"
                name="date"
                value={editingEventDetails.date}
                onChange={handleEditChange}
                style={{ width: '100%', padding: '10px', borderRadius: '4px', borderColor: '#ccc', marginBottom: '10px' }}
              />
              <input type="file" onChange={handleImageChange} style={{ marginBottom: '10px' }} />
              <button onClick={() => handleEditSubmit(event)} style={{ marginRight: '10px' }}>Save</button>
              <button onClick={() => setEditingEventId(null)}>Cancel</button>
            </>
          ) : (
            <>
              <h3>{event.title}</h3>
              <p>{event.description}</p>
              <p>{new Date(event.date).toLocaleDateString()}</p>
              {event.image && (
                <img
                  src={`${apiBaseUrl}/api/uploads/${event.image}`}
                  alt="Event"
                  style={{ width: '100%', maxWidth: '600px', borderRadius: '8px', marginTop: '10px' }}
                />
              )}
              <div style={{ display: 'flex', justifyContent: 'flex-start',marginTop: '10px' }}>
                <button onClick={() => handleRsvpToggle(event._id)} style={{ padding: '8px 16px', borderRadius: '5px' }}>
                  {rsvpStatus[event._id] ? "Remove RSVP" : "RSVP"}
                </button>
              </div>
              {showButtons && user && event.user && user._id === event.user._id && (
                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                  <button onClick={() => handleEditClick(event)}>Edit</button>
                  <button onClick={() => deleteEvent(event._id)}>Delete</button>
                </div>
              )}
            </>
          )}
        </li>
      ))}
    </ul>
  );
};

export default EventList;