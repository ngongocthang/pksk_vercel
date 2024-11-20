import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { DoctorContext } from '../../context/DoctorContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ConfirmationSchedule = () => {
  const { dToken, appointments, getAppointments, completeAppointment, cancelAppointment } = useContext(DoctorContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [currentPage, setCurrentPage] = useState(1);
  const appointmentsPerPage = 10;

  useEffect(() => {
    if (dToken) {
      getAppointments();
    }
  }, [dToken]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB');
  };

  // Filter pending appointments
  const pendingAppointments = appointments.filter(
    (appointment) => !appointment.isCompleted && !appointment.cancelled && appointment.status === "pending"
  );

  useEffect(() => {
    if (location.state?.successMessage) {
      toast.success(location.state.successMessage);
    }
  }, [location.state]);

  // Set current page based on URL query parameter
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const page = parseInt(params.get('page')) || 1;
    setCurrentPage(page);
  }, [location.search]);

  // Pagination calculations
  const indexOfLastAppointment = currentPage * appointmentsPerPage;
  const indexOfFirstAppointment = indexOfLastAppointment - appointmentsPerPage;
  const currentAppointments = pendingAppointments.slice(indexOfFirstAppointment, indexOfLastAppointment);
  const totalPages = Math.ceil(pendingAppointments.length / appointmentsPerPage);

  // Redirect to the main page when exactly 10 pending appointments remain
  useEffect(() => {
    if (pendingAppointments.length === 10) {
      navigate('/confirmation-schedule');
    }
  }, [appointments, navigate]);

  // Handle page change and update URL
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    navigate(`/confirmation-schedule?page=${pageNumber}`);
  };

  return (
    <div className="w-full max-w-6xl m-5 shadow-lg">
      <p className="mb-4 text-lg font-medium">Các lịch hẹn chờ xác nhận:</p>

      <div className="bg-white border rounded text-sm max-h-[80vh] min-h-[50vh] overflow-y-scroll">
        {/* Table Header */}
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200 text-center">
              <th className="py-2 px-4 font-bold text-[16px]">#</th>
              <th className="py-2 px-4 font-bold text-[16px]">Bệnh nhân</th>
              <th className="py-2 px-4 font-bold text-[16px]">Ngày khám</th>
              <th className="py-2 px-4 font-bold text-[16px]">Ca khám</th>
              <th className="py-2 px-4 font-bold text-[16px]">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {/* Appointment Rows */}
            {currentAppointments.length > 0 ? (
              currentAppointments.map((item, index) => (
                <tr key={item._id} className="hover:bg-gray-50">
                  <td className="py-3 px-4 text-center font-medium text-[16px]">
                    {index + 1 + (currentPage - 1) * appointmentsPerPage}
                  </td>
                  <td className="py-3 px-4 text-center font-medium text-[16px]">{item.patient_id.user_id.name}</td>
                  <td className="py-3 px-4 text-center font-medium text-[16px]">{formatDate(item.work_date)}</td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center">
                      <p
                        className={`py-1 px-4 rounded-full text-white text-base font-semibold w-[138px] ${item.work_shift === "afternoon" ? "bg-orange-300" : "bg-blue-300"}`}
                      >
                        {item.work_shift === "morning" ? "Sáng" : "Chiều"}
                      </p>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex justify-center gap-3">
                      {/* Complete Icon */}
                      <svg
                        onClick={() => completeAppointment(item._id)}
                        className="w-[30px] h-[30px] cursor-pointer bg-green-500 p-2 rounded-full shadow-lg"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M5 13l4 4L19 7" />
                      </svg>

                      {/* Cancel Icon */}
                      <svg
                        onClick={() => cancelAppointment(item._id)}
                        className="w-[30px] h-[30px] cursor-pointer bg-red-500 p-2 rounded-full shadow-lg"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M18 6L6 18" />
                        <path d="M6 6l12 12" />
                      </svg>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="py-3 text-center text-gray-500">
                  Không có lịch hẹn nào chờ được xác nhận.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pendingAppointments.length > appointmentsPerPage && (
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

export default ConfirmationSchedule;
