import React, { useState, useEffect, useContext } from "react";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";

const NotificationPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [showAll, setShowAll] = useState(false); // Thêm trạng thái để điều khiển việc hiển thị tất cả thông báo
  const navigate = useNavigate();
  const { user } = useContext(AppContext);

  const token = user?.token;

  if (!token) {
    navigate("/login");
    return;
  }

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch("http://localhost:5000/notification", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error("Lấy thông báo thất bại");
        }
        const data = await response.json();
        setNotifications(data); 
      } catch (error) {
        console.error("Lỗi khi lấy thông báo:", error);
      }
    };
    fetchNotifications();
  }, [token]);

  // Nếu trạng thái showAll là true, hiển thị tất cả thông báo
  const displayedNotifications = showAll ? notifications : notifications.slice(0, 10); 

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">Thông báo của bạn</h1>
      {displayedNotifications.length === 0 ? (
        <p className="text-gray-500">Không có thông báo nào.</p>
      ) : (
        displayedNotifications.map((notification) => (
          <div
            key={notification._id}
            className="flex items-start border-b border-gray-300 py-2"
          >
            <img
              src={assets.notification_icon}
              alt="Thông báo"
              className="w-6 h-6 mr-3"
            />
            <div className="flex-1">
              <p className="font-medium">{notification.content}</p>
              <p className="text-xs text-gray-400">
                Ca khám: {notification.new_work_shift === "morning" ? "buổi sáng" : "buổi chiều"}
              </p>
            </div>
          </div>
        ))
      )}

      {/* Nút để hiển thị tất cả hoặc thu gọn */}
      <div className="text-center mt-4">
        <button
          onClick={() => setShowAll(!showAll)}
          className="bg-gray-400 text-white py-2 px-4 rounded-full"
        >
          {showAll ? "Thu gọn" : "Xem tất cả"}
        </button>
      </div>
    </div>
  );
};

export default NotificationPage;