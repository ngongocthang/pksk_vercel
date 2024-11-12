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
    <div className='w-full max-w-6xl m-5'>
      <p className='mb-4 text-lg font-medium'>Tất cả lịch hẹn:</p>
      <div className='bg-white border rounded text-sm max-h-[80vh] min-h-[50vh] overflow-y-scroll'>

        {/* Header Row */}
        <div className='max-sm:hidden grid grid-cols-[0.5fr_2fr_1fr_1fr_2fr_auto] gap-4 py-4 px-6 border-b text-center'>
          <p className='font-bold text-[16px]'>#</p>
          <p className='font-bold text-[16px]'>Bệnh nhân</p>
          <p className='font-bold text-[16px]'>Ngày khám</p>
          <p className='font-bold text-[16px]'>Ca khám</p>
          <p className='font-bold text-[16px] justify-self-end'>Trạng thái</p>
        </div>

        {/* Appointment Rows */}
        {currentAppointments.length > 0 ? (
          currentAppointments.reverse().map((item, index) => (
            <div className='grid grid-cols-[0.5fr_2fr_1fr_1fr_2fr_auto] items-center gap-4 py-4 px-6 border-b hover:bg-gray-50' key={item._id}>
              <p className='max-sm:hidden text-center font-bold'>{index + 1}</p>
              <p className='text-base text-center'>{item.patient_id.user_id.name}</p>
              <p className='text-base text-center'>{formatDate(item.work_date)}</p>
              <div className='flex justify-center items-center'>
                <p
                  className={`p-2 rounded-full text-white text-base text-center 
                  ${item.work_shift === "afternoon" ? "bg-orange-300" : "bg-blue-300"} shadow-lg max-w-[100px] w-full`}>
                  {item.work_shift === "morning" ? "Sáng" : "Chiều"}
                </p>
              </div>
              <div className='flex gap-3 justify-self-end'>
                {item.status === "pending" && (
                  <button className='bg-yellow-400 text-white font-semibold py-1 px-4 rounded-full'>Đang chờ</button>
                )}
                {item.status === "confirmed" && (
                  <button className='bg-green-500 text-white font-semibold py-1 px-4 rounded-full'>Đã xác nhận</button>
                )}
                {item.status === "canceled" && (
                  <button className='bg-red-500 text-white font-semibold py-1 px-4 rounded-full'>Đã từ chối</button>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className='text-gray-500 py-3 text-center'>Không có lịch hẹn nào!</p>
        )}
      </div>

      {/* Pagination */}
      {appointments.length > appointmentsPerPage && (
        <div className="flex justify-center mt-4">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => paginate(index + 1)}
              className={`px-4 py-2 ${currentPage === index + 1 ? 'bg-[#219c9e] text-white' : 'bg-gray-200'} rounded-md mx-1 hover:bg-[#0091a1]`}
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
