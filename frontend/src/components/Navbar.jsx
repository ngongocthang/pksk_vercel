import React, { useContext, useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, setUser, unreadCount, requestNotificationUpdate } =
    useContext(AppContext);
  const [showDropdown, setShowDropdown] = useState(false);

  // Kiểm tra token
  const isLoggedIn = !!localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("unreadCount");
    setUser(null); // Đặt user về null
    navigate("/account");
  };

  const handleNotificationClick = () => {
    navigate("/notifications");
    requestNotificationUpdate();
  };

  const handleDropdownItemClick = () => {
    setShowDropdown(false); // Đóng dropdown khi chọn mục
  };

  return (
    <div className="flex items-center justify-between text-sm py-4 mb-5 border-b border-gray-400 bg-white sticky top-0 z-50">
      <img
        onClick={() => navigate("/")}
        className="w-20 sm:w-24 cursor-pointer"
        src={assets.logo}
        alt="Logo"
      />
      <ul className="hidden md:flex items-center gap-5 font-medium">
        <NavLink to="/" className="py-1 text-base" activeClassName="underline">
          Trang chủ
          <hr className='border-none outline-none h-0.5 bg-[#00759c] w-3/5 m-auto hidden' />
        </NavLink>
        <NavLink
          to="/doctors"
          className="py-1 text-base"
          activeClassName="underline"
        >
          Tất cả bác sĩ
          <hr className='border-none outline-none h-0.5 bg-[#00759c] w-3/5 m-auto hidden' />
        </NavLink>
        <NavLink
          to="/abouts"
          className="py-1 text-base"
          activeClassName="underline"
        >
          Về chúng tôi
          <hr className='border-none outline-none h-0.5 bg-[#00759c] w-3/5 m-auto hidden' />
        </NavLink>
        <NavLink
          to="/contact"
          className="py-1 text-base"
          activeClassName="underline"
        >
          Liên hệ
          <hr className='border-none outline-none h-0.5 bg-[#00759c] w-3/5 m-auto hidden' />
        </NavLink>
        <NavLink
          to="/all-schedule"
          className="py-1 text-base"
          activeClassName="underline"
        >
          Lịch làm việc
          <hr className='border-none outline-none h-0.5 bg-[#00759c] w-3/5 m-auto hidden' />
        </NavLink>
      </ul>
      <div className="flex items-center gap-4 relative">
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
            <p className="font-medium text-gray-700">{user.name}</p>
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
      </div>
    </div>
  );
};

export default Navbar;
