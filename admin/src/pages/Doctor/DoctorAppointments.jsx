import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DoctorContext } from '../../context/DoctorContext';
import { assets } from '../../assets/assets';

const DoctorAppointments = () => {
  const { dToken, appointments, getAllAppointments } = useContext(DoctorContext);
  const [currentPage, setCurrentPage] = useState(1);
  const appointmentsPerPage = 10;
  const navigate = useNavigate();

  useEffect(() => {
    if (dToken) {
      getAllAppointments();
    }
  }, [dToken]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB');
  };

  // Paginate appointments
  const indexOfLastAppointment = currentPage * appointmentsPerPage;
  const indexOfFirstAppointment = indexOfLastAppointment - appointmentsPerPage;
  const currentAppointments = appointments.slice(indexOfFirstAppointment, indexOfLastAppointment);

  // Handle pagination
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    navigate(`/doctor-appointments?page=${pageNumber}`);
  };

  // Calculate total pages
  const totalPages = Math.ceil(appointments.length / appointmentsPerPage);

  return (
    <div className='w-full max-w-6xl m-5 shadow-lg'>
      <p className='mb-4 text-lg font-medium'>Tất cả lịch hẹn:</p>
      <div className='bg-white border rounded text-sm max-h-[80vh] min-h-[50vh] overflow-y-scroll'>

        {/* Table Header */}
        <table className='w-full border-collapse'>
          <thead>
            <tr className='bg-gray-200 text-center'>
              <th className='py-2 px-4 font-bold text-[16px]'>#</th>
              <th className='py-2 px-4 font-bold text-[16px]'>Bệnh nhân</th>
              <th className='py-2 px-4 font-bold text-[16px]'>Ngày khám</th>
              <th className='py-2 px-4 font-bold text-[16px]'>Ca khám</th>
              <th className='py-2 px-4 font-bold text-[16px]'>Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {currentAppointments.length > 0 ? (
              currentAppointments.reverse().map((item, index) => (
                <tr key={item._id} className='hover:bg-gray-50'>
                  <td className='py-3 px-4 text-center font-medium text-[16px]'>{index + 1}</td>
                  <td className='py-3 px-4 text-center font-medium text-[16px]'>{item.patient_id?.user_id?.name || 'Unknown'}</td>
                  <td className='py-3 px-4 text-center font-medium text-[16px]'>{formatDate(item.work_date)}</td>
                  <td className='py-3 px-4 text-center'>
                    <p className={`py-1 px-4 rounded-full text-white text-base font-semibold ${item.work_shift === "afternoon" ? "bg-orange-300" : "bg-blue-300"}`}>
                      {item.work_shift === "morning" ? "Sáng" : "Chiều"}
                    </p>
                  </td>
                  <td className='py-3 px-4 text-center'>
                    <div className='flex justify-center gap-3'>
                      {item.status === "pending" && (
                        <button className='bg-yellow-400 text-white text-base font-semibold py-1 px-4 rounded-full shadow-lg w-[180px]'>
                          Đang chờ
                        </button>
                      )}
                      {item.status === "confirmed" && (
                        <button className='bg-green-500 text-white text-base font-semibold py-1 px-4 rounded-full shadow-lg w-[180px]'>
                          Đã xác nhận
                        </button>
                      )}
                      {item.status === "canceled" && (
                        <button className='bg-red-500 text-white text-base font-semibold py-1 px-4 rounded-full shadow-lg w-[180px]'>
                          Đã từ chối
                        </button>
                      )}
                      {item.status === "completed" && (
                        <button className='bg-blue-500 text-white text-base font-semibold py-1 px-4 rounded-full shadow-lg w-[180px]'>
                          Đã hoàn thành
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className='py-3 text-center text-gray-500'>
                  Không có lịch hẹn nào!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {appointments.length > appointmentsPerPage && (
        <div className="flex justify-center mt-4">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => paginate(index + 1)}
              className={`px-4 py-2 ${currentPage === index + 1 ? 'bg-[#219c9e] text-white' : 'bg-gray-200'} rounded-md mx-1 hover:bg-[#0091a1] hover:text-white`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default DoctorAppointments;
