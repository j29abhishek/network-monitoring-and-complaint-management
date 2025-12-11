import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import "../css/admindashboard.css";
import BackButton from "../components/BackButton";
import { useNavigate } from "react-router-dom";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [filter, setFilter] = useState("unread");
  const previousCountRef = useRef(0);
  const userType = localStorage.getItem("userType"); // "admin" or "user"

  const navigate = useNavigate();
  useEffect(() => {
    fetchNotifications();
    checkUnreadCount();

    const interval = setInterval(checkUnreadCount, 30000);
    return () => clearInterval(interval);
  }, []);

  const checkUnreadCount = async () => {
    try {
      const countRes = await axios.get(
        `http://localhost:2001/unread-notification-count?forRole=${userType}`
      );
      const newCount = countRes.data.count;

      if (newCount > previousCountRef.current) {
        fetchNotifications();
      }

      setUnreadCount(newCount);
      previousCountRef.current = newCount;
    } catch (err) {
      console.error("Error checking unread count:", err);
    }
  };

  const fetchNotifications = async () => {
    try {
      const res = await axios.get(
        `http://localhost:2001/get-notifications?forRole=${userType}`
      );
      setNotifications(res.data);
    } catch (err) {
      console.error("Error fetching notifications", err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await axios.patch(
        `http://localhost:2001/mark-all-read?forRole=${userType}`
      );
      fetchNotifications();
    } catch (err) {
      console.error("Error marking all as read", err);
    }
  };

  const markSingleAsRead = async (id) => {
    try {
      await axios.patch(`http://localhost:2001/mark-read/${id}`);
      fetchNotifications();
    } catch (err) {
      console.error("Error marking as read", err);
    }
  };

  const filtered = notifications.filter((n) => {
    if (filter === "all") return true;
    if (filter === "read") return n.isRead;
    if (filter === "unread") return !n.isRead;
    return true;
  });

  return (
    <div className="notifications-table-container">
      <div className="notifications-header">
        <button
          className="back-to-dashboard"
          onClick={() => {
            navigate(-1);
          }}
        >
          Back
        </button>
        <div>
          <div className="notification-count">
            {unreadCount > 9 ? "9+" : unreadCount ?? 0} 
          </div> 
          <h2 className="notifications-title">Notifications</h2>
          <p className="notifications-subtext">
            Manage and respond to system updates.
          </p>
        </div>
        <div className="notifications-actions">
          <button
            onClick={() => setFilter("all")}
            className={filter === "all" ? "active-filter" : "nfilter-button"}
          >
            All
          </button>
          <button
            onClick={() => setFilter("read")}
            className={filter === "read" ? "active-filter" : ""}
          >
            Read
          </button>
          <button
            onClick={() => setFilter("unread")}
            className={filter === "unread" ? "active-filter" : ""}
          >
            Unread
          </button>
          <button onClick={markAllAsRead} className="mark-read-btn">
            Mark all read
          </button>
        </div>
      </div>

      <div className="notifications-table-wrapper">
        <table className="notifications-table">
          <colgroup>
            <col className="col-notification-type" />
            <col className="col-message" />
            <col className="col-status" />
            <col className="col-nfs-date" />
            <col className="col-action-nfs" />
          </colgroup>
          <thead>
            <tr>
              <th>S. No.</th>
              <th>Message</th>
              <th>Status</th>
              <th>Time</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="5" className="no-notifications">
                  No {filter} notifications found.
                </td>
              </tr>
            ) : (
              filtered.map((item, index) => (
                <tr key={item._id} className={item.isRead ? "read" : "unread"}>
                  <td>{index + 1}</td>
                  <td>{item.message}</td>
                  <td>
                    {item.isRead ? (
                      ""
                    ) : (
                      <button className="new-notification">New</button>
                    )}
                  </td>
                  <td>{new Date(item.createdAt).toLocaleString()}</td>
                  <td>
                    {!item.isRead && (
                      <button
                        className="mark-single-btn"
                        onClick={() => markSingleAsRead(item._id)}
                      >
                        Mark as read
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Notifications;
