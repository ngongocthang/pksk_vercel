import React, { useContext, useEffect } from "react";
import { AdminContext } from "../../context/AdminContext";
import { assets } from "../../assets/assets";

const Dashboard = () => {
  const {
    aToken,
    getDashData,
    getAllAppointments,
    getAllPatients,
    getUpcomingApointmentsDashData,
    appointments,
    patient,
    dashUpApData,
    cancelAppointment,
  } = useContext(AdminContext);

  useEffect(() => {
    if (aToken) {
      getDashData();
      getAllAppointments();
      getAllPatients();
      getUpcomingApointmentsDashData();
    }
  }, [aToken]);

  return (
    <div className="m-5">
      <div className="flex flex-wrap gap-3">
        {/* Hiển thị số lượng bác sĩ */}
        <div className="flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all">
          <img className="w-14" src={assets.doctor_icon} alt="" />
          <div>
            <p className="text-xl font-semibold text-gray-600">
              {Array.isArray(dashUpApData) ? dashUpApData.length : 0}
            </p>
            <p className="text-gray-400">Bác sĩ</p>
          </div>
        </div>

        {/* Hiển thị số lượng lịch hẹn */}
        <div className="flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all">
          <img className="w-10" src={assets.appointment_icon} alt="" />
          <div>
            <p className="text-xl font-semibold text-gray-600">
              {appointments.length}
            </p>
            <p className="text-gray-400">Lịch hẹn</p>
          </div>
        </div>

        {/* Hiển thị số lượng bệnh nhân */}
        <div className="flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all">
          <img className="w-14" src={assets.patients_icon} alt="" />
          <div>
            <p className="text-xl font-semibold text-gray-600">
              {patient.length}
            </p>
            <p className="text-gray-400">Bệnh nhân</p>
          </div>
        </div>
      </div>

      <div className="bg-white">
        <div className="flex items-center gap-2.5 px-4 py-4 mt-10 rounded-t border">
          <img src={assets.list_icon} alt="" />
          <p className="font-semibold">Lịch hẹn sắp tới</p>
        </div>

        <div className="pt-4 border border-t-0">
          {dashUpApData &&
            dashUpApData.map((item, index) => (
              <div className="flex items-center px-6 py-3 gap-3 hover:bg-gray-100" key={index}>
                <p>{item.patient_id.user_id.name}</p>
                <img
                  className="rounded-full w-10"
                  src={item.doctor_id.user_id.image}
                  alt=""
                />
                <div className="flex-1 text-sm">
                  <p className="text-gray-800 font-medium">
                    {item.doctor_id.user_id.name}
                  </p>
                  <p className="text-gray-600">
                    {new Date(item.work_date).toLocaleString()}
                  </p>
                </div>
                <p>{item.work_shift}</p>
                {item.status === "confirmed" ? (
                  <p className="text-green-500 text-xs font-medium">
                    Đã xác nhận
                  </p>
                ) : (
                  <p className="text-red-400 text-xs font-medium">Đã hủy</p>
                )}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
