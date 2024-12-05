import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DoctorContext } from '../../context/DoctorContext';

const DoctorAppointments = () => {
  const { dToken, appointments, getAllAppointments } = useContext(DoctorContext);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false); // Thêm state loading
  const appointmentsPerPage = 10;
  const navigate = useNavigate();

  useEffect(() => {
    if (dToken) {
      setLoading(true); // Khi bắt đầu tải, set loading = true
      getAllAppointments().finally(() => {
        setLoading(false); // Khi dữ liệu được tải xong, set loading = false
      });
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
      <div className='bg-white border rounded-xl text-sm max-h-[80vh] min-h-[50vh] overflow-y-auto'>

        {/* Hiển thị spinner khi đang tải */}
        {loading && (
          <div className="flex justify-center items-center py-6">
            <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 border-solid rounded-full border-[#219c9e] border-t-transparent" role="status">
            </div>
          </div>
        )}

        {/* Header Row - Only for larger screens */}
        {!loading && (
          <div className='hidden sm:grid grid-cols-[0.5fr_1fr_1fr_0.5fr_0.7fr_auto] gap-4 py-4 px-6 bg-gray-200 border-b text-center'>
            <p className='font-bold text-[16px]'>#</p>
            <p className='font-bold text-[16px]'>Bệnh nhân</p>
            <p className='font-bold text-[16px]'>Ngày khám</p>
            <p className='font-bold text-[16px]'>Ca khám</p>
            <p className='font-bold text-[16px] justify-self-end mr-10'>Trạng thái</p>
          </div>
        )}

        {!loading && currentAppointments.length > 0 ? (
          currentAppointments.reverse().map((item, index) => (
            <div
              className='border-b hover:bg-gray-50 p-4 md:p-6'
              key={item._id}
            >
              <div className='md:grid md:grid-cols-[0.5fr_1fr_1fr_0.5fr_0.7fr_auto] items-center gap-4'>
                {/* Appointment number */}
                <p className='text-center font-bold md:col-span-1'>{index + 1 + (currentPage - 1) * appointmentsPerPage}</p>

                {/* Patient information */}
                <div className='flex flex-col gap-1 md:gap-0'>
                  <p className='text-base text-center md:text-center font-medium md:font-normal'>
                    <span className="md:hidden font-semibold">Bệnh nhân: </span>
                    {item.patient_id?.user_id?.name || 'Unknown'}
                  </p>
                  <div className='md:hidden'>
                    <p className='text-sm py-2 font-semibold'>Ngày khám: {formatDate(item.work_date)}</p>
                  </div>
                  <div className='md:hidden flex items-center'>
                    <p className='text-sm font-semibold'>Ca khám:</p>
                    <p
                      className={`py-0 ml-1 p-2 md:py-1 rounded-full text-white text-sm text-center max-w-[100px] 
                      ${item.work_shift === "afternoon" ? "bg-orange-300" : "bg-blue-300"} shadow-lg max-w-[70px] w-full`}
                    >
                      {item.work_shift === "morning" ? "Sáng" : "Chiều"}
                    </p>
                  </div>
                </div>

                {/* Desktop view */}
                <p className='text-base text-center hidden md:block'>
                  {formatDate(item.work_date)}
                </p>

                <div className='flex justify-center items-center'>
                  <p
                    className={`py-1 rounded-full text-white text-sm text-center max-w-[100px] hidden md:block 
                    ${item.work_shift === "afternoon" ? "bg-orange-300" : "bg-blue-300"} shadow-lg max-w-[100px] w-full`}
                  >
                    {item.work_shift === "morning" ? "Sáng" : "Chiều"}
                  </p>
                </div>

                {/* Status and Action Buttons */}
                <div className='flex flex-row gap-2 md:gap-3 justify-center md:justify-end mr-2'>
                  {item.status === "pending" && (
                    <button className='bg-yellow-400 text-white font-semibold py-1 px-4 rounded-full text-xs shadow-lg sm:text-sm w-[140px]'>
                      Đang chờ
                    </button>
                  )}
                  {item.status === "confirmed" && (
                    <button className='bg-green-500 text-white font-semibold py-1 px-4 rounded-full text-xs shadow-lg sm:text-sm w-[140px]'>
                      Đã xác nhận
                    </button>
                  )}
                  {item.status === "canceled" && (
                    <button className='bg-red-500 text-white font-semibold py-1 px-4 rounded-full text-xs shadow-lg sm:text-sm w-[140px]'>
                      Đã từ chối
                    </button>
                  )}
                  {item.status === "completed" && (
                    <button className='bg-blue-500 text-white font-semibold py-1 px-4 rounded-full text-xs shadow-lg sm:text-sm w-[140px]'>
                      Đã hoàn thành
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          !loading && <p className='text-gray-500 py-3 text-center'>Không có lịch hẹn nào!</p>
        )}
      </div>

      {/* Pagination */}
      {appointments.length > appointmentsPerPage && (
        <div className="flex justify-center mt-4">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => paginate(index + 1)}
              className={`px-4 py-2 ${currentPage === index + 1 ? 'bg-[#219c9e] text-white' : 'bg-gray-200'} rounded-md mx-1 hover:bg-[#0091a1] hover:text-white text-xs sm:text-sm`}
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