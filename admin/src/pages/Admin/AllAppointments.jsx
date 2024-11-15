import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate hook
import { AdminContext } from "../../context/AdminContext";
import { AppContext } from "../../context/AppContext";
import { assets } from "../../assets/assets";

const AllAppointments = () => {
  const { aToken, appointments, getAllAppointments, cancelAppointment } =
    useContext(AdminContext);
  const { calculateAge, slotDateFormat, currency } = useContext(AppContext);

  const [currentPage, setCurrentPage] = useState(1); // Current page
  const [appointmentsPerPage] = useState(10); // Appointments per page

  const totalPages = Math.ceil(appointments.length / appointmentsPerPage); // Total pages

  const navigate = useNavigate(); // Initialize navigate hook

  useEffect(() => {
    if (aToken) {
      getAllAppointments();
    }
  }, [aToken]);

  // Function to format date
  const formatDate = (dateString) => {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', options);
  };

  // Get the appointments for the current page
  const indexOfLastAppointment = currentPage * appointmentsPerPage;
  const indexOfFirstAppointment = indexOfLastAppointment - appointmentsPerPage;
  const currentAppointments = appointments.slice(indexOfFirstAppointment, indexOfLastAppointment);

  // Function to handle page change
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    navigate(`/all-appointments?page=${pageNumber}`); // Change the URL with the new page number
  };

  return (
    <div className="w-full max-w-6xl m-5">
      <p className="mb-3 text-lg font-medium">Tất cả các cuộc hẹn</p>
      <div className="bg-white border rounded text-sm max-h-[80vh] min-h-[60vh] overflow-y-scroll">
        <div className="hidden sm:grid grid-cols-[0.5fr_2fr_2fr_2fr_2fr] grid-flow-col py-3 px-6 border-b">
          <p className="font-bold text-[16px]">#</p>
          <p className="font-bold text-[16px] text-center">Bệnh nhân</p>
          <p className="font-bold text-[16px] text-center">Ngày & Ca</p>
          <p className="font-bold text-[16px] text-center">Bác sĩ</p>
          <p className="font-bold text-[16px] ml-7">Trạng thái</p>
        </div>

        {currentAppointments && currentAppointments.length > 0 ? (
          currentAppointments.map((item, index) => (
            <div
              className="flex flex-wrap justify-between max-sm:gap-2 sm:grid sm:grid-cols-[0.5fr_2fr_2fr_2fr_2fr] items-center text-gray-500 py-3 px-6 border-b hover:bg-gray-50"
              key={index}
            >
              <p className="max-sm:hidden font-bold">{index + 1}</p>
              <div className="flex items-center justify-center gap-2 text-[16px]">
                <p>{item.patientInfo.name}</p>
              </div>

              <p className="flex items-center justify-center gap-2 text-[16px]">
                {formatDate(item.work_date)}
                <span
                  className={`p-2 rounded-full text-white text-base text-center 
                  ${item.work_shift === "afternoon" ? "bg-orange-300" : "bg-blue-300"} shadow-lg max-w-[100px] w-full`}>
                  {item.work_shift === "morning" ? "Sáng" : "Chiều"}
                </span>
              </p>

              <div className="flex items-center justify-center gap-2 text-[16px]">
                <p>{item.doctorInfo.name}</p>
              </div>
              {item.status === "canceled" ? (
                <button className="bg-red-500 text-white text-xs font-medium px-2 py-1 rounded-full shadow-md hover:shadow-lg transition-all duration-300 max-w-[140px] h-10">
                  Đã hủy
                </button>
              ) : item.status === "confirmed" ? (
                <button className="bg-blue-500 text-white text-xs font-medium px-2 py-1 rounded-full shadow-md hover:shadow-lg transition-all duration-300 max-w-[140px] h-10">
                  Đã xác nhận
                </button>
              ) : item.status === "pending" ? (
                <button className="bg-yellow-500 text-white text-xs font-medium px-2 py-1 rounded-full shadow-md hover:shadow-lg transition-all duration-300 max-w-[140px] h-10">
                  Đang chờ xác nhận
                </button>
              ) : (
                <button className="bg-blue-500 text-white text-xs font-medium px-2 py-1 rounded-full shadow-md hover:shadow-lg transition-all duration-300 max-w-[140px] h-10">
                  Hoàn thành
                </button>
              )}
            </div>
          ))
        ) : (
          <p className="text-gray-500 py-3 px-4">Không tìm thấy cuộc hẹn nào.</p>
        )}
      </div>

      {/* Pagination - Only show if there are 10 or more appointments */}
      {appointments.length >= 10 && (
        <div className="flex justify-center gap-4 mt-4">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index}
              onClick={() => paginate(index + 1)}
              className={`px-4 py-2 rounded-md ${currentPage === index + 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllAppointments;
