import React, { useContext, useEffect } from "react";
import { AdminContext } from "../../context/AdminContext";
import { AppContext } from "../../context/AppContext";
import { assets } from "../../assets/assets";

const AllAppointments = () => {
  const { aToken, appointments, getAllAppointments, cancelAppointment } =
    useContext(AdminContext);
  const { calculateAge, slotDateFormat, currency } = useContext(AppContext);

  useEffect(() => {
    if (aToken) {
      getAllAppointments();
    }
  }, [aToken]);

  // Hàm để định dạng ngày
  const formatDate = (dateString) => {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', options);
  };

  return (
    <div className="w-full max-w-6xl m-5">
      <p className="mb-3 text-lg font-medium">Tất cả các cuộc hẹn</p>
      <div className="bg-white border rounded text-sm max-h-[80vh] min-h-[60vh] overflow-y-scroll">
        <div className="hidden sm:grid grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] grid-flow-col py-3 px-6 border-b">
          <p>#</p>
          <p>Bệnh nhân</p>
          <p>Ngày & Ca </p>
          <p>Bác sĩ</p>
          <p>Trạng thái</p>
        </div>

        {appointments && appointments.length > 0 ? (
          appointments.map((item, index) => (
            <div
              className="flex flex-wrap justify-between max-sm:gap-2 sm:grid sm:grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] items-center text-gray-500 py-3 px-6 border-b hover:bg-gray-50"
              key={index}
            >
              <p className="max-sm:hidden">{index + 1}</p>
              <div className="flex items-center gap-2">
                <p>{item.patientInfo.name}</p>
              </div>
              <p>
                {formatDate(item.work_date)}, {item.work_shift}
              </p>
              <div className="flex items-center gap-2">
                <img
                  className="w-8 rounded-full bg-gray-200"
                  src={item.doctorInfo.image}
                  alt=""
                />
                <p>{item.doctorInfo.name}</p>
              </div>
              {item.status === "canceled" ? (
                <p className="text-red-400 text-xs font-medium">Đã hủy</p>
              ) : item.status === "confirmed" ? (
                <p className="text-green-500 text-xs font-medium">Đã xác nhận</p>
              ) : item.status === "pending" ? (
                <p className="text-yellow-500 text-xs font-medium">Đang chờ xác nhận</p>
              ) : (
                <p className="text-blue-500 text-xs font-medium">Hoàn thành</p>
              )}
            </div>
          ))
        ) : (
          <p className="text-gray-500 py-3 px-4">Không tìm thấy cuộc hẹn nào.</p>
        )}
      </div>
    </div>
  );
};

export default AllAppointments;
