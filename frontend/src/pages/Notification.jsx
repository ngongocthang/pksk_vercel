import React, { useState, useEffect, useContext } from "react";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";

// Hàm tính thời gian đã trôi qua
const timeAgo = (date) => {
  const now = new Date();
  const diffInSeconds = Math.floor((now - new Date(date)) / 1000);

  const seconds = diffInSeconds;
  const minutes = Math.floor(diffInSeconds / 60);
  const hours = Math.floor(diffInSeconds / 3600);
  const days = Math.floor(diffInSeconds / (3600 * 24));

  if (days > 0) {
    return `${days} ngày trước`;
  }
  if (hours > 0) {
    return `${hours} giờ trước`;
  }
  if (minutes > 0) {
    return `${minutes} phút trước`;
  }
  return `${seconds} giây trước`;
};

const NotificationPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const [loading, setLoading] = useState(true); // Thêm trạng thái loading
  const { user } = useContext(AppContext);
  const navigate = useNavigate();

  const token = user?.token;

  // Kiểm tra và điều hướng nếu không có token
  if (!token) {
    navigate("/account");
    return null;
  }

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true); // Bắt đầu tải dữ liệu
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
      } finally {
        setLoading(false); 
      }
    };
    fetchNotifications();
  }, [token]);

  // Sắp xếp thông báo theo thứ tự thời gian giảm dần (mới nhất lên đầu)
  const sortedNotifications = notifications.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  // Chỉ hiển thị 10 thông báo đầu tiên
  const displayedNotifications = showAll ? sortedNotifications : sortedNotifications.slice(0, 10);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">Thông báo của bạn</h1>

      {loading ? (
        <div className="text-center text-gray-500">Đang tải thông báo...</div> // Hiển thị thông báo khi đang tải
      ) : notifications.length === 0 ? (
        <p className="text-center text-gray-500">Không có thông báo nào.</p>
      ) : (
        displayedNotifications.map((notification) => (
          <div
            key={notification._id}
            className={`flex items-start border-b border-gray-300 py-2 ${!notification.read ? "bg-transparent" : ""}`}
          >
            <div className="flex-1">
              <p className="font-medium">{notification.content}</p>
              <p className="text-xs text-gray-400">
                Ca khám: {notification.new_work_shift === "morning" ? "buổi sáng" : "buổi chiều"}
              </p>
              {/* Hiển thị thời gian đã trôi qua */}
              <p className="text-xs text-gray-400">{timeAgo(notification.createdAt)}</p>
            </div>
          </div>
        ))
      )}

      {/* Chỉ hiển thị nút nếu có nhiều hơn 10 thông báo */}
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

export default NotificationPage;
