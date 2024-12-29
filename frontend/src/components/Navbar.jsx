import axios from "axios";
import React, { useContext, useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets";

const VITE_BACKEND_URI = import.meta.env.VITE_BACKEND_URI;

const Navbar = () => {
  const navigate = useNavigate();
  const {
    user,
    setUser,
    unreadCount,
    setUnreadCount,
    requestNotificationUpdate,
  } = useContext(AppContext);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [notificationsCount, setNotificationsCount] = useState(0);
  const [rotateIcon, setRotateIcon] = useState(false);

  const [isVisible, setIsVisible] = useState(true); // State for navbar visibility
  const [notifications, setNotifications] = useState([]);

  const getDisplayName = (fullName) => {
    const nameParts = fullName.split(" ");
    return nameParts.slice(-2).join(" ");
  };

  const fetchUnreadNotifications = async () => {
    try {
      const response = await axios.get(`${VITE_BACKEND_URI}/notification`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      const data = response.data;

      // Kiểm tra nếu dữ liệu là mảng
      if (Array.isArray(data)) {
        const unreadNotifications = data.filter(
          (notification) => !notification.isRead
        );
        setUnreadCount(unreadNotifications.length);
        setNotifications(data);
      } else {
        setUnreadCount(0);
        setNotifications([]);
      }
    } catch (error) {
      // console.error("Error fetching notifications:", error);
    }
  };

  useEffect(() => {
    if (user?.token) {
      fetchUnreadNotifications();
      const interval = setInterval(fetchUnreadNotifications, 1000);
      return () => clearInterval(interval);
    }
  }, [user]);

  // useEffect này giúp theo dõi sự thay đổi trong notifications và cập nhật unreadCount
  useEffect(() => {
    if (notifications.length > 0) {
      const unreadNotifications = notifications.filter(
        (notification) => !notification.isRead
      );
      setUnreadCount(unreadNotifications.length);
    }
  }, [notifications]);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, [setUser]);

  const toggleMenu = () => {
    setShowMenu(!showMenu);
    setRotateIcon(!rotateIcon);
  };

  // Kiểm tra token
  const isLoggedIn = !!localStorage.getItem("token");

  const handleLogout = async () => {
    await axios.post(`${VITE_BACKEND_URI}/logout`, {
      headers: { Authorization: `Bearer ${user.token}` },
    });
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("unreadCount");
    setUser(null); // Đặt user về null
    navigate("/account");
  };

  const handleNotificationClick = () => {
    navigate("/notifications");
    requestNotificationUpdate();
    setNotificationsCount(0);
  };

  const handleDropdownItemClick = () => {
    setShowDropdown(false); // Đóng dropdown khi chọn mục
  };

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      if (window.scrollY === 0) {
        setIsVisible(true);
      } else if (window.scrollY > lastScrollY) {
        setIsVisible(true);
      } else if (window.scrollY < lastScrollY) {
        setIsVisible(true);
      }
      lastScrollY = window.scrollY <= 0 ? 0 : window.scrollY;
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`flex items-center justify-between text-sm py-4 mb-5 border-b border-b-gray-400 bg-white sticky top-0 z-50 transition-transform duration-300 ${
        isVisible ? "transform-none" : "-translate-y-full"
      }`}
    >
      <img
        onClick={() => navigate("/")}
        className="w-20 sm:w-24 cursor-pointer"
        src={assets.logo}
        alt="Logo"
      />

      <ul className="hidden md:flex items-start gap-5 font-medium">
        <NavLink to="/" activeClassName="underline">
          <li className="py-1 text-base">Trang chủ</li>
          <hr className="border-none outline-none h-0.5 bg-[#00759c] w-3/5 m-auto hidden" />
        </NavLink>
        <NavLink to="/doctors" activeClassName="underline">
          <li className="py-1 text-base">Tất cả bác sĩ</li>
          <hr className="border-none outline-none h-0.5 bg-[#00759c] w-3/5 m-auto hidden" />
        </NavLink>
        <NavLink to="/abouts" activeClassName="underline">
          <li className="py-1 text-base">Về chúng tôi</li>
          <hr className="border-none outline-none h-0.5 bg-[#00759c] w-3/5 m-auto hidden" />
        </NavLink>
        <NavLink to="/contact" activeClassName="underline">
          <li className="py-1 text-base">Liên hệ</li>
          <hr className="border-none outline-none h-0.5 bg-[#00759c] w-3/5 m-auto hidden" />
        </NavLink>
        <NavLink to="/all-schedule" activeClassName="underline">
          <li className="py-1 text-base">Lịch làm việc</li>
          <hr className="border-none outline-none h-0.5 bg-[#00759c] w-3/5 m-auto hidden" />
        </NavLink>
      </ul>

      <div className="flex items-center gap-4">
        {isLoggedIn ? (
          <div
            className="flex items-center gap-2 cursor-pointer relative"
            onMouseEnter={() => setShowDropdown(true)}
            onMouseLeave={() => setShowDropdown(false)}
          >
            <img
              className="w-8 rounded-full"
              src={assets.profile_pic}
              alt="Avatar"
            />

            <p className="font-medium text-gray-700">
              {getDisplayName(user.name)}
            </p>

            <img
              className="w-2.5"
              src={assets.dropdown_icon}
              alt="Dropdown Icon"
            />

            {showDropdown && (
              <div className="absolute top-0 -left-6 pt-14 text-base font-medium text-gray-600 z-20">
                <div className="min-w-52 bg-stone-100 rounded flex flex-col gap-4 p-4">
                  <p
                    onClick={() => {
                      navigate("my-profile");
                      handleDropdownItemClick();
                    }}
                    className="hover:text-black cursor-pointer"
                  >
                    <i className="fa-regular fa-user mr-3"></i>
                    Hồ sơ của tôi
                  </p>
                  <p
                    onClick={() => {
                      navigate("my-appointments");
                      handleDropdownItemClick();
                    }}
                    className="hover:text-black cursor-pointer"
                  >
                    <i className="fa-regular fa-calendar-check mr-3"></i>
                    Lịch hẹn của tôi
                  </p>
                  <p
                    onClick={() => {
                      navigate("medical-history");
                      handleDropdownItemClick();
                    }}
                    className="hover:text-black cursor-pointer"
                  >
                    <i className="fa-solid fa-laptop-medical mr-2"></i>
                    Lịch sử khám bệnh
                  </p>
                  <p
                    onClick={() => {
                      handleLogout();
                      handleDropdownItemClick();
                    }}
                    className="hover:text-black cursor-pointer"
                  >
                    <i className="fa-solid fa-arrow-right-from-bracket mr-3"></i>
                    Đăng xuất
                  </p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <NavLink to="/account">
            <button className="bg-[#00759c] text-white px-8 py-3 rounded-full font-light hidden md:block">
              Đăng nhập
            </button>
          </NavLink>
        )}

        {isLoggedIn && (
          <div className="relative">
            <img
              onClick={handleNotificationClick}
              className="w-6 cursor-pointer"
              src={assets.notification_icon}
              alt="Thông báo"
            />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1">
                {unreadCount}
              </span>
            )}
          </div>
        )}

        <img
          onClick={toggleMenu}
          className="w-6 md:hidden"
          src={assets.menu_icon}
          alt="Menu"
        />

        <div
          className={`transition-all duration-500 ${
            showMenu
              ? "fixed w-full top-0 right-0 bottom-0 z-20 bg-white"
              : "h-0 w-0 overflow-hidden"
          }`}
        >
          <div className="flex items-center justify-between px-5 py-6">
            <img className="w-20" src={assets.logo} alt="Logo" />
            <img
              className={`w-7 duration-300 ease-in-out ${
                showMenu ? "rotate-180" : ""
              }`}
              onClick={toggleMenu}
              src={assets.cross_icon}
              alt="Close"
            />
          </div>
          <ul className="flex flex-col items-center gap-2 mt-5 px-5 text-lg font-medium">
            <NavLink onClick={() => setShowMenu(false)} to="/">
              <p className="px-4 py-2 rounded inline-block">Trang chủ</p>
            </NavLink>
            <NavLink onClick={() => setShowMenu(false)} to="/doctors">
              <p className="px-4 py-2 rounded inline-block">Tất cả bác sĩ</p>
            </NavLink>
            <NavLink onClick={() => setShowMenu(false)} to="/abouts">
              <p className="px-4 py-2 rounded inline-block">Về chúng tôi</p>
            </NavLink>
            <NavLink onClick={() => setShowMenu(false)} to="/contact">
              <p className="px-4 py-2 rounded inline-block">Liên hệ</p>
            </NavLink>
            {!user && (
              <NavLink onClick={() => setShowMenu(false)} to="/account">
                <p className="bg-[#00759c] text-white px-4 py-2 rounded font-light text-center w-full">
                  Đăng nhập
                </p>
              </NavLink>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;