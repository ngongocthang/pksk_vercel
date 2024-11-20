import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const AllSchedule = () => {
  const [currentWeek, setCurrentWeek] = useState(new Date());

  // Dữ liệu bác sĩ ảo
  const doctors = [
    { id: 1, name: "Dr. A", description: "Bác sĩ về tim mạch" },
    { id: 2, name: "Dr. B", description: "Bác sĩ về tiêu hóa" },
    { id: 3, name: "Dr. C", description: "Bác sĩ về xương khớp" },
  ];

  // Dữ liệu sự kiện lịch làm việc của bác sĩ ảo
  const events = [
    {
      doctorId: 1,
      name: "Khám tim",
      dateRange: ["2024-11-20", "2024-11-24"],
      color: "bg-teal-500", // màu của sự kiện
    },
    {
      doctorId: 1,
      name: "Khám tổng quát",
      dateRange: ["2024-11-22", "2024-11-23"],
      color: "bg-yellow-500",
    },
    {
      doctorId: 2,
      name: "Khám tiêu hóa",
      dateRange: ["2024-11-21", "2024-11-22"],
      color: "bg-green-500",
    },
    {
      doctorId: 3,
      name: "Khám xương khớp",
      dateRange: ["2024-11-22", "2024-11-25"],
      color: "bg-blue-500",
    },
    {
      doctorId: 2,
      name: "Khám tiêu hóa",
      dateRange: ["2024-11-23", "2024-11-24"],
      color: "bg-orange-500",
    },
  ];

  // Hàm để tạo danh sách các ngày trong tuần
  const getWeekDays = (date) => {
    const start = new Date(date.setDate(date.getDate() - date.getDay()));
    return Array.from({ length: 7 }, (_, i) => {
      const day = new Date(start);
      day.setDate(start.getDate() + i);
      return {
        day: day.toLocaleDateString("vi-VN", { weekday: "short" }),
        date: day.toLocaleDateString("vi-VN"),
      };
    });
  };

  const weekDays = getWeekDays(new Date(currentWeek));

  // Điều hướng tuần
  const handlePrevWeek = () => {
    setCurrentWeek((prev) => new Date(prev.setDate(prev.getDate() - 7)));
  };

  const handleNextWeek = () => {
    setCurrentWeek((prev) => new Date(prev.setDate(prev.getDate() + 7)));
  };

  return (
    <div className="flex h-screen">
      <div className="flex-1 p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={handlePrevWeek}
            className="flex items-center text-gray-700"
          >
            <ChevronLeft className="w-5 h-5" />
            <span>Tuần trước</span>
          </button>
          <h3 className="font-semibold text-lg">
            Tuần {weekDays[0].date} - {weekDays[6].date}
          </h3>
          <button
            onClick={handleNextWeek}
            className="flex items-center text-gray-700"
          >
            <span>Tuần kế tiếp</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Bảng lịch bác sĩ và lịch làm việc */}
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead>
              <tr>
                <th className="px-4 py-2 border bg-gray-200">Bác sĩ</th>
                {weekDays.map((day, index) => (
                  <th key={index} className="px-4 py-2 border bg-gray-200">
                    {day.day} {day.date}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {doctors.map((doctor) => (
                <tr key={doctor.id} className="text-center">
                  <td className="w-1/4 bg-gray-100 border-r p-4">{doctor.name}</td>
                  {weekDays.map((day, dayIndex) => {
                    // Kiểm tra xem có sự kiện lịch làm việc cho bác sĩ vào ngày này
                    const hasEvent = events.some(
                      (event) =>
                        event.doctorId === doctor.id &&
                        new Date(day.date) >= new Date(event.dateRange[0]) &&
                        new Date(day.date) <= new Date(event.dateRange[1])
                    );
                    return (
                      <td
                        key={dayIndex}
                        className={`px-4 py-2 border ${
                          hasEvent ? "bg-gray-100" : "bg-white"
                        }`}
                      >
                        {/* Hiển thị sự kiện nếu có */}
                        {hasEvent &&
                          events
                            .filter(
                              (event) =>
                                event.doctorId === doctor.id &&
                                new Date(day.date) >= new Date(event.dateRange[0]) &&
                                new Date(day.date) <= new Date(event.dateRange[1])
                            )
                            .map((event, eventIndex) => (
                              <div key={eventIndex} className={`text-sm p-1 ${event.color}`}>
                                {event.name}
                              </div>
                            ))}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AllSchedule;
