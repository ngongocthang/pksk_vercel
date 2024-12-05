import axios from "axios";
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

const ResetPassword = () => {
  const { token } = useParams();
  const [password, setPassword] = useState("");

  const handleResetPassword = async (event) => {
    event.preventDefault();

    try {
        const response = await axios.post(`http://localhost:5000/reset-password/${token}`, {
            password,
        }, {
            headers: {
                "Content-Type": "application/json",
            },
        });

        const data = response.data;

        // Kiểm tra mã trạng thái HTTP
        if (response.status === 200) {
            toast.success("Mật khẩu đã được đặt lại thành công!");
        } else {
            toast.error(data.message);
        }
    } catch (error) {
        console.error("Error:", error);
        toast.error("Đã xảy ra lỗi! Vui lòng thử lại sau.");
    }
};


  return (
    <form onSubmit={handleResetPassword}>
      <input
        type="password"
        placeholder="Nhập mật khẩu mới"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit">Đặt lại mật khẩu</button>
    </form>
  );
};

export default ResetPassword;
