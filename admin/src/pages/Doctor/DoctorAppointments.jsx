import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DoctorContext } from '../../context/DoctorContext';

const DoctorAppointments = () => {
  const { dToken, appointments, getAllAppointments } = useContext(DoctorContext);
  const [currentPage, setCurrentPage] = useState(1);
  const appointmentsPerPage = 10;
  const navigate = useNavigate();

  useEffect(() => {
    if (dToken) {
      getAllAppointments();
    }
  }, [dToken, getAllAppointments]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB');
  };

  // Phân trang lịch hẹn
  const indexOfLastAppointment = currentPage * appointmentsPerPage;
  const indexOfFirstAppointment = indexOfLastAppointment - appointmentsPerPage;
  const currentAppointments = appointments.slice(indexOfFirstAppointment, indexOfLastAppointment);

  // Xử lý phân trang
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    navigate(`/doctor-appointments?page=${pageNumber}`);
  };

  // Tính tổng số trang
  const totalPages = Math.ceil(appointments.length / appointmentsPerPage);

  const renderPagination = () => {
    const delta = 1; // Số trang hiển thị trước và sau trang hiện tại
    const paginationItems = [];

    // Nút "Trang trước"
    paginationItems.push(
      <button
        key="prev"
        onClick={() => paginate(Math.max(1, currentPage - 1))}
        className={`py-1 px-3 border rounded w-[70px] ${currentPage === 1 ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "text-gray-600"
          }`}
        disabled={currentPage === 1}
      >
        Trước
      </button>
    );

    // Hiển thị trang 1
    paginationItems.push(
      <button
        key={1}
        onClick={() => paginate(1)}
        className={`py-1 px-3 border rounded ${currentPage === 1 ? "bg-indigo-500 text-white" : "text-gray-600"
          }`}
      >
        1
      </button>
    );

    // Hiển thị dấu ba chấm nếu cần, khi currentPage > 3
    if (currentPage > 2) {
      paginationItems.push(
        <span key="start-dots" className="px-2">
          ...
        </span>
      );
    }

    // Hiển thị các trang xung quanh trang hiện tại
    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      paginationItems.push(
        <button
          key={i}
          onClick={() => paginate(i)}
          className={`py-1 px-3 border rounded ${i === currentPage ? "bg-indigo-500 text-white" : "text-gray-600"
            }`}
        >
          {i}
        </button>
      );
    }

    // Hiển thị dấu ba chấm nếu cần, khi currentPage < totalPages - 1
    if (currentPage < totalPages - 1) {
      paginationItems.push(
        <span key="end-dots" className="px-2">
          ...
        </span>
      );
    }

    // Hiển thị trang cuối
    if (totalPages > 1) {
      paginationItems.push(
        <button
          key={totalPages}
          onClick={() => paginate(totalPages)}
          className={`py-1 px-3 border rounded ${currentPage === totalPages ? "bg-indigo-500 text-white" : "text-gray-600"
            }`}
        >
          {totalPages}
        </button>
      );
    }

    // Nút "Trang tiếp theo"
    paginationItems.push(
      <button
        key="next"
        onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
        className={`py-1 px-3 border rounded w-[70px] ${currentPage === totalPages ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "text-gray-600"
          }`}
        disabled={currentPage === totalPages}
      >
        Tiếp
      </button>
    );

    return (
      <div className="flex justify-center items-center mt-6 space-x-2">
        {paginationItems}
      </div>
    );
  };
  return (
    <div className='w-full max-w-6xl m-5'>
      <p className='mb-4 text-lg font-medium'>Tất cả lịch hẹn:</p>
      <div className='bg-white border rounded-xl text-sm max-h-[80vh] min-h-[50vh] overflow-y-scroll'>

        {/* Header Row - Only for larger screens */}
        <div className='grid-cols-[0.5fr_1.5fr_2fr_0.5fr_2fr_1fr] bg-gray-200 py-3 px-6 border-b sm:grid hidden'>
          <p className='font-bold text-[16px] text-center'>#</p>
          <p className='font-bold text-[16px] text-center'>Bệnh nhân</p>
          <p className='font-bold text-[16px] text-center'>Ngày khám</p>
          <p className='font-bold text-[16px]'>Ca khám</p>
          <p className='font-bold text-[16px] ml-auto mr-7'>Trạng thái</p>
        </div>

        {currentAppointments.length > 0 ? (
          currentAppointments.reverse().map((item, index) => (
            <div
              className='flex flex-col sm:grid sm:grid-cols-[0.5fr_1.5fr_2fr_0.5fr_2fr_1fr] text-gray-500 py-3 px-6 border-b hover:bg-gray-50'
              key={item._id}
            >
              <div className="sm:block text-center font-bold">
                <p className='font-bold'>{index + 1 + (currentPage - 1) * appointmentsPerPage}</p>
              </div>

              <div className="text-left sm:text-center">
                <p className='text-base md:text-center font-medium md:font-normal'>
                  <span className="md:hidden font-semibold">Bệnh nhân: </span>
                  {item.patient_id?.user_id?.name || 'Unknown'}
                </p>
              </div>

              <div className="text-left sm:text-center">
                <p className='text-base'>
                  <span className="md:hidden text-sm font-semibold">Ngày khám: </span>
                  {formatDate(item.work_date)}
                </p>
              </div>

              <div className='flex justify-center items-center'>
                <p className={`py-1 rounded-full text-white text-sm text-center max-w-[100px] hidden md:block 
                ${item.work_shift === "afternoon" ? "bg-orange-300" : "bg-blue-300"} shadow-lg max-w-[100px] w-full`}>
                  {item.work_shift === "morning" ? "Sáng" : "Chiều"}
                </p>
              </div>

              <div className='flex gap-3 justify-start sm:justify-self-end'>
                <span className="md:hidden text-sm font-semibold">Trạng thái: </span>
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
          ))
        ) : (
          <p className='text-gray-500 py-3 text-center'>Không có lịch hẹn nào!</p>
        )}
      </div>

      {/* Pagination - Centered and responsive */}
      {appointments.length > appointmentsPerPage && renderPagination()}
    </div>
  );
};

export default DoctorAppointments;