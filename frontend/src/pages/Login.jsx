import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react"; // Import Eye and EyeOff icons
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AppContext } from "../context/AppContext";

const VITE_BACKEND_URI = import.meta.env.VITE_BACKEND_URI;

const Login = () => {
  const VITE_META_CLIENT_ID = import.meta.env.VITE_META_CLIENT_ID;
  const navigate = useNavigate();
  const { setUser } = useContext(AppContext);

  const [state, setState] = useState("Login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    setLoading(true);
    const url =
      state === "Sign Up"
        ? `${VITE_BACKEND_URI}/register`
        : `${VITE_BACKEND_URI}/login`;
    const requestBody = {
      email,
      password,
      ...(state === "Sign Up" && { name, phone }),
    };

    try {
      const response = await axios.post(url, requestBody, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = response.data;

      if (state === "Sign Up") {
        setState("Login");
        toast.success("Đăng ký thành công! Vui lòng đăng nhập.");
      } else {
        if (data.user && data.user.token) {
          if (data.user.role === "doctor" || data.user.role === "admin") {
            toast.error("Bạn không thể đăng nhập với quyền này!");
          } else {
            setUser(data.user);
            localStorage.setItem("token", data.user.token);
            localStorage.setItem("user", JSON.stringify(data.user));
            navigate("/");
          }
        } else {
          toast.error("Không tìm thấy thông tin đăng nhập hợp lệ!");
        }
      }
    } catch (error) {
      console.error("Error:", error);
      if (state === "Login") {
        toast.error("Đăng nhập thất bại!");
      } else {
        toast.error(error.response?.data?.message || "Có lỗi xảy ra!");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSuccessGoogleLogin = async (credentialResponse) => {
    const { credential } = credentialResponse;

    try {
      const response = await axios.post(`${VITE_BACKEND_URI}/google-login`, {
        credential,
      });

      const data = response.data;
      if (data.user && data.user.token) {
        setUser(data.user);
        localStorage.setItem("token", data.user.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        navigate("/");
      }
    } catch (error) {
      toast.error(`Đã xảy ra lỗi! Vui lòng thử lại sau.`);
      console.log("Login Failed:", error);
    }
  };

  const handleErrorGoogleLogin = (error) => {
    toast.error(`Đã xảy ra lỗi! Vui lòng thử lại sau.`);
    console.log("Login Failed:", error);
  };

  return (
    <>
      <form
        className="min-h-[80vh] flex items-center"
        onSubmit={onSubmitHandler}>
        <div className="flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-zinc-600 text-sm shadow-lg">
          <div className="flex flex-col items-center w-full">
            <p className="text-2xl font-semibold text-center">
              {state === "Sign Up" ? "Tạo tài khoản" : "Đăng nhập"}
            </p>
            <p className="text-center">
              Vui lòng {state === "Sign Up" ? "đăng ký" : "đăng nhập"} để đặt
              lịch hẹn
            </p>
          </div>

          {state === "Sign Up" && (
            <>
              <div className="w-full">
                <p>Tên đầy đủ</p>
                <input
                  className="border border-zinc-300 rounded w-full p-2 mt-1"
                  type="text"
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                  required
                />
              </div>
              <div className="w-full">
                <p>Số điện thoại</p>
                <input
                  className="border border-zinc-300 rounded w-full p-2 mt-1"
                  type="tel"
                  onChange={(e) => setPhone(e.target.value)}
                  value={phone}
                  required
                />
              </div>
            </>
          )}

          <div className="w-full">
            <p>Email</p>
            <input
              className="border border-zinc-300 rounded w-full p-2 mt-1"
              type="email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              required
            />
          </div>

          <div className="w-full relative">
            <p>Mật khẩu</p>
            <input
              className="border border-zinc-300 rounded w-full p-2 mt-1"
              type={showPassword ? "text" : "password"}
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              required
            />
            {password && (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-transparent border-none cursor-pointer flex items-center justify-center pt-6"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            )}
          </div>

          <button
            className={`bg-[#00759c] text-white w-full py-2 rounded-md text-base ${loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            disabled={loading}
          >
            {loading
              ? "Đang xử lý..."
              : state === "Sign Up"
                ? "Tạo tài khoản"
                : "Đăng nhập"}
          </button>

          <div className="flex justify-center w-full">
            <GoogleLogin
              onSuccess={handleSuccessGoogleLogin}
              onError={handleErrorGoogleLogin}
            />
          </div>

          <div className="flex flex-col items-center text-center w-full mt-3">
            {state === "Sign Up" ? (
              <p>
                Đã có tài khoản?{" "}
                <span
                  onClick={() => setState("Login")}
                  className="text-[#00759c] underline cursor-pointer"
                >
                  Đăng nhập tại đây
                </span>
              </p>
            ) : (
              <p>
                Tạo một tài khoản mới?{" "}
                <span
                  onClick={() => setState("Sign Up")}
                  className="text-[#00759c] underline cursor-pointer"
                >
                  bấm vào đây
                </span>
              </p>
            )}

            <button
              type="button"
              onClick={() => navigate("/forgot-password")}
              className="text-[#00759c] underline cursor-pointer mt-2"
            >
              Quên mật khẩu?
            </button>
          </div>
        </div>
      </form>
      <ToastContainer />
    </>
  );
};

export default Login;
