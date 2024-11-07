import React, { useEffect, useState } from 'react';
import { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { assets } from '../assets/assets';
import { NavLink, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, setUser } = useContext(AppContext);
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    const savedUser = sessionStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, [setUser]);

  const handleLogout = () => {
    sessionStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  return (
    <div className='flex items-center justify-between text-sm py-4 mb-5 border-b border-b-gray-400'>
      {/* Thanh điều hướng chính */}
      <img
        onClick={() => navigate('/')}
        className='w-44 cursor-pointer'
        src={assets.logo}
        alt=""
        style={{ width: "80px", height: "80px", objectFit: "contain" }}
      />
      {/* Danh sách liên kết điều hướng */}
      <ul className='hidden md:flex items-start gap-5 font-medium'>
        <NavLink to='/'>
          <li className='py-1 text-base'>Trang chủ</li>
          <hr className='border-none outline-none h-0.5 bg-[#00759c] w-3/5 m-auto hidden' />
        </NavLink>
        <NavLink to='/doctors'>
          <li className='py-1 text-base'>Tất cả bác sĩ</li>
          <hr className='border-none outline-none h-0.5 bg-[#00759c] w-3/5 m-auto hidden' />
        </NavLink>
        <NavLink to='about'>
          <li className='py-1 text-base'>Về chúng tôi</li>
          <hr className='border-none outline-none h-0.5 bg-[#00759c] w-3/5 m-auto hidden' />
        </NavLink>
        <NavLink to='contact'>
          <li className='py-1 text-base'>Liên hệ</li>
          <hr className='border-none outline-none h-0.5 bg-[#00759c] w-3/5 m-auto hidden' />
        </NavLink>
      </ul>

      <div className='flex items-center gap-4'>
        {user ? (
          <div className='flex items-center gap-2 cursor-pointer group relative'>
            <img className='w-8 rounded-full' src={assets.profile_pic} alt="" />
            <p className='font-medium text-gray-700'>{user.name}</p>
            <img className='w-2.5' src={assets.dropdown_icon} alt="" />
            <div className='absolute top-0 right-0 pt-14 text-base font-medium text-gray-600 z-20 hidden group-hover:block'>
              <div className='min-w-48 bg-stone-100 rounded flex flex-col gap-4 p-4'>
                <p onClick={() => navigate('my-profile')} className='hover:text-black cursor-pointer'>Hồ sơ của tôi</p>
                <p onClick={() => navigate('my-appointments')} className='hover:text-black cursor-pointer'>Lịch hẹn của tôi</p>
                <p onClick={() => navigate('medical-history')} className='hover:text-black cursor-pointer'>Lịch sử khám bệnh</p>
                <p onClick={handleLogout} className='hover:text-black cursor-pointer'>Đăng xuất</p>
              </div>
            </div>
          </div>
        ) : (
          <NavLink to='/account'>
            <button onClick={() => navigate('/login')} className='bg-[#00759c] text-white px-8 py-3 rounded-full font-light hidden md:block'>Tạo tài khoản</button>
          </NavLink>
        )}
        {/* Biểu tượng chuông thông báo */}
        <img
          onClick={() => {
            if (user) {
              navigate("/Notifications");
            } else {
              navigate("/login");
            }
          }}
          className="w-6 cursor-pointer"
          src={assets.notification_icon}
          alt="Thông báo"
        />

        <img
          onClick={() => setShowMenu(true)}
          className="w-6 md:hidden"
          src={assets.menu_icon}
          alt=""
        />
        {/* ----- Mobile Menu ----- */}
        <div
          className={`${showMenu ? "fixed w-full" : "h-0 w-0"} md:hidden right-0 top-0 bottom-0 z-20 overflow-hidden bg-white transition-all`}
        >
          <div className="flex items-center justify-between px-5 py-6">
            <img className="w-36" src={assets.logo} alt="" />
            <img
              className="w-7"
              onClick={() => setShowMenu(false)}
              src={assets.cross_icon}
              alt=""
            />
          </div>
          <ul className="flex flex-col items-center gap-2 mt-5 px-5 text-lg font-medium">
            <NavLink onClick={() => setShowMenu(false)} to="/">
              <p className="px-4 py-2 rounded inline-block">Trang chủ</p>
            </NavLink>
            <NavLink onClick={() => setShowMenu(false)} to="/doctors">
              <p className="px-4 py-2 rounded inline-block">Tất cả bác sĩ</p>
            </NavLink>
            <NavLink onClick={() => setShowMenu(false)} to="/about">
              <p className="px-4 py-2 rounded inline-block">Về chúng tôi</p>
            </NavLink>
            <NavLink onClick={() => setShowMenu(false)} to="/contact">
              <p className="px-4 py-2 rounded inline-block">Liên hệ</p>
            </NavLink>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;

