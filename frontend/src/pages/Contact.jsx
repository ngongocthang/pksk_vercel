import AOS from 'aos';
import 'aos/dist/aos.css';
import React, { useEffect } from 'react';
import { assets } from '../assets/assets';

const Contact = () => {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true }); 
  }, []);

  return (
    <div className="px-4 py-10 md:px-20 lg:px-40">

      {/* Header */}
      <div className="text-center mb-10" data-aos="fade-up">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-700">
          LIÊN HỆ <span className="text-[#219c9e]">VỚI CHÚNG TÔI</span>
        </h1>
        <p className="text-gray-500 mt-2">Chúng tôi luôn sẵn sàng hỗ trợ bạn!</p>
      </div>

      {/* Contact Info and Image */}
      <div className="flex flex-col md:flex-row gap-10 mb-16">

        {/* Image */}
        <img 
          className="w-full md:max-w-md rounded-lg shadow-lg" 
          src={assets.contact_image} 
          alt="Contact Us" 
          data-aos="fade-right"
        />

        {/* Contact Information */}
        <div className="flex flex-col gap-6" data-aos="fade-left">
          <div>
            <h2 className="font-semibold text-lg text-gray-600">VĂN PHÒNG CỦA CHÚNG TÔI</h2>
            <div className="flex items-center gap-2">
              {/* Location SVG Icon */}
              <img className='h-5 w-5 text-gray-500' src={assets.Address} alt="Address" />
              {/* Address Text */}
              <p className="text-gray-500">70 Nguyễn Huệ, phường Vĩnh Ninh, Thành Phố Huế</p>
            </div>
          </div>
          <div>
            <h2 className="font-semibold text-lg text-gray-600">THÔNG TIN LIÊN HỆ</h2>

            {/* Phone Information */}
            <div className="flex items-center gap-2 text-gray-500">
              <img className='h-5 w-5 text-gray-500' src={assets.Phone} alt="Phone" />
              <p>SĐT: +84-365-142-649</p>
            </div>

            {/* Email Information */}
            <div className="flex items-center gap-2 text-gray-500 mt-2">
              <img className='h-5 w-5 text-gray-500' src={assets.Email} alt="Email" />
              <p>Email: lequythien1@gmail.com</p>
            </div>
          </div>
          <div>
            <h2 className="font-semibold text-lg text-gray-600">GIỜ LÀM VIỆC</h2>

            {/* Working Hours with Clock Icon */}
            <div className="flex items-center gap-2 text-gray-500">
              <img className='h-5 w-5 text-gray-500' src={assets.Clock} alt="Clock" />
              <p>
                Thứ Hai - Thứ Sáu: 8:00 - 18:00 <br />
                Thứ Bảy: 8:00 - 12:00
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Form and Map Side by Side */}
      <div className="flex flex-col lg:flex-row gap-10">

        {/* Contact Form */}
        <div className="bg-gray-100 rounded-lg p-8 shadow-lg w-full lg:w-1/2 h-full" data-aos="fade-right">
          <h2 className="text-lg font-semibold text-gray-700 mb-6 text-center">GỬI TIN NHẮN CHO CHÚNG TÔI</h2>
          <form className="flex flex-col gap-4">
            <input type="text" placeholder="Tên của bạn" className="p-3 border rounded-md" required />
            <input type="email" placeholder="Email của bạn" className="p-3 border rounded-md" required />
            <textarea placeholder="Tin nhắn của bạn" className="p-3 border rounded-md h-32" required></textarea>
            <button type="submit" className="p-3 bg-[#219c9e] text-white font-bold rounded-md hover:bg-[#1b8285] transition-colors">GỬI TIN NHẮN</button>
          </form>
        </div>

        {/* Location Map */}
        <div className="bg-gray-100 rounded-lg p-8 shadow-lg w-full lg:w-1/2 h-full" data-aos="fade-left">
          <h2 className="text-lg font-semibold text-gray-700 mb-6 text-center">BẢN ĐỒ</h2>
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
