import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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
      const response = await fetch(`http://localhost:5000/medical-history/${user.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Kiểm tra trạng thái HTTP của phản hồi
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Kiểm tra cấu trúc dữ liệu trả về
      if (data.historyAppointments && Array.isArray(data.historyAppointments)) {
        setMedicalRecords(data.historyAppointments);
        localStorage.setItem("medicalRecords", JSON.stringify(data.historyAppointments));
      } else {
        console.error("API returned invalid data structure:", data);
        toast.error("Dữ liệu từ server không hợp lệ.");
      }
    } catch (error) {
      console.error("Error fetching medical history:", error);
      toast.error("Có lỗi xảy ra khi tải lịch sử lịch hẹn. Vui lòng thử lại.");
    }
  };

  useEffect(() => {
    const storedRecords = localStorage.getItem("medicalRecords");
    console.log("Stored records in localStorage:", storedRecords);

    if (storedRecords) {
      try {
        const parsedRecords = JSON.parse(storedRecords);
        console.log("Parsed records:", parsedRecords);
        setMedicalRecords(parsedRecords);
      } catch (error) {
        console.error("Error parsing stored records:", error);
        localStorage.removeItem("medicalRecords");
        fetchMedicalHistory();
      }
    } else {
      fetchMedicalHistory();
    }
  }, [user]);

  return (
    <div className="container mx-auto px-6 py-8">
      <ToastContainer />
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-black">Lịch sử hẹn</h1>
        <p className="text-gray-500 mt-2">Xem lại thông tin các lần khám của bạn</p>
      </div>
  
      {medicalRecords.length === 0 ? (
        <div className="flex flex-col items-center justify-center mt-16">
          <img
            src="https://via.placeholder.com/150" // Bạn có thể thay bằng icon phù hợp
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
              </tr>
            </thead>
            <tbody>
              {medicalRecords.map((record, index) => (
                <tr
                  key={record.history.id}
                  className={`hover:bg-blue-50 ${
                    index % 2 === 0 ? "bg-gray-50" : "bg-white"
                  }`}
                >
                  <td className="py-4 px-6 border-t border-gray-200 text-gray-700">
                    {record.history.doctor_name}
                  </td>
                  <td className="py-4 px-6 border-t border-gray-200 text-gray-700">
                    {new Date(record.history.work_date).toLocaleDateString("vi-VN")}
                  </td>
                  <td className="py-4 px-6 border-t border-gray-200 text-gray-700">
                    {record.history.work_shift === "morning" && "Buổi sáng"}
                    {record.history.work_shift === "afternoon" && "Buổi chiều"}
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
