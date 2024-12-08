import React, { useEffect } from 'react';
import { assets } from '../assets/assets';
import { FaRegCheckCircle } from 'react-icons/fa'; // Icon for highlighting features
import AOS from 'aos';
import 'aos/dist/aos.css'; // Import AOS styles

const About = () => {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true }); // Init AOS with 1s duration and only animate once
  }, []);

  return (
    <div className="px-4 py-10 lg:px-20 lg:py-16">

      {/* Page Title */}
      <div className="text-center mb-12" data-aos="fade-up">
        <h1 className="text-3xl font-semibold text-gray-700">
          GIỚI <span className="text-[#219c9e]">THIỆU</span>
        </h1>
        <p className="text-gray-500 mt-2">Khám phá sứ mệnh và cam kết của chúng tôi</p>
      </div>

      {/* About Us Section */}
      <div className="flex flex-col md:flex-row gap-10 lg:gap-16 mb-16">
        {/* Image */}
        <img 
          className="w-full md:max-w-md rounded-lg shadow-lg" 
          src={assets.about_image} 
          alt="About Triple T Care" 
          data-aos="fade-right" // Image slides in from the right
        />

        {/* Description */}
        <div className="flex flex-col gap-6 text-gray-700" data-aos="fade-left">
          <p>Chào mừng bạn đến với Triple T Care, đối tác đáng tin cậy trong việc quản lý nhu cầu chăm sóc sức khỏe của bạn. Chúng tôi hiểu những thách thức mà các cá nhân gặp phải khi lên lịch hẹn với bác sĩ và quản lý hồ sơ sức khỏe của họ.</p>
          <p>Cam kết của chúng tôi là mang đến sự xuất sắc trong công nghệ chăm sóc sức khỏe, tích hợp những tiến bộ mới nhất để cải thiện trải nghiệm người dùng và cung cấp dịch vụ vượt trội.</p>
          <div className="text-gray-800 font-semibold text-lg">Tầm nhìn của chúng tôi</div>
          <p>Triple T Care mong muốn thu hẹp khoảng cách giữa bệnh nhân và nhà cung cấp dịch vụ chăm sóc sức khỏe, tạo ra trải nghiệm chăm sóc liền mạch cho mọi người dùng.</p>
        </div>
      </div>

      {/* Why Choose Us Section */}
      <div className="mb-16">
        <h2 className="text-center text-2xl font-semibold text-gray-700 mb-8" data-aos="fade-up">
          TẠI SAO <span className="text-[#219c9e]">CHỌN CHÚNG TÔI</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[ 
            { title: 'Hiệu quả', description: 'Lên lịch cuộc hẹn phù hợp với lối sống bận rộn của bạn.' },
            { title: 'Sự tiện lợi', description: 'Truy cập vào mạng lưới chuyên gia đáng tin cậy.' },
            { title: 'Cá nhân hóa', description: 'Lời nhắc phù hợp giúp bạn luôn cập nhật về sức khỏe.' }
          ].map((feature, index) => (
            <div
              key={index}
              className="border border-gray-200 p-6 rounded-lg shadow-lg hover:bg-[#219c9e] hover:text-white transition-all duration-300 group"
              data-aos={index % 2 === 0 ? "fade-right" : "fade-left"} // Alternate animations for each feature
            >
              <FaRegCheckCircle className="text-[#219c9e] text-3xl mb-4 group-hover:text-white" />
              <h3 className="font-semibold text-lg">{feature.title}</h3>
              <p className="text-sm mt-2">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Our Mission Section */}
      <div className="bg-[#219c9e] text-white py-12 px-6 md:px-16 lg:px-24 rounded-lg shadow-lg mb-16" data-aos="fade-up">
        <h2 className="text-2xl font-semibold text-center mb-6">Sứ mệnh của chúng tôi</h2>
        <p className="text-center text-md md:text-lg">Triple T Care hướng đến việc mang lại giải pháp chăm sóc sức khỏe dễ tiếp cận và đáng tin cậy, giúp mỗi cá nhân quản lý sức khỏe của mình một cách chủ động và hiệu quả.</p>
      </div>

      {/* Team Section */}
      <div>
        <h2 className="text-center text-2xl font-semibold text-gray-700 mb-8" data-aos="fade-up">
          ĐỘI NGŨ <span className="text-[#219c9e]">CỦA CHÚNG TÔI</span>
        </h2>
        <div className="flex flex-wrap justify-center gap-10">
          {[{
            name: 'Nguyễn Lê Hồng Vân',
            role: 'Giám đốc điều hành',
            image: assets.dieuhanh
          }, {
            name: 'Nguyễn Lê Hồng Phog',
            role: 'Trưởng phòng phát triển sản phẩm',
            image: assets.phattrien
          }, {
            name: 'Nguyễn Lê Hồng Vân',
            role: 'Chuyên gia phân tích dữ liệu',
            image: assets.phantich
          }].map((member, index) => (
            <div 
              key={index} 
              className="text-center max-w-xs" 
              data-aos={index % 2 === 0 ? "fade-right" : "fade-left"} // Alternate animations for each team member
            >
              {/* Image with Hover Effect */}
              <img
                className="w-40 h-40 rounded-full mx-auto mb-4 shadow-lg object-cover transform duration-500 transition-all hover:translate-y-[-10px]"
                src={member.image}
                alt={member.name}
              />
              <h3 className="text-lg font-semibold text-gray-800">{member.name}</h3>
              <p className="text-gray-600">{member.role}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default About;
