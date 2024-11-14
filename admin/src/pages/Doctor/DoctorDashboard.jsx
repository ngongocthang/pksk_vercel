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
    <div className="m-5 w-full shadow-lg">
      {/* Overview Section */}
      <div className="flex gap-3 w-full">
        <div className="flex-1 min-w-0 bg-white p-4 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all flex items-center justify-center shadow-lg">
          <div className="text-center">
            <img className="w-14 mx-auto" src={assets.earning_icon} alt="" />
            <p className="text-xl font-semibold text-gray-600">1.900.000</p>
            <p className="text-gray-400">Thu nhập</p>
          </div>
        </div>

        <div className="flex-1 min-w-0 bg-white p-4 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all flex items-center justify-center shadow-lg">
          <div className="text-center">
            <img className="w-10 mx-auto" src={assets.appointment_icon} alt="" />
            <div>
              <p className="text-xl font-semibold text-gray-600">
                {countCompletedAppointments()}
              </p>
              <p className="text-gray-400">Lịch hẹn hoàn thành</p>
            </div>
          </div>
        </div>

        <div className="flex-1 min-w-0 bg-white p-4 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all flex items-center justify-center shadow-lg">
          <div className="text-center">
            <img className="w-14 mx-auto" src={assets.patients_icon} alt="" />
            <div>
              <p className="text-xl font-semibold text-gray-600">{appointments.length}</p>
              <p className="text-gray-400">Bệnh nhân</p>
            </div>
          </div>
        </div>
      </div>

      {/* Appointment List Section */}
      <div className="flex gap-4 bg-white mt-5">
        {/* Latest Bookings */}
        <div className="flex-1">
          <div className="flex items-center gap-2.5 px-4 py-4 rounded-t border">
            <img src={assets.list_icon} alt="" />
            <p className="font-semibold">Lịch hẹn sắp tới</p>
          </div>

          <div className="pt-4 border border-t-0">
            {appointments.map((item) => (
              <div
                className="flex items-center px-6 py-3 gap-4 hover:bg-gray-100"
                key={item._id}
              >
                <div className="flex-1 text-sm">
                  <p className="text-gray-800 font-medium text-[16px]">{item.patient_name}</p>
                  <p className="text-gray-600">
                    {new Date(item.work_date).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex-1 flex justify-center items-center">
                  <p
                    className={`p-2 rounded-full text-white text-base text-center 
                    ${item.work_shift === "afternoon" ? "bg-orange-300" : "bg-blue-300"} 
                    shadow-lg max-w-[100px] w-full`}
                  >
                    {item.work_shift === "morning" ? "Sáng" : "Chiều"}
                  </p>
                </div>

                <div className="flex-1 flex justify-center items-center">
                  {item.status === "canceled" ? (
                    <button className='bg-red-500 text-white font-semibold py-1 px-4 rounded-full'>Đã từ chối</button>
                  ) : (
                    <button className='bg-green-500 text-white font-semibold py-1 px-4 rounded-full'>Đã xác nhận</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Status Bookings */}
        <div className="flex-1">
          <div className="flex items-center gap-2.5 px-4 py-4 rounded-t border">
            <img src={assets.list_icon} alt="" />
            <p className="font-semibold">Lịch hẹn đã xác nhận & hoàn thành</p>
          </div>

          <div className="pt-4 border border-t-0">
            {appointmentStatus.map((item) => (
              <div
                className="grid grid-cols-3 gap-4 px-6 py-3 hover:bg-gray-100"
                key={item._id}
              >
                <div className="flex flex-col text-sm">
                  <p className="text-gray-800 font-medium text-[16px]">{item.patient_name}</p>
                  <p className="text-gray-600">
                    {new Date(item.work_date).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex justify-center items-center">
                  <p
                    className={`p-2 rounded-full text-white text-base text-center 
                    ${item.work_shift === "afternoon" ? "bg-orange-300" : "bg-blue-300"} 
                    shadow-lg max-w-[100px] w-full`}
                  >
                    {item.work_shift === "morning" ? "Sáng" : "Chiều"}
                  </p>
                </div>

                <div className="flex justify-center items-center">
                  {item.status === "completed" ? (
                    <button className='bg-blue-500 text-white font-semibold py-1 px-4 rounded-full'>Đã hoàn thành</button>
                  ) : (
                    <button className='bg-green-500 text-white font-semibold py-1 px-4 rounded-full'>Đã xác nhận</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
