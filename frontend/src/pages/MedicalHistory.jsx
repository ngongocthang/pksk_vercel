import React, { useEffect, useState, useContext } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const MedicalHistory = () => {
  const { user } = useContext(AppContext);
  const [medicalRecords, setMedicalRecords] = useState([]);

  const fetchMedicalHistory = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/get-medical-history/${user.id}`);
      setMedicalRecords(response.data);
    } catch (error) {
      console.error("Error fetching medical history:", error);
      toast.error("Có lỗi xảy ra khi tải lịch sử y tế. Vui lòng thử lại.");
    }
  };

  useEffect(() => {
    fetchMedicalHistory();
  }, [user.id]);

  return (
    <div className="container mx-auto p-4">
      <ToastContainer />
      <h1 className="text-2xl font-bold mb-4">Lịch sử y tế</h1>
      {medicalRecords.length === 0 ? (
        <p className="text-gray-500">Chưa có lịch sử y tế nào.</p>
      ) : (
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="py-2 px-4 border-b">Ngày</th>
              <th className="py-2 px-4 border-b">Bác sĩ</th>
              <th className="py-2 px-4 border-b">Lý do khám</th>
              <th className="py-2 px-4 border-b">Ghi chú</th>
            </tr>
          </thead>
          <tbody>
            {medicalRecords.map((record) => (
              <tr key={record._id} className="hover:bg-gray-100">
                <td className="py-2 px-4 border-b">{new Date(record.date).toLocaleDateString("vi-VN")}</td>
                <td className="py-2 px-4 border-b">{record.doctorName}</td>
                <td className="py-2 px-4 border-b">{record.reason}</td>
                <td className="py-2 px-4 border-b">{record.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MedicalHistory;
