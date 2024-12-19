import React, { useContext, useRef, useState, useEffect } from "react";
import axios from "axios";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";

const VITE_BACKEND_URI = import.meta.env.VITE_BACKEND_URI;

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
  const { notifications, setNotifications } = useContext(AppContext);
  const [showAll, setShowAll] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasLoaded, setHasLoaded] = useState(false);

  // Tham chiếu tới dropdown
  const dropdownRefs = useRef({});

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Đóng menu khi click bên ngoài
      const isOutsideClick = Object.values(dropdownRefs.current).every(ref => ref && !ref.contains(event.target));
      if (isOutsideClick) {
        setActiveMenu(null);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      setHasLoaded(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const sortedNotifications = notifications.sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  const displayedNotifications = showAll
    ? sortedNotifications
    : sortedNotifications.slice(0, 10);

  const toggleMenu = (id) => {
    setActiveMenu((prevMenu) => (prevMenu === id ? null : id));
  };

  const handleNotificationClick = async (id) => {
    try {
      const response = await axios.put(
        `${VITE_BACKEND_URI}/notification/read/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.status === 200) {
        const updatedNotifications = notifications.map((notification) =>
          notification._id === id
            ? { ...notification, isRead: true }
            : notification
        );
        setNotifications(updatedNotifications);
        setActiveMenu(null);
      } else {
        console.error("Failed to update notification status");
      }
    } catch (error) {
      console.error("Error updating notification status:", error);
    }
  };

  const handleDelete = async (notificationId) => {
    try {
      const response = await axios.delete(
        `${VITE_BACKEND_URI}/notification/delete/${notificationId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.status === 200) {
        const updatedNotifications = notifications.filter(
          (notification) => notification._id !== notificationId
        );
        setNotifications(updatedNotifications);
        setActiveMenu(null);
      } else {
        console.error("Failed to delete notification");
      }
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  return (
    <div className="container mx-auto p-4 cursor-pointer">
      <h1 className="text-2xl font-semibold mb-4">Thông báo của bạn</h1>

      {loading ? (
        <p className="text-center text-gray-500">Đang tải...</p>
      ) : hasLoaded && notifications.length === 0 ? (
        <p className="text-center text-gray-500">Không có thông báo nào.</p>
      ) : (
        displayedNotifications.map((notification) => (
          <div
            key={notification._id}
            className={`flex items-start border-b border-gray-300 py-2 ${
              !notification.isRead ? "bg-transparent" : ""
            }`}
          >
            <img
              src={assets.notification_icon}
              alt="Notification Icon"
              className="w-6 h-6"
            />
            <div
              className="flex-1 ml-3 cursor-pointer"
              onClick={() => handleNotificationClick(notification._id)}
            >
              <p className="font-medium mr-2">
                {notification.isRead ? (
                  notification.content
                ) : (
                  <strong>
                    {notification.content}
                  </strong>
                )}
              </p>
              <p className="text-xs text-gray-400">
                {timeAgo(notification.createdAt)}
              </p>
            </div>

            {/* 3 dots menu */}
            <div
              className="relative menu-container"
              ref={(el) => (dropdownRefs.current[notification._id] = el)}
            >
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={() => toggleMenu(notification._id)}
              >
                <span className="material-icons">
                  <i className="fa-solid fa-ellipsis hidden sm:inline"></i>
                  <i className="fa-solid fa-ellipsis-vertical sm:hidden"></i>
                </span>
              </button>

              {/* Dropdown menu */}
              {activeMenu === notification._id && (
                <div className="absolute right-0 mt-2 border border-gray-300 bg-white shadow-lg rounded-md w-48 z-10">
                  <ul className="text-sm">
                    <li
                      onClick={() => handleNotificationClick(notification._id)}
                      className="cursor-pointer hover:bg-gray-100 px-4 py-2 transition-all duration-200 rounded-md"
                    >
                      <i className="fa-solid fa-envelope-circle-check mr-2"></i>
                      Đánh dấu đã đọc
                    </li>
                    <li
                      onClick={() => handleDelete(notification._id)}
                      className="cursor-pointer hover:bg-red-100 text-red-500 px-4 py-2 transition-all duration-200 rounded-md"
                    >
                      <i className="fa-regular fa-trash-can mr-2"></i>
                      Xóa thông báo
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Notifications;
