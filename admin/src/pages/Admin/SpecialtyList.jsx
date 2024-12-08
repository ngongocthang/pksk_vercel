import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const VITE_BACKEND_URI = import.meta.env.VITE_BACKEND_URI;

const SpecialtyList = () => {
    const navigate = useNavigate();
    const [specialties, setSpecialties] = useState([]); // Khởi tạo danh sách chuyên khoa
    const [currentPage, setCurrentPage] = useState(1);
    const [specialtiesPerPage] = useState(10); // Số lượng chuyên khoa trên mỗi trang

    useEffect(() => {
        const fetchSpecialties = async () => {
            try {
                const response = await axios.get(`${VITE_BACKEND_URI}/specialization/find-all`);
                setSpecialties(response.data.specializations); // Cập nhật danh sách chuyên khoa từ API
            } catch (error) {
                console.error("Error fetching specialties:", error);
            }
        };

        fetchSpecialties();
    }, []);

    // Phân trang
    const totalPages = Math.ceil(specialties.length / specialtiesPerPage);
    const indexOfLastSpecialty = currentPage * specialtiesPerPage;
    const indexOfFirstSpecialty = indexOfLastSpecialty - specialtiesPerPage;
    const currentSpecialties = specialties.slice(indexOfFirstSpecialty, indexOfLastSpecialty);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Hàm xóa chuyên khoa
    const deleteSpecialty = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/specialization/${id}`);
            setSpecialties(specialties.filter(specialty => specialty.id !== id)); // Cập nhật danh sách sau khi xóa
        } catch (error) {
            console.error("Error deleting specialty:", error);
        }
    };

    // Hàm render phân trang
    const renderPagination = () => {
        const paginationItems = [];

        // Nút "Trang trước"
        paginationItems.push(
            <button
                key="prev"
                onClick={() => paginate(Math.max(1, currentPage - 1))}
                className={`py-1 px-3 border rounded ${currentPage === 1 ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "text-gray-600"}`}
                disabled={currentPage === 1}
            >
                Trước
            </button>
        );

        // Hiển thị các trang
        for (let i = 1; i <= totalPages; i++) {
            paginationItems.push(
                <button
                    key={i}
                    onClick={() => paginate(i)}
                    className={`py-1 px-3 border rounded ${i === currentPage ? "bg-blue-600 text-white" : "text-gray-600"}`}
                >
                    {i}
                </button>
            );
        }

        // Nút "Trang tiếp theo"
        paginationItems.push(
            <button
                key="next"
                onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                className={`py-1 px-3 border rounded ${currentPage === totalPages ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "text-gray-600"}`}
                disabled={currentPage === totalPages}
            >
                Tiếp
            </button>
        );

        return <div className="flex justify-center gap-2 mt-4">{paginationItems}</div>;
    };

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-4">
                <p className="text-2xl md:text-3xl font-bold text-[#0091a1]">Danh Sách Chuyên Khoa</p>
                <button
                    onClick={() => navigate("/add-specialty")}
                    className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 bg-gradient-to-r from-[#4CAF50] to-[#219B9D] text-white rounded-full shadow-md hover:from-[#45A049] hover:to-[#009688] transform hover:scale-110 transition-all duration-300"
                >
                    <svg className="w-5 h-5 md:w-6 md:h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" />
                    </svg>
                </button>
            </div>

            {/* Responsive Table */}
            <div className="mt-4 overflow-x-auto bg-white rounded-md shadow-md">
                <table className="min-w-full table-auto bg-white border-collapse hidden md:table">
                    <thead className="bg-gray-200">
                        <tr>
                            <th className="py-2 px-4 border-b text-left text-sm font-bold">#</th>
                            <th className="py-2 px-4 border-b text-center text-sm font-bold">Tên Chuyên Khoa</th>
                            <th className="py-2 px-4 border-b text-left text-sm font-bold">Mô Tả</th>
                            <th className="py-2 px-4 border-b text-left text-sm font-bold">Hành Động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentSpecialties.map((specialty, index) => (
                            <tr key={specialty.id} className="hover:bg-gray-50">
                                <td className="py-2 px-4 border-b text-sm font-semibold">{index + 1}</td>
                                <td className="py-2 px-4 border-b text-center"><img src={specialty.image} alt="" />{specialty.name}</td>
                                <td className="py-2 px-4 border-b">{specialty.description}</td>
                                <td className="py-2 px-4 border-b text-sm flex gap-2">
                                    <button
                                        onClick={() => navigate(`/edit-specialty/${specialty.id}`)}
                                        className="bg-blue-500 text-white py-1 px-3 rounded text-sm"
                                    >
                                        Sửa
                                    </button>
                                    <button
                                        onClick={() => deleteSpecialty(specialty.id)}
                                        className="bg-red-500 text-white py-1 px-3 rounded text-sm"
                                    >
                                        Xóa
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Mobile View */}
                <div className="block md:hidden">
                    {currentSpecialties.map((specialty, index) => (
                        <div
                            key={specialty.id}
                            className="bg-gray-50 p-4 mb-2 rounded-md shadow-md flex flex-col gap-2"
                        >
                            <p className="text-sm font-bold text-center text-gray-700">{index + 1}</p>
                            <div>
                                <p className="font-semibold">Tên Chuyên Khoa:</p>
                                <p>{specialty.name}</p>
                            </div>
                            <div>
                                <p className="font-semibold">Mô Tả:</p>
                                <p>{specialty.description.length > 30 ? specialty.description.substring(0, 30) + "..." : specialty.description}</p>
                            </div>
                            <div className="flex justify-center gap-2 mt-2">
                                <button
                                    onClick={() => navigate(`/edit-specialty/${specialty.id}`)}
                                    className="w-10 h-10 md:w-12 md:h-12 bg-blue-500 text-white rounded-full p-2 shadow-lg hover:bg-blue-600 transition-all"
                                >
                                    <svg
                                        className="w-6 h-6 md:w-8 md:h-8 cursor-pointer"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="currentColor"
                                    >
                                        <path
                                            d="M3.99 16.854l-1.314 3.504a.75.75 0 0 0 .966.965l3.503-1.314a3 3 0 0 0 1.068-.687L18.36 9.175s-.354-1.061-1.414-2.122c-1.06-1.06-2.122-1.414-2.122-1.414L4.677 15.786a3 3 0 0 0-.687 1.068zm12.249-12.63l1.383-1.383c.248-.248.579-.406.925-.348.487.08 1.232.322 1.934 1.025.703.703.945 1.447 1.025 1.934.058.346-.1.677-.348.925L19.774 7.76s-.353-1.06-1.414-2.12c-1.06-1.062-2.121-1.415-2.121-1.415z"
                                            fill="#ffffff"
                                        ></path>
                                    </svg>
                                </button>

                                <button
                                    onClick={() => deleteSpecialty(specialty.id)}
                                    className="w-10 h-10 md:w-12 md:h-12 bg-red-500 text-white rounded-full p-2 shadow-lg hover:bg-red-600 transition-all"
                                >
                                    <svg
                                        className="w-6 h-6 md:w-8 md:h-8 cursor-pointer"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="currentColor"
                                    >
                                        <path
                                            d="M5.755,20.283,4,8H20L18.245,20.283A2,2,0,0,1,16.265,22H7.735A2,2,0,0,1,5.755,20.283ZM21,4H16V3a1,1,0,0,0-1-1H9A1,1,0,0,0,8,3V4H3A1,1,0,0,0,3,6H21a1,1,0,0,0,0-2Z"
                                            fill="#ffffff"
                                        ></path>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Pagination */}
            {specialties.length > specialtiesPerPage && renderPagination()}
        </div>
    );
};

export default SpecialtyList;
