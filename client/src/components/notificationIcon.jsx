// client/src/components/notificationIcon.jsx
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { IoIosNotifications } from "react-icons/io";
import "../assets/style/NotificationIcon.css";
import apiBaseUrl from "../constants";
axios.defaults.withCredentials = true;

const NotificationIcon = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const auth = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const { data } = await axios.get(`${apiBaseUrl}/api/notification`, {
          headers: { Authorization: `Bearer ${auth.user.token}` },
        });
        setNotifications(data);
        setUnreadCount(
          data.filter((notification) => !notification.read).length
        );
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
  }, [auth.user.token]);

  const toggleNotifications = async () => {
    setShowNotifications(!showNotifications);
    if (!showNotifications) {
      await markNotificationsAsRead();
    }
  };

  const markNotificationsAsRead = async () => {
    try {
      await axios.put(
        `${apiBaseUrl}/api/notification/mark-read`,
        {},
        {
          headers: { Authorization: `Bearer ${auth.user.token}` },
        }
      );
      setUnreadCount(0);
    } catch (error) {
      console.error("Error marking notifications as read:", error);
    }
  };

  const getNotificationMessage = (notification) => {
    if (!notification.sender) {
      return "Notification";
    }
    if (notification.type === "follow") {
      return `${
        notification.sender?.userName ?? "Someone"
      } followed your profile`;
    } else {
      return `${notification.sender?.userName ?? "Someone"} ${
        notification.type
      }ed your ${notification.post ? "post" : "comment"}`;
    }
  };

  return (
    <div
      className={`notification-icon ${
        unreadCount > 0 ? "has-notifications" : ""
      }`}
      onClick={toggleNotifications}
    >
      <IoIosNotifications style={{ fontSize: "24px" }} />
      {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
      {showNotifications && (
        <div className="notification-list">
          {notifications.length === 0 ? (
            <p>No notifications</p>
          ) : (
            notifications.map((notification) => (
              <div key={notification._id} className="notification-item">
                <p>{getNotificationMessage(notification)}</p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationIcon;