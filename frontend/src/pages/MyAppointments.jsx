import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AppContext } from "../context/AppContext";

const VITE_BACKEND_URI = import.meta.env.VITE_BACKEND_URI;

const MyAppointments = () => {
  const { user, setUser } = useContext(AppContext);
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [isLoadingCancel, setIsLoadingCancel] = useState(false);
  const navigate = useNavigate();
  const toastId = React.useRef(null);

  const formatPrice = (price) => {
    if (isNaN(price)) return price;
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const checkPaymentStatus = async (appointmentId) => {
    try {
      const response = await axios.get(
        `${VITE_BACKEND_URI}check-payment-status/${appointmentId}`
      );

      if (response.data.success) {
        return response.data.status;
      }
    } catch (error) {
      console.error("Error checking payment status:", error);
      return false;
    }
  };

  const fetchAppointments = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("User not authenticated. Please log in.");
      navigate("/account");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(`${VITE_BACKEND_URI}user-appointment`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = response.data;
      const updatedAppointments = await Promise.all(
        data.map(async (appointment) => {
          const paymentStatus = await checkPaymentStatus(appointment._id);
          return { ...appointment, paymentStatus };
        })
      );

      setAppointments(updatedAppointments);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      if (error.response && error.response.status === 401) {
        setError("User not authenticated. Please log in.");
        navigate("/account");
      } else {
        setError("Failed to fetch appointments");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
    const queryParams = new URLSearchParams(window.location.search);
    const appointmentId = queryParams.get("appointmentId");
    if (appointmentId) {
      fetchAppointments();
    }
  }, [setUser, navigate, user?.token]);

  const handleCancelAppointment = (appointmentId) => {
    const appointment = appointments.find((appt) => appt._id === appointmentId);
    const appointmentDate = new Date(appointment.work_date).toLocaleDateString("vi-VN");
    const appointmentShift = appointment.work_shift === "morning" ? "Buổi sáng" : "Buổi chiều";

    const confirmCancel = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("User not authenticated. Please log in.");
        return;
      }

      try {
        setIsLoadingCancel(appointmentId);
        const response = await axios.put(
          `${VITE_BACKEND_URI}cancel-appointment/${appointmentId}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.success) {
          toast.error("Có lỗi xảy ra khi hủy cuộc hẹn.");
        } else {
          toast.success("Cuộc hẹn đã được hủy thành công!");
          fetchAppointments();
        }
      } catch (error) {
        console.error("Error canceling appointment:", error);
        toast.error("Bạn chỉ huỷ cuộc hẹn trước 24h." || error.response?.data?.message);
      } finally {
        setIsLoadingCancel(null);
      }
    };

    if (!toast.isActive(toastId.current)) {
      toastId.current = toast.warn(
        <div className="flex flex-col items-center justify-center">
          <div className="flex items-center mb-2">
            <p className="font-bold text-lg">Thông báo</p>
          </div>
          <p>
            Bạn có chắc chắn muốn hủy cuộc hẹn ngày {appointmentDate} vào {appointmentShift} này không?
          </p>
          <div className="flex justify-center gap-4 mt-4">
            <button
              onClick={() => {
                toast.dismiss(toastId.current);
                confirmCancel();
              }}
              className="bg-red-600 text-white px-4 py-2 rounded transition duration-300 hover:bg-red-700"
            >
              Có
            </button>
            <button
              onClick={() => toast.dismiss(toastId.current)}
              className="bg-gray-300 text-black px-4 py-2 rounded transition duration-300 hover:bg-gray-400"
            >
              Không
            </button>
          </div>
        </div>,
        {
          closeOnClick: false,
          draggable: false,
          autoClose: false,
          position: "top-center",
        }
      );
    }
  };

  const handlePayment = async (appointmentId, price) => {
    try {
      const response = await axios.post(
        `${VITE_BACKEND_URI}payment/${appointmentId}`,
        { price },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      if (response.data.resultCode === 0) {
        const shortLink = response.data.payUrl;
        window.location.href = shortLink;
      }
    } catch (error) {
      console.error("Error making payment:", error);
      toast.error("Có lỗi xảy ra khi thực hiện thanh toán.");
    }
  };

  // Trạng thái để kiểm soát việc hiển thị lịch hẹn đã hủy
  const [showCanceled, setShowCanceled] = useState(false);

  return (
    <div className="mb-10">
      <p className="pb-3 mt-12 font-medium text-zinc-700 border-b text-xl flex justify-between items-center">
        Lịch hẹn của tôi:
        <button
          onClick={() => setShowCanceled((prev) => !prev)}
          className="cursor-pointer font-medium text-zinc-400 text-sm"
        >
          {showCanceled ? "Ẩn lịch hẹn đã hủy" : "Hiện lịch hẹn đã hủy"}
        </button>
      </p>
      <div className="appointments-container overflow-y-auto h-[550px]"> {/* Thêm lớp này */}
        {loading ? (
          <p className="text-center text-gray-500 mt-5">Đang tải dữ liệu...</p>
        ) : appointments.length === 0 ? (
          <p className="text-center text-gray-500 mt-5">
            Hiện tại bạn không có lịch hẹn.
          </p>
        ) : (
          appointments
            .filter((appointment) => showCanceled || appointment.status !== "canceled")
            .map((appointment) => (
              <div
                className="relative grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-2 border-b"
                key={appointment._id}
              >
                <div>
                  <img
                    className="w-32 bg-indigo-50"
                    src={
                      appointment.doctor_id
                        ? appointment.doctor_id.user_id.image
                        : "Không có ảnh"
                    }
                    alt="Doctor"
                  />
                </div>
                <div className="flex-1 text-sm text-zinc-600">
                  <p className="text-lg text-neutral-800 font-semibold">
                    Bệnh nhân:{" "}
                    {appointment.patient_id
                      ? appointment.patient_id.user_id.name
                      : "Không có tên"}
                  </p>
                  <p className="text-neutral-800 font-semibold">
                    Bác sĩ:{" "}
                    {appointment.doctor_id
                      ? appointment.doctor_id.user_id.name
                      : "Không có tên"}
                  </p>
                  <p className="text-xs mt-1">
                    <span className="text-sm text-neutral-700 font-medium">
                      Ngày khám:
                    </span>{" "}
                    {new Date(appointment.work_date).toLocaleDateString("vi-VN")}
                  </p>
                  <p className="text-xs mt-1">
                    <span className="text-sm text-neutral-700 font-medium">
                      Ca khám:
                    </span>{" "}
                    {appointment.work_shift === "morning"
                      ? "Buổi sáng"
                      : "Buổi chiều"}
                  </p>
                  <p className="text-xs mt-1">
                    <span className="text-sm text-neutral-700 font-medium">
                      Trạng thái:
                    </span>{" "}
                    <span
                      className={`${appointment.status === "pending"
                          ? "text-yellow-500"
                          : appointment.status === "confirmed"
                            ? "text-green-500"
                            : "text-red-500"
                        }`}
                    >
                      {appointment.status === "pending"
                        ? "Đang chờ"
                        : appointment.status === "confirmed"
                          ? "Đã xác nhận"
                          : "Đã hủy"}
                    </span>
                  </p>
                  <p className="text-xs mt-1">
                    <span className="text-sm text-neutral-700 font-medium">
                      Giá khám:
                    </span>{" "}
                    {appointment.doctor_id
                      ? formatPrice(appointment.doctor_id.price)
                      : "0"}{" "}
                    (VND)
                  </p>
                  <p className="text-xs mt-1">
                    <span className="text-sm text-neutral-700 font-medium">
                      Trạng thái thanh toán:
                    </span>{" "}
                    <span
                      className={`${appointment.paymentStatus
                          ? "text-green-500"
                          : "text-yellow-500"
                        }`}
                    >
                      {appointment.paymentStatus
                        ? "Đã thanh toán"
                        : "Chưa thanh toán"}
                    </span>
                  </p>
                </div>
                <div className="flex flex-col gap-2 justify-end">
                  {/* Nút thanh toán */}
                  <button
                    onClick={() =>
                      handlePayment(
                        appointment._id,
                        appointment.doctor_id.price
                      )
                    }
                    className={`text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded transition-all duration-300 ${!appointment.paymentStatus && appointment.status === "confirmed"
                        ? "hover:bg-primary hover:text-white"
                        : "bg-gray-300 cursor-not-allowed"
                      }`}
                    disabled={
                      appointment.status !== "confirmed" ||
                      appointment.paymentStatus
                    }
                  >
                    Thanh toán trực tuyến
                  </button>
                  {/* Nút hủy */}
                  <button
                    onClick={() => handleCancelAppointment(appointment._id)}
                    className={`text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded transition-all duration-300 ${appointment.paymentStatus || appointment.status === "canceled"
                        ? "bg-gray-300 cursor-not-allowed"
                        : "hover:bg-red-600 hover:text-white"
                      }`}
                    disabled={
                      appointment.paymentStatus ||
                      appointment.status === "canceled" ||
                      isLoadingCancel === appointment._id
                    }
                  >
                    {isLoadingCancel === appointment._id ? "Đang hủy..." : "Hủy"}
                  </button>
                </div>
              </div>
            ))
        )}
      </div>
    </div>
  );
};

export default MyAppointments;
