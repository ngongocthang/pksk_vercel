import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const timeAgo = (date) => {
  const now = new Date();
  const diffInSeconds = Math.floor((now - new Date(date)) / 1000);
  const seconds = diffInSeconds;
  const minutes = Math.floor(diffInSeconds / 60);
  const hours = Math.floor(diffInSeconds / 3600);
  const days = Math.floor(diffInSeconds / (3600 * 24));

  if (days > 0) return `${days} ngày trước`;
  if (hours > 0) return `${hours} giờ trước`;
  if (minutes > 0) return `${minutes} phút trước`;
  return `${seconds} giây trước`;
};

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user, setUser, setUnreadCount } = useContext(AppContext);
  const navigate = useNavigate();

  const token = user?.token || localStorage.getItem("token");

  useEffect(() => {
    if (!user && token) {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (storedUser) setUser(storedUser);
    }

    if (!token) {
      navigate("/account");
    } else {
      const fetchNotifications = async () => {
        try {
          setLoading(true);
          const response = await fetch("http://localhost:5000/notification", {
            headers: { Authorization: `Bearer ${token}` },
          });

          if (!response.ok) throw new Error("Failed to fetch notifications");

          const data = await response.json();
          setNotifications(data);

          // Cập nhật số lượng thông báo chưa đọc vào Context
          const unreadCount = data.filter(notification => !notification.isRead).length;
          setUnreadCount(unreadCount);
          // localStorage.setItem("unreadCount", unreadCount);
        } catch (error) {
          console.error("Error fetching notifications:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchNotifications();
    }
  }, [token, navigate, setUser, user, setUnreadCount]);

  const handleNotificationClick = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/notification/read/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to mark notification as read");

      const updatedNotifications = notifications.map((notification) =>
        notification._id === id ? { ...notification, isRead: true } : notification
      );
      setNotifications(updatedNotifications);

      // Giảm số lượng thông báo chưa đọc
      setUnreadCount((prevCount) => {
        const updatedCount = prevCount - 1;
        localStorage.setItem("unreadCount", updatedCount);
        return updatedCount;
      });
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const sortedNotifications = notifications.sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  const displayedNotifications = showAll
    ? sortedNotifications
    : sortedNotifications.slice(0, 10);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">Thông báo của bạn</h1>

      {loading ? (
        <div className="text-center text-gray-500">Đang tải thông báo...</div>
      ) : notifications.length === 0 ? (
        <p className="text-center text-gray-500">Không có thông báo nào.</p>
      ) : (
        displayedNotifications.map((notification) => (
          <div
            key={notification._id}
            className={`flex items-start border-b border-gray-300 py-2 ${!notification.isRead ? "bg-gray-100" : ""
              }`}
            onClick={() => handleNotificationClick(notification._id)}
          >
            <div className="flex-1 ml-3">
              <p className="font-medium">
                {notification.isRead ? notification.content : <strong>{notification.content}</strong>}
              </p>
              <p className="text-xs text-gray-400">
                Ca khám: {notification.work_shift === "morning" ? "buổi sáng" : "buổi chiều"}
              </p>
              <p className="text-xs text-gray-400">{timeAgo(notification.createdAt)}</p>
            </div>
          </div>
        ))
      )}

      {notifications.length > 10 && (
        <div className="text-center mt-4">
          <button
            onClick={() => setShowAll(!showAll)}
            className="bg-gray-400 text-white py-2 px-4 rounded-full"
          >
            {showAll ? "Thu gọn" : "Xem tất cả"}
          </button>
        </div>
      )}
    </div>
  );
};

export default Notifications;
