import viLocale from "@fullcalendar/core/locales/vi";
import FullCalendar from "@fullcalendar/react";
import resourceTimelinePlugin from "@fullcalendar/resource-timeline";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AppContext } from "../context/AppContext";
import "../index.css";
import { useNavigate } from "react-router-dom";

const VITE_BACKEND_URI = import.meta.env.VITE_BACKEND_URI;

const AllSchedule = () => {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [events, setEvents] = useState([]);
  const { user } = useContext(AppContext);
  const [isToastVisible, setIsToastVisible] = useState(false);
  const [loading, setLoading] = useState(true); 
  const token = user?.token || localStorage.getItem("token");
  const phone = localStorage.getItem("user")
  ? JSON.parse(localStorage.getItem("user")).phone
  : "";
  const patient_id = user?.id ? user?.id : JSON.parse(localStorage.getItem("user"))._id;

  if (typeof console !== "undefined") {
    console.error = function () {};
  }
  
  useEffect(() => {
    const fetchSchedules = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${VITE_BACKEND_URI}/get-all-schedule-doctor`);
        const resources = response.data.map((doctor) => ({
          id: doctor.doctorId,
          doctorName: doctor.doctorName,
          doctorImage: doctor.doctorImage,
          specialization: doctor.specialization,
        }));
        const mappedEvents = response.data.flatMap((doctor) =>
          doctor.schedules.map((schedule) => {
            const workDate = new Date(schedule.work_date);
            const startDate = new Date(workDate);
            const endDate = new Date(workDate);

            if (schedule.work_shift === "morning") {
              startDate.setHours(7, 30, 0, 0);
              endDate.setHours(11, 30, 0, 0);
            } else if (schedule.work_shift === "afternoon") {
              startDate.setHours(13, 30, 0, 0);
              endDate.setHours(17, 30, 0, 0);
            }

            const converWork_shift = schedule.work_shift === "morning" ? "Sáng" : "Chiều";

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
        toast.error("Có lỗi xảy ra khi tải lịch làm việc.");
      }
    };

    fetchSchedules();
  }, []);
  
  const handleEventClick = (info) => {
    if (isToastVisible) {
      return;
    }
  
    const clickedEvent = info.event;
    const convertTitle = clickedEvent.title === "Sáng" ? "morning" : "afternoon";
  
    // Lấy ngày làm việc từ sự kiện
    const workDate = new Date(clickedEvent.start).toISOString().split("T")[0];
    const currentDate = new Date().toISOString().split("T")[0];
  
    // Kiểm tra xem lịch làm việc đã ở quá khứ chưa
    if (workDate < currentDate) {
      toast.error("Không thể đặt lịch hẹn cho ngày đã qua!");
      return;
    }
  
    const formatDate = (isoDate) => {
      const [year, month, day] = isoDate.split("-");
      return `${day}/${month}/${year}`;
    };
  
    const appointmentData = {
      patient_id: patient_id,
      doctor_id: clickedEvent.getResources()[0]?.id || "",
      work_shift: convertTitle,
      work_date: workDate,
    };
  
    const formattedDate = formatDate(appointmentData.work_date);
    setIsToastVisible(true);
  
    // Kiểm tra số điện thoại
    if (!phone) {
      toast.warn(
        <div className="flex flex-col items-center justify-center">
          <div className="flex items-center mb-2">
            <p className="font-bold text-lg">Cảnh báo</p>
          </div>
          <p>Bạn chưa cập nhật số điện thoại. Vui lòng cập nhật trước khi đặt lịch hẹn.</p>
          <div className="flex justify-center gap-4 mt-4">
            <button
              onClick={() => {
                navigate("/my-profile");
                setIsToastVisible(false);
              }}
              className="bg-green-500 text-white px-4 py-2 rounded transition duration-300 hover:bg-green-600"
            >
              Cập nhật
            </button>
            <button
              onClick={() => {
                toast.dismiss();
                setIsToastVisible(false);
              }}
              className="bg-gray-300 text-black px-4 py-2 rounded transition duration-300 hover:bg-gray-400"
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
      return;
    }
  
    // Hiển thị thông báo xác nhận
    toast.info(
      <div className="flex flex-col items-center justify-center">
        <div className="flex items-center mb-2">
          <p className="font-bold text-lg">Xác nhận</p>
        </div>
        <p>
          Bạn có chắc chắn muốn đặt lịch hẹn vào {formattedDate} ca {clickedEvent.title}?
        </p>
        <div className="flex justify-center gap-4 mt-4">
          <button
            onClick={async () => {
              toast.dismiss();
              await confirmBooking(appointmentData);
              setIsToastVisible(false);
            }}
            className="bg-green-500 text-white px-4 py-2 rounded transition duration-300 hover:bg-green-600"
          >
            Xác nhận
          </button>
          <button
            onClick={() => {
              toast.dismiss();
              setIsToastVisible(false);
            }}
            className="bg-gray-300 text-black px-4 py-2 rounded transition duration-300 hover:bg-gray-400"
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
    const loggedInUser = user || JSON.parse(localStorage.getItem("user"));
    if (!loggedInUser) {
      toast.warn("Vui lòng đăng nhập để đặt lịch hẹn.", {
        onClose: () => navigate("/account"),
        autoClose: 3000,
      });
      return;
    }
    try {
      const response = await axios.post(
        `${VITE_BACKEND_URI}/create-appointment/${patient_id}`,
        appointmentData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Đặt lịch hẹn thành công!");
    } catch (error) {
      console.error("Lỗi khi đặt lịch hẹn:", error.response?.data?.message);
      toast.error(error.response?.data?.message || "Có lỗi xảy ra khi đặt lịch hẹn.");
    }
  };

  return (
    <div className="bg-gray-100 min-h-max rounded-lg">
      <div className="container mx-auto p-4">
        <header className="text-center py-4 text-[#0091a1]">
          <h1 className="text-2xl md:text-3xl font-bold text-center mb-6">
            Lịch Làm Việc Của Bác Sĩ
          </h1>
        </header>
        <div className="calendar-container shadow-md rounded-lg overflow-hidden border border-gray-300 bg-white">
          {/* Thanh cuộn nằm ngang cho lịch */}
          <div className="overflow-x-auto" style={{ maxHeight: "640px", minWidth: "1200px" }}>
            <FullCalendar
              plugins={[resourceTimelinePlugin]}
              initialView="resourceTimelineWeek"
              resources={doctors}
              events={events}
              locale={viLocale}
              resourceAreaColumns={[
                {
                  headerContent: "Bác sĩ",
                  field: "doctorName",
                  cellContent: (args) => {
                    const { doctorImage, doctorName, specialization } = args.resource.extendedProps;
                    return (
                      <div className="flex items-center">
                        <img
                          src={doctorImage}
                          alt={doctorName}
                          className="w-8 h-8 rounded-full mr-2"
                        />
                        {doctorName}
                        <span className="text-sm ml-2 text-gray-500">({specialization})</span>
                      </div>
                    );
                  },
                },
              ]}
              eventContent={(args) => {
                const workShift = args.event.title;
                return (
                  <div className="flex items-center justify-center w-full h-full event-style">
                    <span>{workShift}</span>
                  </div>
                );
              }}
              headerToolbar={{
                left: "prev today next",
                center: "title",
                right: "resourceTimelineDay,resourceTimelineWeek",
              }}
              eventClassNames="event-style"
              slotMinTime="06:00:00"
              slotMaxTime="19:00:00"
              nowIndicator
              eventClick={handleEventClick}
              scrollTime="06:00:00"
            />
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default AllSchedule;
