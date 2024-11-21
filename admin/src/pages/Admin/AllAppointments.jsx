import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AdminContext } from "../../context/AdminContext";
import { AppContext } from "../../context/AppContext";

const AllAppointments = () => {
  const { aToken, appointments, getAllAppointments } = useContext(AdminContext);
  const { calculateAge, slotDateFormat, currency } = useContext(AppContext);

  const [currentPage, setCurrentPage] = useState(1);
  const [appointmentsPerPage] = useState(10);

  const totalPages = Math.ceil(appointments.length / appointmentsPerPage);

  const navigate = useNavigate();

  useEffect(() => {
    if (aToken) {
      getAllAppointments();
    }
  }, [aToken]);

  const formatDate = (dateString) => {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', options);
  };

  const indexOfLastAppointment = currentPage * appointmentsPerPage;
  const indexOfFirstAppointment = indexOfLastAppointment - appointmentsPerPage;
  const currentAppointments = appointments.slice(indexOfFirstAppointment, indexOfLastAppointment);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    navigate(`/all-appointments?page=${pageNumber}`);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-4">
        <p className="text-3xl font-bold text-[#0091a1]">Tất cả các cuộc hẹn</p>
      </div>
      <div className="overflow-x-auto bg-white p-4 rounded-md shadow-md">
        {/* Bảng hiển thị */}
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="py-2 px-4">#</th>
              <th className="py-2 px-4">Bệnh nhân</th>
              <th className="py-2 px-4">Ngày khám</th>
              <th className="py-2 px-4">Ca</th>
              <th className="py-2 px-4">Bác sĩ</th>
              <th className="py-2 px-4">Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {currentAppointments && currentAppointments.length > 0 ? (
              currentAppointments.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  {/* Cột 1: Số thứ tự */}
                  <td className="py-3 px-4 text-center">{index + 1}</td>

                  {/* Cột 2: Bệnh nhân */}
                  <td className="py-3 px-4 text-center">
                    <p className="font-medium">{item.patientInfo.name}</p>
                  </td>

                  {/* Cột 3: Ngày khám */}
                  <td className="py-3 px-4 text-center">
                    <p className="text-gray-600">{new Date(item.work_date).toLocaleDateString()}</p>
                  </td>

                  {/* Cột 4: Ca làm việc */}
                  <td className="py-3 px-4 text-center">
                    <p className="flex items-center justify-center gap-2 text-[16px]">
                      <span
                        className={`py-1 px-4 rounded-full text-white text-base text-center font-semibold 
                  ${item.work_shift === "afternoon" ? "bg-orange-300" : "bg-blue-300"} shadow-lg max-w-[138px] w-full`}>
                        {item.work_shift === "morning" ? "Sáng" : "Chiều"}
                      </span>
                    </p>
                  </td>

                  {/* Cột 5: Bác sĩ */}
                  <td className="py-3 px-4 text-center">
                    <p>{item.doctorInfo.name}</p>
                  </td>

                  {/* Cột 6: Trạng thái */}
                  <td className="py-3 px-4 text-center">
                    {item.status === "canceled" ? (
                      <button className="bg-red-500 text-white text-base font-semibold py-1 px-4 rounded-full shadow-md hover:shadow-lg transition-all duration-300 w-[185px] h-[32px]">
                        Đã hủy
                      </button>
                    ) : item.status === "confirmed" ? (
                      <button className="bg-blue-500 text-white text-base font-semibold py-1 px-4 rounded-full shadow-md hover:shadow-lg transition-all duration-300 w-[185px] h-[32px]">
                        Đã xác nhận
                      </button>
                    ) : item.status === "pending" ? (
                      <button className="bg-yellow-400 text-white text-base font-semibold py-1 px-4 rounded-full shadow-md hover:shadow-lg transition-all duration-300 w-[185px] h-[32px]">
                        Đang chờ xác nhận
                      </button>
                    ) : (
                      <button className="bg-blue-500 text-white text-base font-semibold py-1 px-4 rounded-full shadow-md hover:shadow-lg transition-all duration-300 w-[185px] h-[32px]">
                        Hoàn thành
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-3 px-4 text-gray-500">
                  Không tìm thấy cuộc hẹn nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

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
