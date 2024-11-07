import React, { useState, useEffect, useContext } from "react";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";

// Hàm để chuyển ngày thành chuỗi định dạng 'dd-mm-yyyy'
const formatDate = (date) => {
  const d = new Date(date);
  const day = d.getDate();
  const month = d.getMonth() + 1; 
  const year = d.getFullYear();
  return `${day < 10 ? "0" + day : day}/${month < 10 ? "0" + month : month}/${year}`;
};

// Hàm để nhóm thông báo theo ngày
const groupNotificationsByDate = (notifications) => {
  return notifications.reduce((groups, notification) => {
    const notificationDate = formatDate(notification.createdAt); // Giả sử `createdAt` là trường ngày của thông báo
    if (!groups[notificationDate]) {
      groups[notificationDate] = [];
    }
    groups[notificationDate].push(notification);
    return groups;
  }, {});
};

const NotificationPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const { user } = useContext(AppContext); // Removed setUnreadCount as it's no longer needed
  const navigate = useNavigate();

  const token = user?.token;

  if (!token) {
    navigate("/account");
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

  // Nhóm thông báo theo ngày
  const groupedNotifications = groupNotificationsByDate(notifications);
  const notificationDates = Object.keys(groupedNotifications);

  // Hiển thị tất cả các thông báo nếu có > 10 thông báo, nếu không hiển thị 10 thông báo gần nhất
  const displayedNotifications = showAll ? notificationDates : notificationDates.slice(0, 10); // Hiển thị 10 thông báo gần nhất

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">Thông báo của bạn</h1>
      {notificationDates.length === 0 ? (
        <p className="text-gray-500">Không có thông báo nào.</p>
      ) : (
        displayedNotifications.map((date) => (
          <div key={date}>
            <h2 className="text-xl font-semibold mt-4">{date}</h2>
            {groupedNotifications[date].map((notification) => (
              <div
                key={notification._id}
                className={`flex items-start border-b border-gray-300 py-2 ${
                  !notification.read ? "bg-transparent" : ""
                }`}
              >
                <div className="flex-1">
                  <p className="font-medium">{notification.content}</p>
                  <p className="text-xs text-gray-400">
                    Ca khám: {notification.new_work_shift === "morning" ? "buổi sáng" : "buổi chiều"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ))
      )}
      {/* Chỉ hiển thị nút nếu số lượng thông báo > 10 */}
      {notificationDates.length > 10 && (
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
