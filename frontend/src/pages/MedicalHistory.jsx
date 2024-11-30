import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AppContext } from "../context/AppContext";

const MedicalHistory = () => {
  const navigate = useNavigate();
  const { user } = useContext(AppContext);
  const [medicalRecords, setMedicalRecords] = useState([]);

  const fetchMedicalHistory = async () => {
    const token = user?.token;

    if (!token) {
      navigate("/account");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/medical-history/${user.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Kiểm tra trạng thái HTTP của phản hồi
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Kiểm tra cấu trúc dữ liệu trả về
      if (data.historyAppointments && Array.isArray(data.historyAppointments)) {
        setMedicalRecords(data.historyAppointments);
      } else {
        console.error("API returned invalid data structure:", data);
        toast.error("Dữ liệu từ server không hợp lệ.");
      }
    } catch (error) {
      console.error("Error fetching medical history:", error);
    }
  };

  useEffect(() => {
    fetchMedicalHistory();
  }, [user]);

  return (
    <div className="container mx-auto px-6 py-8">
      <ToastContainer />
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-black">Lịch sử hẹn</h1>
        <p className="text-gray-500 mt-2">
          Xem lại thông tin các lần khám của bạn
        </p>
      </div>

      {medicalRecords.length === 0 ? (
        <div className="flex flex-col items-center justify-center mt-16">
          <img
            src="https://via.placeholder.com/150"
            alt="No Data"
            className="mb-4"
          />
          <p className="text-gray-500 text-lg">Chưa có lịch sử lịch hẹn nào.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full bg-white shadow-md rounded-lg border border-gray-200">
            <thead>
              <tr className="bg-blue-100 text-black text-left">
                <th className="py-4 px-6 font-semibold">Bác sĩ</th>
                <th className="py-4 px-6 font-semibold">Ngày khám</th>
                <th className="py-4 px-6 font-semibold">Ca khám</th>
                <th className="py-4 px-6 font-semibold">Trạng thái</th>
                <th className="py-4 px-6 font-semibold">Chi tiết</th>
              </tr>
            </thead>
            <tbody>
              {medicalRecords.map((record, index) => (
                <tr
                  key={index} // Sử dụng index làm key vì không có id
                  className={`hover:bg-blue-50 ${
                    index % 2 === 0 ? "bg-gray-50" : "bg-white"
                  }`}
                >
                  <td className="py-4 px-6 border-t border-gray-200 text-gray-700">
                    {record.history.doctor_name}
                  </td>
                  <td className="py-4 px-6 border-t border-gray-200 text-gray-700">
                    {new Date(record.history.work_date).toLocaleDateString(
                      "vi-VN"
                    )}
                  </td>
                  <td className="py-4 px-6 border-t border-gray-200 text-gray-700">
                    {record.history.work_shift === "morning"
                      ? "Buổi sáng"
                      : "Buổi chiều"}
                  </td>
                  <td className="py-4 px-6 border-t border-gray-200 text-gray-700">
                    {record.history.status === "pending"
                      ? "Đang chờ xác nhận"
                      : record.history.status === "canceled"
                      ? "Đã huỷ"
                      : record.history.status === "completed"
                      ? "Đã hoàn thành"
                      : "Đã xác nhận"}
                  </td>
                  <td className="py-4 px-6 border-t border-gray-200 text-gray-700">
                    {new Date(record.history.createdAt).toLocaleString(
                      "vi-VN",
                      {
                        timeZone: "Asia/Ho_Chi_Minh",
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                      }
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MedicalHistory;
