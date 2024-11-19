import React, { useContext, useEffect, useState } from "react";
import { DoctorContext } from "../../context/DoctorContext";
import { useNavigate } from "react-router-dom";

const DoctorAppointments = () => {
  const { dToken, schedules, getDoctorSchedule, deleteSchedule } = useContext(DoctorContext);
  const [showModal, setShowModal] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [currentPage, setCurrentPage] = useState(1); // Trạng thái trang hiện tại
  const [schedulesPerPage] = useState(10); // Giới hạn số lịch mỗi trang
  const navigate = useNavigate();

  useEffect(() => {
    const doctorInfo = sessionStorage.getItem("doctorInfo");
    const doctorId = doctorInfo ? JSON.parse(doctorInfo).id : null;
    if (dToken && doctorId) {
      getDoctorSchedule(doctorId);
    }
  }, [dToken]);

  // Định dạng ngày
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB");
  };

  const handleDeleteClick = (schedule) => {
    setSelectedSchedule(schedule);
    setShowModal(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedSchedule) {
      await deleteSchedule(selectedSchedule._id);

      const updatedSchedules = schedules.filter(schedule => schedule._id !== selectedSchedule._id);

      if (updatedSchedules.length <= 10) {
        setCurrentPage(1);
        navigate(`/doctor-work-schedule`, { replace: true });
      } else {
        setShowModal(false);
        setSelectedSchedule(null);
      }
    }
  };

  useEffect(() => {
    setShowModal(false);
    setSelectedSchedule(null);
  }, [schedules]);

  // Logic phân trang
  const indexOfLastSchedule = currentPage * schedulesPerPage;
  const indexOfFirstSchedule = indexOfLastSchedule - schedulesPerPage;
  const currentSchedules = schedules.slice(indexOfFirstSchedule, indexOfLastSchedule);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    navigate(`/doctor-work-schedule?page=${pageNumber}`);
  };

  // Check if pagination is needed (only show if schedules length > 10)
  const shouldDisplayPagination = schedules.length > schedulesPerPage;

  return (
    <div className="w-full max-w-6xl m-5 shadow-lg">
      <p className="mb-4 text-lg font-medium">Tất cả lịch làm việc</p>

      <div className="bg-white border rounded text-sm max-h-[80vh] min-h-[50vh] overflow-y-scroll">
        {/* Table Header */}
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200 text-center">
              <th className="py-2 px-4 font-bold text-[16px]">#</th>
              <th className="py-2 px-4 font-bold text-[16px]">Ngày làm việc</th>
              <th className="py-2 px-4 font-bold text-[16px]">Ca làm việc</th>
              <th className="py-2 px-4 font-bold text-[16px]">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {/* Schedule Rows */}
            {currentSchedules && currentSchedules.length > 0 ? (
              currentSchedules.map((schedule, index) => (
                <tr key={schedule._id} className="hover:bg-gray-50">
                  <td className="py-3 px-4 text-center font-medium text-[16px]">
                    {index + 1 + (currentPage - 1) * schedulesPerPage}
                  </td>
                  <td className="py-3 px-4 text-center font-medium text-[16px]">
                    {formatDate(schedule.work_date)}
                  </td>
                  <td className="py-3 px-4 text-center w-[170px]">
                    <p className={`py-1 px-4 rounded-full text-white text-base font-semibold ${schedule.work_shift === "afternoon" ? "bg-orange-300" : "bg-blue-300"}`}>
                      {schedule.work_shift === "morning" ? "Sáng" : "Chiều"}
                    </p>
                  </td>
                  <td className="py-3 px-4 text-center flex items-center justify-center">
                    <div className="flex gap-3">
                      {/* Edit Icon */}
                      <svg
                        onClick={() => navigate(`/edit-work-schedule/${schedule._id}`)}
                        className="w-8 h-8 cursor-pointer text-blue-500 bg-blue-100 rounded-full p-2 transition-all shadow-lg"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M3.99 16.854l-1.314 3.504a.75.75 0 0 0 .966.965l3.503-1.314a3 3 0 0 0 1.068-.687L18.36 9.175s-.354-1.061-1.414-2.122c-1.06-1.06-2.122-1.414-2.122-1.414L4.677 15.786a3 3 0 0 0-.687 1.068zm12.249-12.63l1.383-1.383c.248-.248.579-.406.925-.348.487.08 1.232.322 1.934 1.025.703.703.945 1.447 1.025 1.934.058.346-.1.677-.348.925L19.774 7.76s-.353-1.06-1.414-2.12c-1.06-1.062-2.121-1.415-2.121-1.415z"
                          fill="#000000"
                        ></path>
                      </svg>

                      {/* Delete Icon */}
                      <svg
                        onClick={() => handleDeleteClick(schedule)}
                        className="w-8 h-8 cursor-pointer text-red-500 bg-red-100 rounded-full p-2 transition-all shadow-lg"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path
                          d="M5.755,20.283,4,8H20L18.245,20.283A2,2,0,0,1,16.265,22H7.735A2,2,0,0,1,5.755,20.283ZM21,4H16V3a1,1,0,0,0-1-1H9A1,1,0,0,0,8,3V4H3A1,1,0,0,0,3,6H21a1,1,0,0,0,0-2Z"
                          fill="#c42121"
                        ></path>
                      </svg>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="py-3 text-center text-gray-500">
                  Không có lịch làm việc nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {shouldDisplayPagination && (
        <div className="flex justify-center mt-4">
          {Array.from({ length: Math.ceil(schedules.length / schedulesPerPage) }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => paginate(index + 1)}
              className={`px-4 py-2 ${currentPage === index + 1 ? "bg-[#219c9e] text-white" : "bg-gray-200"
                } rounded-md mx-1 hover:bg-[#0091a1] hover:text-white`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      )}

      {/* Modal Confirmation for Deletion */}
      {showModal && selectedSchedule && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h2 className="text-xl font-semibold mb-4">Xác nhận xóa</h2>
            <p className="mb-4">
              Bạn có chắc chắn muốn xóa lịch làm việc buổi{" "}
              {selectedSchedule.work_shift === "afternoon" ? "Chiều" : "Sáng"} ngày{" "}
              {formatDate(selectedSchedule.work_date)} không?
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Hủy
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorAppointments;
