import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AdminContext } from "../../context/AdminContext";
import axios from "axios";
import { toast } from "react-toastify";

const VITE_BACKEND_URI = import.meta.env.VITE_BACKEND_URI;

const PatientList = () => {
    const { patient, getAllPatients } = useContext(AdminContext);
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const [patientsPerPage] = useState(10);

    useEffect(() => {
        getAllPatients();
    }, [getAllPatients]);

    const totalPages = Math.ceil(patient.length / patientsPerPage);
    const indexOfLastPatient = currentPage * patientsPerPage;
    const indexOfFirstPatient = indexOfLastPatient - patientsPerPage;
    const currentPatients = patient.slice(
        indexOfFirstPatient,
        indexOfLastPatient
    );

    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
        navigate(`/patient-list?page=${pageNumber}`);
    };

    const deletePatient = async (id, name) => {
        toast.dismiss();
        toast(
            ({ closeToast }) => (
                <div>
                    <p className="mb-2 font-bold text-lg text-center">
                        Bạn có chắc chắn muốn xóa bệnh nhân <span className="text-red-600">{name}</span> này không?
                    </p>
                    <div className="flex justify-end gap-4">
                        <button
                            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-700"
                            onClick={async () => {
                                try {
                                    await axios.delete(`${VITE_BACKEND_URI}/patient/delete/${id}`);
                                    toast.success(`Bệnh nhân ${name} đã được xóa thành công!`, {
                                        position: "top-right",
                                    });
                                    getAllPatients();
                                    closeToast();
                                } catch (error) {
                                    console.error("Lỗi khi xóa bệnh nhân:", error);
                                    toast.error("Có lỗi xảy ra khi xóa bệnh nhân!", {
                                        position: "top-right",
                                    });
                                    closeToast();
                                }
                            }}
                        >
                            Xác nhận
                        </button>
                        <button
                            className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
                            onClick={closeToast}
                        >
                            Hủy bỏ
                        </button>
                    </div>
                </div>
            ),
            {
                position: "top-center",
                autoClose: true, // Không tự động đóng
                closeOnClick: false,
                draggable: false,
            }
        );
    };

    return (
        <div className="container mx-auto p-6">
            <div className="flex justify-between items-center mb-3">
                <p className="text-3xl font-bold text-[#0091a1]">Tất Cả Bệnh Nhân</p>
                <button
                    onClick={() => navigate("/add-patient")}
                    className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-[#4CAF50] to-[#219B9D] text-white rounded-full shadow-md hover:from-[#45A049] hover:to-[#009688] transform hover:scale-110 transition-all duration-300"
                >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" />
                    </svg>
                </button>
            </div>
            <div className="mt-4 overflow-x-auto bg-white p-4 rounded-md shadow-md">
                <table className="min-w-full table-auto bg-white border-collapse">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="py-2 px-4 border-b text-left text-sm font-bold text-[16px]">
                                #
                            </th>
                            <th className="py-2 px-4 border-b text-center text-sm font-bold text-[16px]">
                                Tên Bệnh Nhân
                            </th>
                            <th className="py-2 px-4 border-b text-center text-sm font-bold text-[16px]">
                                Email
                            </th>
                            <th className="py-2 px-4 border-b text-center text-sm font-bold text-[16px]">
                                Số Điện Thoại
                            </th>
                            <th className="py-2 px-4 border-b text-left text-sm font-bold text-[16px]">
                                Hành Động
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentPatients.map((patient, index) => (
                            <tr key={patient._id} className="hover:bg-gray-50">
                                <td className="py-2 px-4 border-b text-sm font-bold">
                                    {index + 1}
                                </td>
                                <td className="py-2 px-4 border-b text-center">
                                    {patient.user_id.name}
                                </td>
                                <td className="py-2 px-4 border-b text-center">
                                    {patient.user_id.email}
                                </td>
                                <td className="py-2 px-4 border-b text-center">
                                    {patient.user_id.phone ? patient.user_id.phone : "Chưa có"}
                                </td>
                                <td className="py-2 px-4 border-b text-sm flex gap-2">
                                    <svg
                                        onClick={() => navigate(`/edit-patient/${patient._id}`)}
                                        className="w-8 h-8 cursor-pointer text-blue-500 bg-blue-100 rounded-full p-2 transition-all shadow-lg"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="currentColor"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            clipRule="evenodd"
                                            d="M3.99 16.854l-1.314 3.504a.75.75 0 0 0 .966.965l3.503-1.314a3 3 0 0 0 1.068-.687L18.36 9.175s-.354-1.061-1.414-2.122c-1.06-1.06-2.122-1.414-2.122-1.414L4.677 15.786a3 3 0 0 0-.687 1.068zm12.249-12.63l1.383-1.383c.248-.248.579-.406.925-.348.487.08 1.232.322 1.934 1.025.703.703.945 1.447 1.025 1.934.058.346-.1.677-.348.925L19.774 7.76s-.353-1.06-1.414-2.12c-1.06-1.062-2.121-1.415-2.121-1.415z"
                                            fill="#000000"
                                        ></path>
                                    </svg>

                                    <svg
                                        onClick={() => deletePatient(patient._id, patient.user_id.name)} // Gọi hàm xóa bệnh nhân
                                        className="w-8 h-8 cursor-pointer text-red-500 bg-red-100 rounded-full p-2 transition-all shadow-lg"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="currentColor"
                                    >
                                        <path
                                            d="M5.755,20.283,4,8H20L18.245,20.283A2,2,0,0,1,16.265,22H7.735A2,2,0,0,1,5.755,20.283ZM21,4H16V3a1,1,0,0,0-1-1H9A1,1,0,0,0,8,3V4H3A1,1,0,0,0,3,6H21a1,1,0,0,0,0-2Z"
                                            fill="#c42121"
                                        ></path>
                                    </svg>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {patient.length > patientsPerPage && (
                <div className="flex justify-center gap-4 mt-4">
                    {Array.from({ length: totalPages }, (_, index) => (
                        <button
                            key={index}
                            onClick={() => paginate(index + 1)}
                            className={`px-4 py-2 rounded-md ${currentPage === index + 1
                                ? "bg-blue-600 text-white"
                                : "bg-gray-200"
                                }`}
                        >
                            {index + 1}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PatientList;
