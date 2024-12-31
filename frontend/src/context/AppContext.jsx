import PropTypes from "prop-types";
import { createContext, useEffect, useRef, useState } from "react";
export const AppContext = createContext();
const VITE_BACKEND_URI = import.meta.env.VITE_BACKEND_URI;
const AppContextProvider = (props) => {
  const [user, setUser] = useState(() => {
    // Khôi phục thông tin người dùng từ localStorage
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [doctors, setDoctors] = useState([]);
  const [patient, setPatient] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const wsRef = useRef(null);
  // WebSocket setup
  useEffect(() => {
    let intervalId;
    const initializeWebSocket = () => {
      const wsProtocol =
        window.location.protocol === "https:" ? "wss://" : "ws://";
      const ws = new WebSocket(
        `${wsProtocol}${VITE_BACKEND_URI.replace("http://", "")}`
      );
      wsRef.current = ws;
      ws.onopen = () => {
        console.log("WebSocket connection opened");
        if (user) {
          ws.send(JSON.stringify({ user_id: user.id }));
        }
      };
      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.notifications) {
          setNotifications(data.notifications);
          const unread = data.notifications.filter((n) => !n.isRead).length;
          setUnreadCount(unread);
        }
      };
      ws.onerror = (error) => {
        console.error("WebSocket error:", error);
      };
      ws.onclose = () => {
        console.log("WebSocket connection closed");
      };
      // Cập nhật định kỳ thông báo
      intervalId = setInterval(() => {
        requestNotificationUpdate();
      }, 2000);
    };
    if (user) {
      initializeWebSocket();
    }
    return () => {
      // Cleanup
      if (intervalId) clearInterval(intervalId);
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, [user]);
  // Request notification update
  const requestNotificationUpdate = () => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN && user) {
      wsRef.current.send(
        JSON.stringify({ user_id: user.id, action: "update" })
      );
    }
  };
  const value = {
    user,
    setUser: (newUser) => {
      if (JSON.stringify(newUser) !== JSON.stringify(user)) {
        setUser(newUser);
        if (newUser) {
          localStorage.setItem("user", JSON.stringify(newUser));
        } else {
          localStorage.removeItem("user");
          localStorage.removeItem("token");
        }
      }
    },
    doctors,
    setDoctors,
    patient,
    setPatient,
    notifications,
    setNotifications,
    unreadCount,
    requestNotificationUpdate,
  };
  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};
AppContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
export default AppContextProvider;
