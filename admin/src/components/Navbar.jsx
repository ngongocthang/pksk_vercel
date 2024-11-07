import React, { useContext, useState, useEffect } from 'react';
import { assets } from '../assets/assets';
import { AdminContext } from '../context/AdminContext';
import { useNavigate } from 'react-router-dom';
import { DoctorContext } from '../context/DoctorContext';
import '../index.css';

import { BellIcon } from '@heroicons/react/24/outline';

const Navbar = () => {

    const { aToken, setAToken } = useContext(AdminContext);
    const { dToken, setDToken } = useContext(DoctorContext);
    const navigate = useNavigate();

    // Trạng thái modal (hiển thị thông báo)
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showAllNotifications, setShowAllNotifications] = useState(false);

    // Dữ liệu thông báo mẫu với ngày tháng
    const notifications = [
        { id: 1, message: "Bạn có một cuộc hẹn mới từ bệnh nhân A.", date: "2024-11-07", read: false },
        { id: 2, message: "Bệnh nhân B đã hủy lịch hẹn.", date: "2024-11-06", read: false },
        { id: 3, message: "Lịch làm việc của bạn đã được cập nhật.", date: "2024-11-05", read: false },
        { id: 4, message: "Thông báo mẫu 4", date: "2024-11-07", read: false },
        { id: 5, message: "Thông báo mẫu 5", date: "2024-11-05", read: false },
        { id: 6, message: "Thông báo mẫu 6", date: "2024-11-06", read: false },
        { id: 7, message: "Thông báo mẫu 7", date: "2024-11-07", read: false },
        { id: 8, message: "Thông báo mẫu 8", date: "2024-11-04", read: false },
        { id: 9, message: "Thông báo mẫu 9", date: "2024-11-04", read: false },
        { id: 10, message: "Thông báo mẫu 10", date: "2024-11-06", read: false },
        { id: 11, message: "Thông báo mẫu 11", date: "2024-11-03", read: false },
        { id: 12, message: "Thông báo mẫu 12", date: "2024-11-03", read: false }
    ];


    // Hàm đăng xuất
    const logout = () => {
        navigate('/');
        aToken && setAToken('');
        aToken && localStorage.removeItem('aToken');
        dToken && setDToken('');
        dToken && localStorage.removeItem('dToken');
    };

    // Hàm mở/đóng modal
    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    };

    // Hàm chuyển đổi giữa "Tất cả" và "Thu gọn"
    const toggleNotificationView = () => {
        setShowAllNotifications(!showAllNotifications);
    };

    // Lấy 10 thông báo mới nhất hoặc tất cả thông báo nếu chọn "Tất cả"
    const displayedNotifications = showAllNotifications ? notifications : notifications.slice(0, 10);

    // Nhóm thông báo theo ngày
    const groupedNotifications = displayedNotifications.reduce((acc, notification) => {
        const date = notification.date; // Lấy ngày từ thông báo
        if (!acc[date]) {
            acc[date] = [];
        }
        acc[date].push(notification);
        return acc;
    }, {});

    // Tính số lượng thông báo chưa đọc
    const unreadNotifications = notifications.filter(notification => !notification.read).length;

    // Hàm chuyển đổi định dạng ngày
    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    useEffect(() => {
        if (isModalOpen) {
            document.body.style.pointerEvents = 'none';  // Vô hiệu hóa tương tác với background
            document.body.style.overflow = 'hidden';  // Vô hiệu hóa cuộn trang
            document.body.classList.add('modal-open');  // Thêm lớp modal-open để ngăn chặn việc chọn văn bản
        } else {
            document.body.style.pointerEvents = 'auto';  // Kích hoạt lại tương tác với background
            document.body.style.overflow = 'auto';  // Kích hoạt lại cuộn trang
            document.body.classList.remove('modal-open');  // Loại bỏ lớp modal-open khi modal đóng
        }

        return () => {
            document.body.style.pointerEvents = 'auto';  // Dọn dẹp khi component bị unmount
            document.body.style.overflow = 'auto';  // Dọn dẹp khi component bị unmount
            document.body.classList.remove('modal-open');  // Dọn dẹp khi component bị unmount
        };
    }, [isModalOpen]);

    return (
        <div className='flex justify-between items-center px-4 sm:px-10 py-3 border-b bg-white'>
            <div className='flex items-center gap-2 text-xs'>
                <img className='w-36 sm:w-40 cursor-pointer' src={assets.admin_logo} alt="" />
                <p className='border px-2.5 py-0.5 rounded-full border-gray-500 text-gray-600'>{aToken ? 'Quản trị viên' : 'Bác sĩ'}</p>
            </div>

            <div className="flex items-center gap-4">
                {/* Icon thông báo */}
                <div className='relative'>
                    <BellIcon
                        className="w-6 h-6 text-gray-600 cursor-pointer"
                        onClick={toggleModal}
                    />
                    {/* Hiển thị số lượng thông báo chưa đọc */}
                    {unreadNotifications > 0 && (
                        <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                            {unreadNotifications}
                        </span>
                    )}
                </div>

                {/* Nút Đăng xuất */}
                <button onClick={logout} className='bg-[#0091a1] text-white text-sm px-10 py-2 rounded-full'>Đăng xuất</button>
            </div>

            {/* Modal thông báo */}
            {isModalOpen && (
                <div className='fixed inset-0 flex justify-center items-center z-50 bg-gray-500 bg-opacity-50'>
                    <div className='bg-white p-8 rounded-lg w-3/4 max-w-5xl modal-content'>
                        <div className='flex justify-between items-center'>
                            <h3 className='text-xl font-semibold'>Thông báo</h3>
                            <button onClick={toggleModal} className='text-gray-500 text-lg'>Đóng</button>
                        </div>
                        <div className='mt-6'>
                            {Object.keys(groupedNotifications).length > 0 ? (
                                <div className="h-80 overflow-y-auto">
                                    {Object.keys(groupedNotifications).map((date) => ( // Hiển thị tất cả nhóm thông báo
                                        <div key={date}>
                                            <h4 className="font-semibold text-gray-600 mt-4">{formatDate(date)}</h4>
                                            <ul className='space-y-4'>
                                                {groupedNotifications[date].map((notification) => (
                                                    <li key={notification.id} className="py-3 px-4 border-b border-gray-200 flex items-start gap-2">
                                                        <BellIcon className="w-5 h-5 text-black" />
                                                        <p className="text-lg text-gray-800">{notification.message}</p>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className='text-gray-500'>Không có thông báo mới.</p>
                            )}

                            <div className='mt-4'>
                                <button
                                    onClick={toggleNotificationView}
                                    className='text-blue-500 text-sm'
                                >
                                    {showAllNotifications ? 'Thu gọn' : 'Tất cả'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Navbar;
