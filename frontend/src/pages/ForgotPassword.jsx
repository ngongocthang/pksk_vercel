import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const VITE_BACKEND_URI = import.meta.env.VITE_BACKEND_URI;

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false); // State cho hiệu ứng loading

    // Loading spinner
    const LoadingSpinner = () => (
        <div className="w-5 h-5 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
    );

    const handleForgotPassword = async (event) => {
        event.preventDefault();

        if (!email) {
            toast.error("Vui lòng nhập email hợp lệ!");
            return;
        }

        setLoading(true); // Bắt đầu loading khi gửi yêu cầu

        try {
            const response = await axios.post(`${VITE_BACKEND_URI}/forgot-password`, { email });

            if (response.status === 200) {
                toast.success("Email khôi phục mật khẩu đã được gửi!");
                setTimeout(() => navigate("/account"), 1000);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error("Lỗi:", error);
            toast.error("Đã xảy ra lỗi! Vui lòng thử lại sau.");
        } finally {
            setLoading(false); // Dừng loading sau khi xử lý xong
        }
    };

    return (
        <div className="flex items-start justify-center min-h-screen bg-white">
            <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-sm w-full mt-32">
                <h2 className="text-xl font-semibold mb-4">Khôi phục mật khẩu</h2>
                <form onSubmit={handleForgotPassword}>
                    <input
                        type="email"
                        placeholder="Nhập email của bạn"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="border border-zinc-300 rounded w-full p-2"
                    />
                    <button
                        type="submit"
                        className="bg-[#00759c] text-white py-2 rounded-md mt-4 w-full flex justify-center items-center"
                        disabled={loading} // Disable button khi loading
                    >
                        {loading ? (
                            <LoadingSpinner /> // Hiển thị spinner khi đang load
                        ) : (
                            "Gửi yêu cầu"
                        )}
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate("/account")}
                        className="mt-3 text-[#00759c] underline cursor-pointer"
                    >
                        Quay lại
                    </button>
                </form>
            </div>
            <ToastContainer />
        </div>
    );
};

export default ForgotPassword;
