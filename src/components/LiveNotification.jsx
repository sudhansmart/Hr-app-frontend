import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import '../styles/liveNotification.css';

// Initialize socket only once
// const socket = io("http://103.38.50.152/nodejs");

function LiveNotification() {
  const [notifications, setNotifications] = useState([]);

  // useEffect(() => {
  //   // Load notifications from local storage when the component mounts
  //   const storedNotifications = JSON.parse(localStorage.getItem('notifications')) || [];
  //   setNotifications(storedNotifications);

  //   // Receive all notifications when the component mounts
  //   socket.on("load_notifications", (data) => {
  //     setNotifications(data);
  //     localStorage.setItem('notifications', JSON.stringify(data));
  //   });

  //   // Listen for new notifications
  //   socket.on("receive_notification", (notification) => {
  //     setNotifications((prevNotifications) => {
  //       const updatedNotifications = [...prevNotifications, notification];
  //       localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
  //       return updatedNotifications;
  //     });
  //   });

  //   // Clean up the socket connection on unmount
  //   return () => {
  //     socket.off("load_notifications");
  //     socket.off("receive_notification");
  //   };
  // }, []);

  const markAsRead = (id) => {
    setNotifications((prevNotifications) => {
      const updatedNotifications = prevNotifications.map((notif) =>
        notif.id === id ? { ...notif, read: true } : notif
      );
      localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
      return updatedNotifications;
    });
  };

  // Sort notifications by time descending
  const sortedNotifications = notifications.sort((a, b) => new Date(b.time) - new Date(a.time));

  return (
    <div className="live-notification-main">
      <h5>Live Notification</h5>
      {sortedNotifications.map((notification) => (
        <div
          key={notification.id}
          onClick={() => markAsRead(notification.id)}
          className="notification-item"
          style={{
            padding: "10px",
            marginBottom: "5px",
            backgroundColor: notification.read ? "#e0e0e0" : "#f0f8ff",
            cursor: "pointer",
            border: "1px solid #ddd",
          }}
        >
          <strong>{notification.message}</strong>
          <p style={{ fontSize: "12px" }}>
            Time: {new Date(notification.time).toLocaleTimeString()}
          </p>
          <p style={{ fontSize: "12px", color: notification.read ? "green" : "red" }}>
            {notification.read ? "Read" : "New"}
          </p>
        </div>
      ))}
    </div>
  );
}

export default LiveNotification;
