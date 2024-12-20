import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { convertToSlug } from "../utils/stringUtils";

const VITE_BACKEND_URI = import.meta.env.VITE_BACKEND_URI;

const SpecialitySkeleton = () => {
  return (
    <div className="flex sm:justify-center gap-4 pt-5 w-full overflow-scroll">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="flex flex-col items-center text-xs cursor-pointer flex-shrink-0 animate-pulse"
        >
          <div className="bg-gray-200 w-16 sm:w-24 h-16 mb-2 rounded-full"></div>{" "}
          {/* Thêm rounded-full để tạo hình tròn */}
          <div className="bg-gray-200 h-4 w-20"></div>
        </div>
      ))}
    </div>
  );
};



  const SpecialityMenu = () => {
    const [specialityData, setSpecialityData] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate(); // Khởi tạo navigate

    useEffect(() => {
      const fetchSpecialities = async () => {
        setLoading(true);
        try {
          const response = await axios.get(
            `${VITE_BACKEND_URI}/specialization/find-all`
          );
          const data = response.data.specializations.map((item) => ({
            speciality: item.name,
            image: item.image || "./Dermatologist.svg",
          }));
          setSpecialityData(data);
        } catch (error) {
          console.error("Error fetching specialities:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchSpecialities();
    }, []);

    const handleSpecialityClick = (speciality) => {
      const slug = convertToSlug(speciality);
      navigate(`/doctors?specialization=${slug}`); // Cập nhật URL
      scrollTo(0, 0); // Cuộn lên đầu trang
    };

    return (
      <div
        className="flex flex-col items-center gap-4 py-12 text-gray-800"
        id="speciality"
      >
        <h1 className="text-3xl font-medium text-center">
          Tìm Kiếm Theo Chuyên Ngành
        </h1>
        <p className="sm:w-2/3 text-center text-lg">
          Khám phá danh sách đa dạng các bác sĩ uy tín, giúp bạn dễ dàng đặt
          lịch hẹn theo nhu cầu của mình.
        </p>
        {loading ? (
          <SpecialitySkeleton />
        ) : (
          <div className="flex sm:justify-center gap-4 pt-5 w-full overflow-scroll">
            {specialityData.map((item, index) => (
              <div
                onClick={() => handleSpecialityClick(item.speciality)}
                className="flex flex-col items-center text-xs cursor-pointer flex-shrink-0 hover:translate-y-[-10px] transition-all duration-500"
                key={index}
              >
                <div
                  className="w-24 h-24 flex items-center justify-center rounded-full overflow-hidden mb-2"
                  style={{
                    backgroundImage:
                      "linear-gradient(to bottom, #b4c5de, #dfe3ed)",
                  }}
                >
                  <img
                    className="w-full h-full object-cover"
                    src={item.image}
                    alt={item.speciality}
                  />
                </div>
                <p className="text-lg">{item.speciality}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

export default SpecialityMenu;
