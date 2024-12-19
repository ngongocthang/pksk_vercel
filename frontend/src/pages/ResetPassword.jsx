import axios from "axios";
import { Eye, EyeOff } from "lucide-react"; // Import Eye and EyeOff icons
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom"; // Import useNavigate
import { toast } from "react-toastify";

const VITE_BACKEND_URI = import.meta.env.VITE_BACKEND_URI;

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); // State cho hiệu ứng loading
  const [showPassword, setShowPassword] = useState(false); // State cho việc hiển thị mật khẩu

  // Loading spinner
  const LoadingSpinner = () => (
    <div className="w-5 h-5 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
  );

  const handleResetPassword = async (event) => {
    event.preventDefault();
    setLoading(true); // Bắt đầu loading khi gửi yêu cầu

    try {
      const response = await axios.post(
        `${VITE_BACKEND_URI}/reset-password/${token}`,
        { password },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = response.data;

      if (response.status === 200) {
        toast.success("Mật khẩu đã được đặt lại thành công!");
        navigate("/account"); // Điều hướng đến trang đăng nhập
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error(error.response?.data.message || "Đã xảy ra lỗi! Vui lòng thử lại sau.");
    } finally {
      setLoading(false); // Dừng loading sau khi xử lý xong
    }
  };

  const handleGoBack = () => {
    navigate("/account");
  };

  return (
    <div className="flex items-start justify-center min-h-screen bg-white">
      <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-sm w-full mt-32">
        <h2 className="text-xl font-semibold mb-4">Đặt lại mật khẩu</h2>
        <form onSubmit={handleResetPassword}>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"} // Hiển thị mật khẩu hoặc ẩn mật khẩu
              placeholder="Nhập mật khẩu mới"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="border border-zinc-300 rounded w-full p-2"
            />
            {password && (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            )}
          </div>
          <button
            type="submit"
            className="bg-[#00759c] text-white py-2 rounded-md mt-4 w-full flex justify-center items-center"
            disabled={loading} // Disable button khi loading
          >
            {loading ? (
              <LoadingSpinner /> // Hiển thị spinner khi đang load
            ) : (
              "Đặt lại mật khẩu"
            )}
          </button>
          <button
            type="button"
            onClick={handleGoBack}
            className="mt-3 text-[#00759c] underline cursor-pointer"
          >
            Quay lại
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
