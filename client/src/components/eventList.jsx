// client/src/components/eventList.jsx
import React, { useState ,useEffect} from 'react';
import axios from "axios";
import CommentList from './eventCommentList.jsx';
import CommentForm from './eventCommentForm.jsx';
import { Link } from 'react-router-dom';
import apiBaseUrl from '../constants';
const EventList = ({ events, user, setEvents,editEvent, deleteEvent,showButtons = true }) => {
  const [editingEventId, setEditingEventId] = useState(null);
  const [editingEventDetails, setEditingEventDetails] = useState({
    title: '',
    description: '',
    date: '',
  });
  const [editingEventImage, setEditingEventImage] = useState(null);
  const [rsvpStatus, setRsvpStatus] = useState({});
  const [showRSVPList, setShowRSVPList] = useState(null);
  useEffect(() => {
    if (events.length > 0 && user?._id) {
      const initialRsvpStatus = {};
  
      events.forEach(event => {
        if (event.rsvps && event.rsvps.length > 0) {
          // Check if the user's ID is included in the rsvps array
          initialRsvpStatus[event._id] = event.rsvps.some(rsvp => rsvp._id === user._id);
        } else {
          initialRsvpStatus[event._id] = false;
        }
      });
  
      setRsvpStatus(initialRsvpStatus);
      console.log("Initialized RSVP Status: ", initialRsvpStatus);
    }
  }, [events, user._id]);

  const toggleRSVPList = (eventId) => {
    setShowRSVPList(showRSVPList === eventId ? null : eventId);
  };

  const updateComments = (eventId, comments) => {
    const updatedPosts = events.map(event =>
      event._id === eventId ? { ...event, comments } : event
    );
    setEvents(updatedPosts);
  };
  const handleRsvpToggle = async (eventId) => {
    try {
      let response;
      if (rsvpStatus[eventId]) {
        // User wants to remove RSVP
        response = await axios.put(`${apiBaseUrl}/api/events/unrsvp/${eventId}`, null, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        setRsvpStatus(prevStatus => ({ ...prevStatus, [eventId]: false }));
      } else {
        // User wants to add RSVP
        response = await axios.put(`${apiBaseUrl}/api/events/rsvp/${eventId}`, null, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        setRsvpStatus(prevStatus => ({ ...prevStatus, [eventId]: true }));
      }
  
      // Make sure the response contains the updated event data
      console.log("RSVP Toggle Response: ", response.data);
  
      alert(rsvpStatus[eventId] ? "RSVP removed" : "RSVP successful!");
    } catch (error) {
      if (error.response && error.response.status === 400) {
        alert(error.response.data.message || "Failed to update RSVP status");
      } else {
        console.error("Error toggling RSVP:", error);
        alert("Failed to update RSVP status");
      }
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
                {console.log(rsvpStatus[event._id])}
                <button onClick={() => handleRsvpToggle(event._id)} style={{ padding: '8px 16px', borderRadius: '5px' }}>
                  {rsvpStatus[event._id] ? "Remove RSVP" : "RSVP"}
                </button>
              </div>
              {showButtons && user && event.user && user._id === event.user._id && (
            <div>
              <button onClick={() => toggleRSVPList(event._id)}>View RSVPs</button>
              {showRSVPList === event._id && (
                <ul>
                  {event.rsvps.map((rsvpUser) => (
                    <li key={rsvpUser._id}>{rsvpUser.userName}</li>
                  ))}
                </ul>
              )}
              <button onClick={() => editEvent(event._id)}>Edit</button>
              <button onClick={() => deleteEvent(event._id)}>Delete</button>
            </div>
          )}
              {showButtons && (
              <>
                <CommentList comments={event.comments} eventId={event._id} updateComments={updateComments} />
                <CommentForm eventId={event._id} updateComments={updateComments} />
              </>
            )}
            </>
          )}
        </li>
      ))}
    </ul>
  );
};

export default EventList;