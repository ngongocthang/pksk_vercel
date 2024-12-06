import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const VITE_BACKEND_URI = import.meta.env.VITE_BACKEND_URI;

const AddPatient = () => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate(); // Initialize navigate

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    setLoading(true); // Set loading to true during the request

    try {
      // Tạo đối tượng dữ liệu để gửi
      const data = {
        name,
        phone,
        email,
        password,
      };

      const response = await axios.post(
        `${VITE_BACKEND_URI}/patient/create`,
        data,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      setLoading(false);

      if (response.data.success) {
        toast.success("Thêm bệnh nhân thành công!");
        setName("");
        setPhone("");
        setEmail("");
        setPassword("");
      } else {
        toast.error("Thêm bệnh nhân thất bại!");
      }
    } catch (error) {
      setLoading(false); // Set loading to false in case of error
      toast.error("Email đã được sử dụng!" || error.response?.data.message);
      // toast.error(error.response?.data.message || "Đã xảy ra lỗi.");
    }
  };

  const onCancelHandler = () => {
    navigate("/patient-list"); // Navigate to the patient list page
  };

  return (
    // <form onSubmit={onSubmitHandler} className="m-5 w-full max-w-screen-lg mx-2">
    <form onSubmit={onSubmitHandler} className="m-5 w-full">
      <p className="text-2xl md:text-3xl ml-3 mb-4 font-bold text-[#0091a1]">
        Tất Cả Bệnh Nhân
      </p>
      <div className="bg-white px-6 py-8 border rounded-lg shadow-lg w-full max-h-full overflow-y-auto">
        <div className="flex flex-col lg:flex-row gap-8 text-gray-500">
          {/* Phần nhập liệu bên trái */}
          <div className="w-full lg:w-1/2 flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <label className="font-semibold text-sm text-gray-700">Tên:</label>
              <input
                onChange={(e) => setName(e.target.value)}
                value={name}
                className="border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
    navigate("/patient-list");
  };

  return (
    <form onSubmit={onSubmitHandler} className="m-5 w-full">
      <div className="flex justify-between items-center mb-4">
        <p className="md:text-3xl text-xl font-bold text-[#0091a1]">
          Thêm bệnh nhân
        </p>
      </div>
      <div className="overflow-x-auto bg-white p-4 rounded-md shadow-md">
        <div className="flex flex-col lg:flex-row items-start gap-10 text-gray-500">
          <div className="w-full lg:flex-1 flex flex-col gap-4">
            <div className="flex-1 flex flex-col gap-1">
              <p className="font-bold">Tên:</p>
              <input
                onChange={(e) => setName(e.target.value)}
                value={name}
                className="border rounded px-3 py-2"
                type="text"
                placeholder="Họ và Tên"
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-semibold text-sm text-gray-700">Số điện thoại:</label>
              <input
                onChange={(e) => setPhone(e.target.value)}
                value={phone}
                className="border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                type="tel"
                placeholder="(+84) 123 456 789"
                required
              />
            </div>
          </div>

          {/* Phần nhập liệu bên phải */}
          <div className="w-full lg:w-1/2 flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <label className="font-semibold text-sm text-gray-700">Email:</label>
              <input
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                className="border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                type="email"
                placeholder="Email bệnh nhân"
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-semibold text-sm text-gray-700">Mật khẩu:</label>
              <input
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                className="border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                type="text"
                placeholder="Xy6abG"
                required
              />
            </div>
          </div>
        </div>

        {/* Nút submit và hủy */}
        <div className="flex gap-6 mt-6 justify-center sm:justify-start">
          <button
            type="submit"
            className={`bg-primary text-white font-semibold px-6 py-3 rounded-full transition-all duration-300 hover:bg-blue-700 ${loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}

            </div>
            <div className="flex-1 flex flex-col gap-1">
              <p className="font-bold">Mật khẩu</p>
              <input
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                className="border rounded px-3 py-2"
                type="text"
                placeholder="Xy6abG"
                required
              />
            </div>
          </div>
        </div>

        <div className="flex gap-4 mt-4">
          <button
            type="submit"
            className={`bg-primary px-10 py-3 text-white rounded-full ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-t-2 border-white border-solid rounded-full animate-spin"></div>
              </div>
            ) : (
              "Tạo"
            )}
          </button>
          <button
            type="button"
            onClick={onCancelHandler}
            className="bg-gray-300 text-black font-semibold px-6 py-3 rounded-full transition-all duration-300 hover:bg-gray-400"
          >
            Hủy
          </button>
        </div>
      </div>
    </form>
  );
};

export default AddPatient;