import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import AOS from 'aos';
import 'aos/dist/aos.css'; // Import AOS styles
import axios from 'axios'; // Nhập axios
const VITE_BACKEND_URI = import.meta.env.VITE_BACKEND_URI;

const TopDoctors = () => {
  const navigate = useNavigate();
  const { doctors, setDoctors } = useContext(AppContext);
  const [error, setError] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    AOS.init({ duration: 1000, once: true }); // Init AOS with 1s duration and only animate once
  }, []);

  // Lắng nghe thay đổi kích thước màn hình để xác định thiết bị
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get(`${VITE_BACKEND_URI}/doctor/find-top`);
        
        // Giả sử dữ liệu trả về là { success: true, doctors: [...] }
        if (response.data.doctors && Array.isArray(response.data.doctors)) {
          setDoctors(response.data.doctors);
        } else {
          throw new Error("Invalid data format");
        }
      } catch (err) {
        setError(err.message);
      }
    };

    fetchDoctors();
  }, [setDoctors]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  // Giới hạn số bác sĩ hiển thị dựa trên kích thước màn hình
  const visibleDoctors = isMobile ? doctors.slice(0, 5) : doctors.slice(0, 10);

  return (
    <div className="flex flex-col items-center gap-4 my-10 text-gray-900 md:mx-10">
      <h1 className="text-3xl font-medium text-center">
        Các Bác Sĩ Hàng Đầu Để Đặt Lịch Hẹn
      </h1>
      <p className="text-center sm:w-2/3 text-lg">
        Khám phá danh sách phong phú các bác sĩ uy tín của chúng tôi để dễ dàng
        lên lịch hẹn.
      </p>
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 gap-y-6" data-aos="fade-up">
        {Array.isArray(visibleDoctors) &&
          visibleDoctors.map((item, index) => (
            <div
              onClick={() => {
                navigate(`/appointment/${item._id}`);
                scrollTo(0, 0);
              }}
              className="border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:-translate-y-2 transition-all duration-500"
              key={index}
            >
              <div className="relative">
                <img
                  className="bg-blue-50"
                  src={item.user_id.image}
                  alt={item.user_id.name}
                />
              </div>
              <div className="p-4">
                {item.available === true ? (
                  <div className="flex items-center gap-2 text-sm text-center text-[#00759c]">
                    <p className="w-2 h-2 bg-[#00759c] rounded-full"></p>
                    <p>Lịch hẹn</p>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-sm text-center text-[#9c0000]">
                    <p className="w-2 h-2 bg-[#9c0000] rounded-full"></p>
                    <p>Lịch hẹn</p>
                  </div>
                )}
                <p className="text-gray-900 text-lg font-medium">
                  {item.user_id.name}
                </p>
                <p className="text-gray-600 text-sm truncate">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
      </div>

      <button
        onClick={() => {
          navigate("/doctors");
          scrollTo(0, 0);
        }}
        className="bg-blue-50 text-gray-600 px-12 py-3 rounded-full mt-10"
      >
        Xem Tất Cả
      </button>
    </div>
  );
};

export default TopDoctors;
