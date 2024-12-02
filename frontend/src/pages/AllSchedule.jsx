import React, { useEffect, useState, useContext } from "react";
import FullCalendar from "@fullcalendar/react";
import resourceTimelinePlugin from "@fullcalendar/resource-timeline";
import viLocale from "@fullcalendar/core/locales/vi"; 
import { AppContext } from "../context/AppContext";
import axios from "axios"; // Import axios
import { ToastContainer, toast } from "react-toastify"; 
import "react-toastify/dist/ReactToastify.css"; 
import "../index.css"

const DoctorTimeline = () => {
  const [doctors, setDoctors] = useState([]);
  const [events, setEvents] = useState([]);
  const { user } = useContext(AppContext);
  const patient_id = user.id;
  const token = user?.token || localStorage.getItem("token");

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/get-all-schedule-doctor"
        );
        const data = await response.json();

        // Tạo danh sách bác sĩ (resources)
        const resources = data.map((doctor) => ({
          id: doctor.doctorId,
          doctorName: doctor.doctorName,
          doctorImage: doctor.doctorImage,
        }));

        // Xử lý lịch làm việc (events)
        const mappedEvents = data.flatMap((doctor) =>
          doctor.schedules.map((schedule) => {
            const workDate = new Date(schedule.work_date); 
            const startDate = new Date(workDate);
            const endDate = new Date(workDate);

            // Thiết lập thời gian bắt đầu và kết thúc dựa trên work_shift
            if (schedule.work_shift === "morning") {
              startDate.setHours(7, 30, 0, 0); // 7h30 sáng
              endDate.setHours(11, 30, 0, 0); // Kết thúc ca sáng
            } else if (schedule.work_shift === "afternoon") {
              startDate.setHours(13, 30, 0, 0); // 13h30 chiều
              endDate.setHours(17, 30, 0, 0); // Kết thúc ca chiều
            }

            const converWork_shift =
              schedule.work_shift === "morning" ? "Sáng" : "Chiều";

            return {
              id: schedule._id,
              resourceId: doctor.doctorId,
              title: converWork_shift,
              start: startDate.toISOString(),
              end: endDate.toISOString(),
            };
          })
        );

        setDoctors(resources);
        setEvents(mappedEvents);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error);
      }
    };

    fetchSchedules();
  }, []);

  const handleEventClick = (info) => {
    const clickedEvent = info.event;
    const convertTitle = clickedEvent.title === "Sáng" ? "morning" : "afternoon";

    const appointmentData = {
      patient_id: patient_id,
      doctor_id: clickedEvent.getResources()[0]?.id || "",
      work_shift: convertTitle,
      work_date: clickedEvent.start.toISOString().split("T")[0], 
    };

    // Hiển thị hộp thoại xác nhận bằng Toastify
    toast.info(
      <div>
        <p>
          Bạn có chắc chắn muốn đặt lịch hẹn vào{" "}
          <b>{appointmentData.work_date}</b> vào ca <b>{clickedEvent.title}</b>?
        </p>
        <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
          <button
            onClick={async () => {
              await confirmBooking(appointmentData);
              toast.dismiss();
            }}
            style={{
              padding: "8px 16px",
              backgroundColor: "#00759c",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Xác nhận
          </button>
          <button
            onClick={() => toast.dismiss()}
            style={{
              padding: "8px 16px",
              backgroundColor: "gray",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Hủy
          </button>
        </div>
      </div>,
      {
        position: "top-center",
        autoClose: false,
        closeOnClick: false,
        draggable: false,
      }
    );
  };

  const confirmBooking = async (appointmentData) => {
    try {
      const response = await axios.post(
        `http://localhost:5000/create-appointment/${patient_id}`,
        appointmentData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Đặt lịch hẹn thành công!");
      console.log("Đặt lịch hẹn thành công:", response.data);
    } catch (error) {
      console.error("Lỗi khi đặt lịch hẹn:", error.response?.data?.message);
      toast.error(error.response?.data?.message || "Có lỗi xảy ra khi đặt lịch hẹn.");
    }
  };

  return (
    <div>
      <h1 className="">Lịch Làm Việc Của Bác Sĩ</h1>
      <FullCalendar
        plugins={[resourceTimelinePlugin]}
        initialView="resourceTimelineWeek"
        resources={doctors}
        events={events}
        locale={viLocale}
        resourceAreaColumns={[
          {
            // Tùy chỉnh hiển thị cột tài nguyên
            headerContent: "Bác sĩ",
            field: "doctorName",
            cellContent: (args) => {
              const { doctorImage, doctorName } = args.resource.extendedProps;
              return (
                <div style={{ 
                  display: "flex", 
                  alignItems: "center",
                   }}>
                  <img
                    src={doctorImage}
                    alt={doctorName}
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: "50%",
                      marginRight: 8,
                    }}
                  />
                  {doctorName}
                </div>
              );
            },
          },
        ]}
        headerToolbar={{
          left: "prev today next",
          center: "title",
          right: "resourceTimelineDay,resourceTimelineWeek",
        }}
        slotMinTime="06:00:00" // Thời gian bắt đầu hiển thị
        slotMaxTime="19:00:00" // Thời gian kết thúc hiển thị
        nowIndicator={true} // Hiển thị vạch thời gian hiện tại
        eventClick={handleEventClick} // Thêm sự kiện click cho lịch
      />
      <ToastContainer /> 
    </div>
  );
};

export default DoctorTimeline;
