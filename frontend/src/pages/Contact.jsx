import React from 'react';
import { assets } from '../assets/assets';

const Contact = () => {
  return (
    <div className="px-4 py-10 md:px-20 lg:px-40">

      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-700">
          LIÊN HỆ <span className="text-[#219c9e]">VỚI CHÚNG TÔI</span>
        </h1>
        <p className="text-gray-500 mt-2">Chúng tôi luôn sẵn sàng hỗ trợ bạn!</p>
      </div>

      {/* Contact Info and Image */}
      <div className="flex flex-col md:flex-row gap-10 mb-16">

        {/* Image */}
        <img className="w-full md:max-w-md rounded-lg shadow-lg" src={assets.contact_image} alt="Contact Us" />

        {/* Contact Information */}
        <div className="flex flex-col gap-6">
          <div>
            <h2 className="font-semibold text-xl text-gray-600">VĂN PHÒNG CỦA CHÚNG TÔI</h2>
            <div className="flex items-center gap-2">
              {/* Location SVG Icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-500"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M12 2C8.134 2 5 5.134 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.866-3.134-7-7-7zm0 9.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z"
                />
              </svg>

              {/* Address Text */}
              <p className="text-gray-500">70 Nguyễn Huệ, phường Vĩnh Ninh, Thành Phố Huế</p>
            </div>
          </div>
          <div>
            <h2 className="font-semibold text-xl text-gray-600">THÔNG TIN LIÊN HỆ</h2>

            {/* Phone Information */}
            <div className="flex items-center gap-2 text-gray-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M3 2.75A.75.75 0 0 1 3.75 2h4.58a.75.75 0 0 1 .738.57l1.15 4.6a.75.75 0 0 1-.216.74L7.71 10.91a11.042 11.042 0 0 0 5.38 5.38l2.995-2.296a.75.75 0 0 1 .739-.216l4.6 1.15a.75.75 0 0 1 .57.738v4.58a.75.75 0 0 1-.75.75A17.25 17.25 0 0 1 2.25 3.5a.75.75 0 0 1 .75-.75z" />
              </svg>
              <p>SĐT: +84-365-142-649</p>
            </div>

            {/* Email Information */}
            <div className="flex items-center gap-2 text-gray-500 mt-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M1.5 4.5A2.25 2.25 0 0 1 3.75 2.25h16.5A2.25 2.25 0 0 1 22.5 4.5v15a2.25 2.25 0 0 1-2.25 2.25H3.75A2.25 2.25 0 0 1 1.5 19.5v-15zm2.648.75 7.55 5.404 7.551-5.404H4.148zM3 18.75V6.234l8.526 6.113a.75.75 0 0 0 .847 0L21 6.234v12.516H3z" />
              </svg>
              <p>Email: lequythien1@gmail.com</p>
            </div>
          </div>
          <div>
            <h2 className="font-semibold text-xl text-gray-600">GIỜ LÀM VIỆC</h2>

            {/* Working Hours with Clock Icon */}
            <div className="flex items-center gap-2 text-gray-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 1.75a10.25 10.25 0 1 0 0 20.5 10.25 10.25 0 0 0 0-20.5zm0 1.5a8.75 8.75 0 1 1 0 17.5 8.75 8.75 0 0 1 0-17.5zm.75 4a.75.75 0 0 0-1.5 0v5.25c0 .414.336.75.75.75h3a.75.75 0 0 0 0-1.5H12.75V7.25z" />
              </svg>
              <p>
                Thứ Hai - Thứ Sáu: 8:00 - 18:00 <br />
                Thứ Bảy: 8:00 - 12:00
              </p>
            </div>
          </div>
          <div>
            <div className="flex gap-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-[#4267B2] text-2xl"><i className="fab fa-facebook-f"></i></a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-[#1DA1F2] text-2xl"><i className="fab fa-twitter"></i></a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-[#C13584] text-2xl"><i className="fab fa-instagram"></i></a>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Form and Map Side by Side */}
      <div className="flex flex-col lg:flex-row gap-10">

        {/* Contact Form */}
        <div className="bg-gray-100 rounded-lg p-8 shadow-lg w-full lg:w-1/2 h-full">
          <h2 className="text-2xl font-semibold text-gray-700 mb-6 text-center">GỬI TIN NHẮN CHO CHÚNG TÔI</h2>
          <form className="flex flex-col gap-4">
            <input type="text" placeholder="Tên của bạn" className="p-3 border rounded-md" required />
            <input type="email" placeholder="Email của bạn" className="p-3 border rounded-md" required />
            <textarea placeholder="Tin nhắn của bạn" className="p-3 border rounded-md h-32" required></textarea>
            <button type="submit" className="p-3 bg-[#219c9e] text-white font-bold rounded-md hover:bg-[#1b8285] transition-colors">GỬI TIN NHẮN</button>
          </form>
        </div>

        {/* Location Map */}
        <div className="bg-gray-100 rounded-lg p-8 shadow-lg w-full lg:w-1/2 h-full">
          <h2 className="text-2xl font-semibold text-gray-700 mb-6 text-center">BẢN ĐỒ</h2>
          <iframe
            className="w-full h-full rounded-lg shadow-lg border-4"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3819.459845056251!2d107.583388!3d16.4622236!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3141a127c53b59e9%3A0x2af4ebf3f8f0e7f8!2zNzAgTmfDtG4gSHXhuqE!5e0!3m2!1sen!2s!4v1699486753456!5m2!1sen!2s"
            allowFullScreen=""
            aria-hidden="false"
            tabIndex="0"
            style={{ height: '328px' }}
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default Contact;
