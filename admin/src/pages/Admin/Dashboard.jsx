import React, { useContext, useEffect, useState } from "react";
import { AdminContext } from "../../context/AdminContext";
import { assets } from "../../assets/assets";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const {
    aToken,
    getDashData,
    getAllPatients,
    getUpcomingApointmentsDashData,
    patient,
    doctors,
    getAllDoctors,
    dashUpApData,
    cancelAppointment,
    countAppointments,
    getCountAppointments,
    countPatient,
    countPatients
  } = useContext(AdminContext);

  // Dữ liệu doanh thu (giả định)
  const [revenueData, setRevenueData] = useState([
    { month: "Tháng 1", revenue: 1200 },
    { month: "Tháng 2", revenue: 1500 },
    { month: "Tháng 3", revenue: 1700 },
    { month: "Tháng 4", revenue: 1300 },
    { month: "Tháng 5", revenue: 2000 },
    { month: "Tháng 6", revenue: 1800 },
    { month: "Tháng 7", revenue: 2100 },
    { month: "Tháng 8", revenue: 2500 },
    { month: "Tháng 9", revenue: 2200 },
    { month: "Tháng 10", revenue: 2400 },
    { month: "Tháng 11", revenue: 2600 },
    { month: "Tháng 12", revenue: 2800 },
  ]);

  // Sử dụng useEffect để gọi API và lấy dữ liệu
  useEffect(() => {
    if (aToken) {
      getDashData();
      getAllPatients();
      getAllDoctors();
      getUpcomingApointmentsDashData();
      getCountAppointments();
      countPatients()
    }
  }, [aToken]);

  // Cấu hình biểu đồ
  const chartData = {
    labels: revenueData.map((item) => item.month),
    datasets: [
      {
        label: "Doanh thu (VND)",
        data: revenueData.map((item) => item.revenue),
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    indexAxis: "y",
    scales: {
      x: {
        beginAtZero: true,
        title: {
          display: true,
        },
      },
      y: {
        title: {
          display: true,
        },
      },
    },
    plugins: {
      legend: {
        display: true,
        position: "bottom",
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            let label = context.dataset.label || "";
            if (label) {
              label += ": ";
            }
            label += context.raw.toLocaleString();
            return label;
          },
        },
      },
    },
    title: {
      display: true,
      text: "Biểu đồ thống kê doanh thu hàng tháng",
      font: {
        size: 16,
        weight: "bold",
      },
    },
  };

  return (
    <div className="m-5 w-full shadow-lg">
      <div className="flex gap-3 w-full">
        {/* Hiển thị số lượng bác sĩ */}
        <div className="flex-1 min-w-0 bg-white p-4 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all flex items-center justify-center shadow-lg">
          <div className="text-center">
            <img className="w-14 mx-auto" src={assets.doctor_icon} alt="" />
            <p className="text-xl font-semibold text-gray-600">
              {doctors.length}
            </p>
            <p className="text-gray-400">Bác sĩ</p>
          </div>
        </div>

        {/* Hiển thị số lượng lịch hẹn */}
        <div className="flex-1 min-w-0 bg-white p-4 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all flex items-center justify-center shadow-lg">
          <div className="text-center">
            <img
              className="w-14 mx-auto"
              src={assets.appointment_icon}
              alt=""
            />
            <p className="text-xl font-semibold text-gray-600">
              {countAppointments.length}
            </p>
            <p className="text-gray-400">Lịch hẹn</p>
          </div>
        </div>

        {/* Hiển thị số lượng bệnh nhân */}
        <div className="flex-1 min-w-0 bg-white p-4 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all flex items-center justify-center shadow-lg">
          <div className="text-center">
            <img className="w-14 mx-auto" src={assets.patients_icon} alt="" />
            <p className="text-xl font-semibold text-gray-600">
              {countPatient.length}
            </p>
            <p className="text-gray-400">Bệnh nhân</p>
          </div>
        </div>
      </div>

      {/* Biểu đồ doanh thu */}
      <div className="pt-4 mt-10">
        <div className="h-96 flex items-center justify-center">
          <Bar data={chartData} options={options} />
        </div>
        {/* Giải thích phía dưới */}
        <div className="mt-4 text-center text-gray-600">
          <p className="text-sm font-bold">
            Biểu đồ thể hiện doanh thu hàng tháng trong năm 2024.
          </p>
        </div>
      </div>

      {/* Hiển thị lịch hẹn sắp tới */}
      <div className="pt-4">
        <div className="flex items-center gap-2.5 px-4 py-4 mt-10 rounded-t border">
          <img src={assets.list_icon} alt="" />
          <p className="font-semibold">Lịch hẹn sắp tới</p>
        </div>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="py-2 px-4">Thông tin bệnh nhân</th>
              <th className="py-2 px-4">Bác sĩ</th>
              <th className="py-2 px-4">Ca làm việc</th>
              <th className="py-2 px-4">Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {dashUpApData &&
              dashUpApData.map((item, index) => (
                <tr key={index} className="hover:bg-gray-100">
                  {/* Cột 1: Thông tin bệnh nhân */}
                  <td className="py-3 px-4 text-center">
                    <div className="flex flex-col text-sm">
                      <p className="text-gray-800 font-medium text-[16px]">
                        {item.patient_id.user_id.name}
                      </p>
                      <p className="text-gray-600">
                        {new Date(item.work_date).toLocaleDateString()}
                      </p>
                    </div>
                  </td>
                  {/* Cột 2: Tên bác sĩ */}
                  <td className="py-3 px-4 text-center">
                    <p className="text-gray-800 font-medium text-[16px]">
                      {item.doctor_id.user_id.name}
                    </p>
                  </td>
                  {/* Cột 3: Ca làm việc */}
                  <td className="py-3 px-4 text-center align-middle">
                    <div className="flex justify-center items-center">
                      <p
                        className={`py-1 px-4 rounded-full text-white text-base text-center font-semibold w-[138px] ${
                          item.work_shift === "afternoon"
                            ? "bg-orange-300"
                            : "bg-blue-300"
                        } shadow-lg`}
                      >
                        {item.work_shift === "afternoon" ? "Chiều" : "Sáng"}
                      </p>
                    </div>
                  </td>
                  {/* Cột 4: Trạng thái */}
                  <td className="py-3 px-4 text-center">
                    <div className="flex justify-center items-center">
                      <p
                        className={`py-1 px-4 rounded-full text-white text-base text-center font-semibold w-[186px] ${
                          item.status === "confirmed"
                            ? "bg-green-400"
                            : "bg-red-400"
                        } shadow-lg`}
                      >
                        {item.status === "confirmed"
                          ? "Đã xác nhận"
                          : "Chưa xác nhận"}
                      </p>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
