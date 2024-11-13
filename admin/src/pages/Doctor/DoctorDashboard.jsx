// DoctorDashboard
import React, { useContext, useEffect } from "react";
import { DoctorContext } from "../../context/DoctorContext";
import { assets } from "../../assets/assets";

const DoctorDashboard = () => {
  const {
    dToken,
    showUpcomingAppointments,
    appointments,
    getAppointmentsByStatus,
    appointmentStatus,
  } = useContext(DoctorContext);

  useEffect(() => {
    if (dToken) {
      const doctorInfo = JSON.parse(sessionStorage.getItem("doctorInfo"));
      const userId = doctorInfo ? doctorInfo.id : null;
      if (userId) {
        showUpcomingAppointments(userId);
        getAppointmentsByStatus(userId);
      }
    }
  }, [dToken]);

  // Hàm đếm số lượng cuộc hẹn đã hoàn thành
  const countCompletedAppointments = () => {
    return appointmentStatus.filter(item => item.status === "completed").length;
  };

  return (
    <div className="m-5">
      {/* Overview Section */}
      <div className="flex flex-wrap gap-3">
        <div className="flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all">
          <img className="w-14" src={assets.earning_icon} alt="" />
          <div>
            <p className="text-xl font-semibold text-gray-600">1.900.000</p>
            <p className="text-gray-400">Earnings</p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all">
          <img className="w-10" src={assets.appointment_icon} alt="" />
          <div>
            <p className="text-xl font-semibold text-gray-600">
              {countCompletedAppointments()}
            </p>
            <p className="text-gray-400">Lịch hẹn hoàn thành</p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all">
          <img className="w-14" src={assets.patients_icon} alt="" />
          <div>
            <p className="text-xl font-semibold text-gray-600">{appointments.length}</p>
            <p className="text-gray-400">Bệnh nhân</p>
          </div>
        </div>
      </div>

      {/* Appointment List Section */}
      <div className="bg-white mt-5">
        <div className="flex items-center gap-2.5 px-4 py-4 rounded-t border">
          <img src={assets.list_icon} alt="" />
          <p className="font-semibold">Latest Bookings</p>
        </div>

        <div className="pt-4 border border-t-0 w-[960px]">
          {appointments.map((item) => (
            <div
              className="flex items-center px-6 py-3 gap-3 hover:bg-gray-100"
              key={item._id}
            >
              <div className="flex-1 text-sm">
                <p className="text-gray-800 font-medium">{item.patient_name}</p>
                <p className="text-gray-600">
                  {new Date(item.work_date).toLocaleDateString()}
                </p>
              </div>
              <p>{item.work_shift}</p>
              {item.status === "canceled" ? (
                <p className="text-red-400 text-xs font-medium">Cancelled</p>
              ) : (
                <p className="text-green-500 text-xs font-medium">Confirmed</p>
              )}
            </div>
          ))}
        </div>
      </div>
      {/* Appointment Status Section */}
      <div className="bg-white mt-5">
        <div className="flex items-center gap-2.5 px-4 py-4 rounded-t border">
          <img src={assets.list_icon} alt="" />
          <p className="font-semibold">Status Bookings</p>
        </div>
        <div className="pt-4 border border-t-0 w-[960px]">
          {appointmentStatus.map((item) => (
            <div
              className="flex items-center px-6 py-3 gap-3 hover:bg-gray-100"
              key={item._id}
            >
              <div className="flex-1 text-sm">
                <p className="text-gray-800 font-medium">{item.patient_name}</p>
                <p className="text-gray-600">
                  {new Date(item.work_date).toLocaleDateString()}
                </p>
              </div>
              <p>{item.work_shift}</p>
              {item.status === "completed" ? (
                <p className="text-blue-500 text-xs font-medium">Hoàn thành</p>
              ) : (
                <p className="text-green-500 text-xs font-medium">Xác nhận</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
