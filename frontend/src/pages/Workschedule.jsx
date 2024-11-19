import React, { useState, useEffect } from 'react';
import { Scheduler } from "@bitnoi.se/react-scheduler";

// Tạo dữ liệu giả
const mockData = [
  {
    id: 1,
    title: "Khám bệnh",
    startDate: "2024-11-20T09:00:00",
    endDate: "2024-11-20T10:00:00",
    resource: "Bác sĩ A", // có thể là tên bác sĩ hoặc phòng khám
  },
  {
    id: 2,
    title: "Khám bệnh",
    startDate: "2024-11-20T10:00:00",
    endDate: "2024-11-20T11:00:00",
    resource: "Bác sĩ B",
  },
  {
    id: 3,
    title: "Khám bệnh",
    startDate: "2024-11-20T11:00:00",
    endDate: "2024-11-20T12:00:00",
    resource: "Bác sĩ C",
  },
  {
    id: 4,
    title: "Khám bệnh",
    startDate: "2024-11-20T14:00:00",
    endDate: "2024-11-20T15:00:00",
    resource: "Bác sĩ A",
  },
  {
    id: 5,
    title: "Khám bệnh",
    startDate: "2024-11-21T08:00:00",
    endDate: "2024-11-21T09:00:00",
    resource: "Bác sĩ B",
  },
  {
    id: 6,
    title: "Khám bệnh",
    startDate: "2024-11-21T09:00:00",
    endDate: "2024-11-21T10:00:00",
    resource: "Bác sĩ C",
  },
];

export default function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [filteredData, setFilteredData] = useState(mockData);

  // Giả lập việc tải dữ liệu
  useEffect(() => {
    setIsLoading(true);

    // Giả lập thời gian lấy dữ liệu
    setTimeout(() => {
      setIsLoading(false); // Dừng trạng thái tải sau 1 giây
    }, 1000);
  }, []);

  // Hàm lọc dữ liệu
  const handleFilterData = () => {
    const filtered = mockData.filter(item => item.resource === 'Bác sĩ A'); // Lọc theo bác sĩ
    setFilteredData(filtered);
  };

  // Hàm xóa bộ lọc
  const handleClearFilterData = () => {
    setFilteredData(mockData); // Quay lại toàn bộ dữ liệu ban đầu
  };

  return (
    <div>
      <Scheduler
        isLoading={isLoading} // Quyết định khi nào hiển thị chỉ báo tải
        data={filteredData}   // Sử dụng dữ liệu đã lọc
        onItemClick={(clickedItem) => console.log(clickedItem)} // Callback khi người dùng click vào một ô trong grid
        onFilterData={handleFilterData}  // Hàm lọc dữ liệu
        onClearFilterData={handleClearFilterData} // Callback khi người dùng click vào nút xóa bộ lọc
        config={{
          filterButtonState: 0,  // Trạng thái của nút lọc: 0 - không có bộ lọc
          zoom: 0,               // Quyết định loại hiển thị (0 - tuần, 1 - ngày)
          lang: "en",            // Ngôn ngữ cho lịch
          maxRecordsPerPage: 20, // Số lượng bản ghi tối đa mỗi trang
        }}
      />
    </div>
  );
}
