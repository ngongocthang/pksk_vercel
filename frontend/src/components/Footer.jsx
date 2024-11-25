import React from 'react';
import { assets } from '../assets/assets';

const Footer = () => {
  return (
    <footer className="bg-[#ffffff] pt-10 pb-6 text-gray-700">
      <div className="container mx-auto px-4 grid gap-10 sm:grid-cols-3 lg:grid-cols-4">
        
        {/* ----- Left Section: Clinic Info ----- */}
        <div className="flex flex-col">
          <img className="mb-4 w-32" src={assets.logofood} alt="Clinic Logo" />
          <p className="text-sm leading-6">
            Triple T Care cam kết hướng tới sự xuất sắc trong hoạt động thăm khám lâm sàng, đào tạo và nghiên cứu, nhằm cung cấp dịch vụ chăm sóc tốt nhất. Mạng lưới chăm sóc sức khỏe của chúng tôi bao gồm hơn 2.900 giường bệnh trên khắp 13 bệnh viện và 4 phòng khám, với 27 năm kinh nghiệm.
          </p>
        </div>
        
        {/* ----- Center Left Section: Quick Links ----- */}
        <div>
          <h3 className="text-lg font-semibold mb-4">PHÒNG KHÁM</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="/" className="hover:text-[#00759c]">Trang chủ</a></li>
            <li><a href="/about" className="hover:text-[#00759c]">Về chúng tôi</a></li>
            <li><a href="/contact" className="hover:text-[#00759c]">Liên hệ</a></li>
            <li><a href="/privacy-policy" className="hover:text-[#00759c]">Chính sách bảo mật</a></li>
          </ul>
        </div>
        
        {/* ----- Center Right Section: Contact Info ----- */}
        <div>
          <h3 className="text-lg font-semibold mb-4">LIÊN HỆ</h3>
          <ul className="space-y-2 text-sm">
            <li><span className="font-medium">Điện thoại:</span> <a href="tel:+84365142649" className="hover:text-[#00759c]">+84-365-142-649</a></li>
            <li><span className="font-medium">Email:</span> <a href="mailto:tripletcare@gmail.com" className="hover:text-[#00759c]">tripletcare@gmail.com</a></li>
            <li><span className="font-medium">Địa chỉ:</span> 123 Đường ABC, Thành phố XYZ, Việt Nam</li>
          </ul>
        </div>
        
        {/* ----- Right Section: Social Media ----- */}
        <div>
          <h3 className="text-lg font-semibold mb-4">THEO DÕI CHÚNG TÔI</h3>
          <div className="flex justify-start item-center space-x-4 ml-12">
            <a href="https://facebook.com" aria-label="Facebook">
              <img src={assets.facebook_icon} alt="Facebook Icon" className="w-6 h-6 hover:scale-110 transition-transform" />
            </a>
            <a href="https://instagram.com" aria-label="Instagram">
              <img src={assets.instagram_icon} alt="Instagram Icon" className="w-6 h-6 hover:scale-110 transition-transform" />
            </a>
            <a href="https://twitter.com" aria-label="Twitter">
              <img src={assets.twitter_icon} alt="Twitter Icon" className="w-6 h-6 hover:scale-110 transition-transform" />
            </a>
          </div>
        </div>
      </div>

      {/* ----- Divider and Copyright Section ----- */}
      <div className="mt-8 border-t border-gray-300 pt-6 text-center text-sm text-gray-500">
        <p>Phòng Khám Sức Khỏe © {new Date().getFullYear()}. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
