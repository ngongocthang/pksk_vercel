import React, { useContext, useEffect, useState } from "react";
import { DoctorContext } from "../../context/DoctorContext";
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

// Register chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const DoctorDashboard = () => {
  const {
    dToken,
    showUpcomingAppointments,
    appointments,
    getAppointmentsByStatus,
    appointmentStatus,
  } = useContext(DoctorContext);

  const [monthlyData, setMonthlyData] = useState([]);

  useEffect(() => {
    if (dToken) {
      const doctorInfo = JSON.parse(sessionStorage.getItem("doctorInfo"));
      const userId = doctorInfo ? doctorInfo.id : null;
      if (userId) {
        showUpcomingAppointments(userId);
        getAppointmentsByStatus(userId);
      }

      // Fetch statistics from the API
      fetchAppointmentsData(userId);
    }
  }, [dToken]);

  // Fetch data from API and set monthlyData
  const fetchAppointmentsData = async (userId) => {
    try {
      const response = await fetch(`http://localhost:5000/get-data-doctor-dashboard/${userId}`);
      const data = await response.json();

      if (data.success) {
        const formattedData = formatMonthlyData(data.appointments);
        setMonthlyData(formattedData);
      }
    } catch (error) {
      console.error("Error fetching appointments data:", error);
    }
  };

  // Format data for chart
  const formatMonthlyData = (appointments) => {
    const months = Array(12).fill(0).map((_, index) => ({
      month: index + 1,
      completed: 0,
      canceled: 0,
      pending: 0,
      confirmed: 0,
    }));

    appointments.forEach((appointment) => {
      const monthIndex = appointment.month - 1; // Adjust for 0-based index
      if (monthIndex >= 0 && monthIndex < 12) {
        switch (appointment.status) {
          case "completed":
            months[monthIndex].completed += appointment.count;
            break;
          case "canceled":
            months[monthIndex].canceled += appointment.count;
            break;
          case "pending":
            months[monthIndex].pending += appointment.count;
            break;
          case "confirmed":
            months[monthIndex].confirmed += appointment.count;
            break;
          default:
            break;
        }
      }
    });

    return months.map((month) => [
      month.completed,
      month.canceled,
      month.pending,
      month.confirmed,
    ]);
  };

  // Prepare chart data and options together
  const chartData = {
    labels: [
      "Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6",
      "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"
    ],
    datasets: [
      {
        label: "Hoàn thành",
        data: monthlyData.map((month) => month[0]),
        backgroundColor: "rgba(54, 162, 235, 0.5)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
      {
        label: "Đã hủy",
        data: monthlyData.map((month) => month[1]),
        backgroundColor: "rgba(255, 99, 132, 0.5)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
      },
      {
        label: "Đang chờ xử lý",
        data: monthlyData.map((month) => month[2]),
        backgroundColor: "rgba(255, 159, 64, 0.5)",
        borderColor: "rgba(255, 159, 64, 1)",
        borderWidth: 1,
      },
      {
        label: "Được xác nhận",
        data: monthlyData.map((month) => month[3]),
        backgroundColor: "rgba(75, 192, 192, 0.5)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: "Biểu đồ thống kê cuộc hẹn trong năm",
        position: "bottom",
        font: {
          size: 16,
          weight: "bold",
        },
      },
      legend: {
        position: "bottom",
        labels: {
          boxWidth: 15,
          padding: 10,
        },
      },
    },
    layout: {
      padding: {
        top: 80,
        bottom: 80,
        left: 10,
        right: 10,
      },
    },
    scales: {
      x: {
        ticks: {
          maxRotation: 45,
          minRotation: 45,
        },
      },
      y: {
        min: 0,
        max: 100,
        ticks: {
          stepSize: 20,
        },
      },
    },
  };

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
              <p className="text-xl font-semibold text-gray-600">{countCompletedAppointments()}</p>
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

      {/* Appointment Statistics Chart */}
      <div className="mt-5 flex justify-center">
        <div
          className="bg-white p-4 rounded-lg border-2 border-gray-100 cursor-pointer transition-all duration-300 flex items-center justify-center shadow-lg w-full h-full"
        >
          <Bar data={chartData} options={chartOptions} style={{ width: "70%", height: "500px" }} />
        </div>
      </div>

      {/* Appointment List Section */}
      <div className="flex gap-4 bg-white mt-5 mb-4 px-2">
        {/* Latest Bookings */}
        <div className="flex-1 bg-white p-4 rounded-lg">
          <div className="flex items-center gap-2.5 px-4 py-4 rounded-t">
            <img src={assets.list_icon} alt="" />
            <p className="font-semibold">Lịch hẹn sắp tới</p>
          </div>

          <div className="pt-4">
            <table className="w-full text-sm bg-white shadow-md rounded-lg overflow-hidden">
              {/* Table Header */}
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-3 px-5 text-left text-gray-700 font-semibold">Bệnh nhân</th>
                  <th className="py-3 px-5 text-center text-gray-700 font-semibold">Ngày khám</th>
                  <th className="py-3 px-5 text-center text-gray-700 font-semibold">Ca khám</th>
                  <th className="py-3 px-5 text-center text-gray-700 font-semibold">Trạng thái</th>
                </tr>
              </thead>

              {/* Table Body */}
              <tbody>
                {appointments.map((item) => (
                  <tr key={item._id} className="hover:bg-gray-50 transition-all duration-200">
                    <td className="py-4 px-5 text-left font-medium text-gray-800">{item.patient_name}</td>
                    <td className="py-4 px-5 text-center text-gray-600">{new Date(item.work_date).toLocaleDateString()}</td>
                    <td className="py-4 px-5 text-center">
                      <p
                        className={`py-1 px-4 rounded-full text-white text-base font-semibold ${item.work_shift === "afternoon" ? "bg-orange-400" : "bg-blue-400"} shadow-md`}
                      >
                        {item.work_shift === "morning" ? "Sáng" : "Chiều"}
                      </p>
                    </td>
                    <td className="py-4 px-5 text-center">
                      {item.status === "canceled" ? (
                        <button className="bg-red-500 text-white font-semibold py-1 px-4 rounded-full shadow-lg w-[120px] h-[32px]">
                          Đã từ chối
                        </button>
                      ) : (
                        <button className="bg-green-500 text-white font-semibold py-1 px-4 rounded-full shadow-lg w-[120px] h-[32px]">
                          Đã xác nhận
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Status Bookings */}
        <div className="flex-1 bg-white p-4 rounded-lg">
          <div className="flex items-center gap-2.5 px-4 py-4 rounded-t">
            <img src={assets.list_icon} alt="" />
            <p className="font-semibold">Lịch hẹn đã xác nhận & hoàn thành</p>
          </div>

          <div className="pt-4">
            <table className="w-full text-sm bg-white shadow-lg rounded-lg overflow-hidden">
              {/* Table Header */}
              <thead className="bg-gray-100 text-gray-800">
                <tr>
                  <th className="py-3 px-5 text-left font-semibold">Bệnh nhân</th>
                  <th className="py-3 px-5 text-center font-semibold">Ngày khám</th>
                  <th className="py-3 px-5 text-center font-semibold">Ca khám</th>
                  <th className="py-3 px-5 text-center font-semibold">Trạng thái</th>
                </tr>
              </thead>

              {/* Table Body */}
              <tbody>
                {appointmentStatus.map((item) => (
                  <tr key={item._id} className="hover:bg-gray-50 transition-all duration-200">
                    <td className="py-4 px-5 text-left text-gray-800 font-medium">{item.patient_name}</td>
                    <td className="py-4 px-5 text-center text-gray-600">{new Date(item.work_date).toLocaleDateString()}</td>
                    <td className="py-4 px-5 text-center">
                      <p
                        className={`py-1 px-4 rounded-full text-white font-semibold ${item.work_shift === "afternoon" ? "bg-orange-400" : "bg-blue-400"} shadow-md`}
                      >
                        {item.work_shift === "morning" ? "Sáng" : "Chiều"}
                      </p>
                    </td>
                    <td className="py-4 px-5 text-center">
                      {item.status === "canceled" ? (
                        <button className="bg-red-500 text-white font-semibold py-1 px-4 rounded-full shadow-lg w-[130px] h-[32px]">
                          Đã từ chối
                        </button>
                      ) : (
                        <button className="bg-green-500 text-white font-semibold py-1 px-4 rounded-full shadow-lg w-[130px] h-[32px]">
                          Đã xác nhận
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
