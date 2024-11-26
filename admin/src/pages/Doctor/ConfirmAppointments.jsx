import React, { useState } from "react";

const ConfirmAppointments = () => {
    // Dữ liệu mẫu cho các lịch hẹn
    const appointments = [
        {
            _id: "1",
            patient_name: "Nguyễn Văn A",
            work_date: "2024-11-25",
            work_shift: "morning", // "morning" hoặc "afternoon"
        },
        {
            _id: "2",
            patient_name: "Trần Thị B",
            work_date: "2024-11-25",
            work_shift: "afternoon",
        },
        {
            _id: "3",
            patient_name: "Lê Văn C",
            work_date: "2024-11-26",
            work_shift: "morning",
        },
        {
            _id: "4",
            patient_name: "Phạm Thị D",
            work_date: "2024-11-26",
            work_shift: "afternoon",
        },
        {
            _id: "5",
            patient_name: "Hoàng Văn E",
            work_date: "2024-11-27",
            work_shift: "morning",
        },
    ];

    const [confirmedAppointments, setConfirmedAppointments] = useState([]);
    const [loadingId, setLoadingId] = useState(null);

    const handleConfirm = (id) => {
        setLoadingId(id); // Set trạng thái đang tải
        setTimeout(() => {
            setConfirmedAppointments([...confirmedAppointments, id]);
            setLoadingId(null); // Hủy trạng thái loading sau khi hoàn thành
        }, 1000); // Giả lập thời gian xử lý
    };

    const handleCancel = (id) => {
        setLoadingId(id);
        setTimeout(() => {
            setConfirmedAppointments(confirmedAppointments.filter(item => item !== id));
            setLoadingId(null);
        }, 1000);
    };

    // Sắp xếp các lịch hẹn theo buổi sáng trước, buổi chiều sau
    const sortedAppointments = [...appointments].sort((a, b) => {
        if (a.work_shift === "morning" && b.work_shift === "afternoon") return -1;
        if (a.work_shift === "afternoon" && b.work_shift === "morning") return 1;
        return 0; // Nếu cả hai có cùng ca thì không thay đổi thứ tự
    });

    return (
        <div className="w-full max-w-6xl m-5 shadow-lg">
            <div className="flex justify-between items-center mb-3">
                <p className="text-lg font-medium text-gray-700">Xác nhận khám bệnh</p>
                <div className="space-x-4">
                    <input
                        type="text"
                        placeholder="Tìm kiếm bệnh nhân..."
                        className="p-2 rounded-lg border-2 border-[#0091a1] bg-blue-50 shadow-md text-sm font-semibold text-gray-800"
                    />

                    <span className="p-2 rounded-lg border-2 border-[#0091a1] bg-blue-50 shadow-md text-sm font-semibold text-gray-800">
                        {new Date().toLocaleDateString()}
                    </span>
                </div>
            </div>

            <div className="bg-white border rounded text-sm max-h-[80vh] min-h-[50vh] overflow-y-scroll">
                <table className="w-full border-collapse">
                    {/* Table Header */}
                    <thead className="bg-gray-200">
                        <tr>
                            <th className="py-2 px-4 font-bold text-[16px]">#</th>
                            <th className="py-2 px-4 font-bold text-center text-[16px]">Bệnh nhân</th>
                            <th className="py-2 px-4 font-bold text-center text-[16px]">Ca khám</th>
                            <th className="py-2 px-4 font-bold text-center text-[16px]">Xác nhận</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedAppointments.map((appointment, index) => (
                            <tr key={appointment._id} className="hover:bg-gray-50 text-center text-[16px]">
                                <td className="py-3 px-4 text-gray-800 font-medium">{index + 1}</td>
                                <td className="py-3 px-4 text-gray-800 font-medium">{appointment.patient_name}</td>
                                <td className="py-3 px-4 text-center w-[170px]">
                                    <p className={`py-1 px-4 rounded-full text-white text-base font-semibold ${appointment.work_shift === "afternoon"
                                        ? "bg-orange-300"
                                        : "bg-blue-300"
                                        }`}>
                                        {appointment.work_shift === "morning" ? "Sáng" : "Chiều"}
                                    </p>
                                </td>
                                <td className="py-3 px-4 text-center">
                                    <div className="flex justify-center gap-4">
                                        {loadingId === appointment._id ? (
                                            <div className="w-8 h-8 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
                                        ) : (
                                            <>
                                                <svg
                                                    onClick={() => handleConfirm(appointment._id)}
                                                    className="w-[30px] h-[30px] cursor-pointer bg-green-500 p-2 rounded-full shadow-lg hover:bg-green-600"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="white"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                >
                                                    <path d="M5 13l4 4L19 7" />
                                                </svg>

                                                <svg
                                                    onClick={() => handleCancel(appointment._id)}
                                                    className="w-[30px] h-[30px] cursor-pointer bg-red-500 p-2 rounded-full shadow-lg hover:bg-red-600"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="white"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                >
                                                    <path d="M18 6L6 18" />
                                                    <path d="M6 6l12 12" />
                                                </svg>
                                            </>
                                        )}
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

export default ConfirmAppointments;
