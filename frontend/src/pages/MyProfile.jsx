import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";

const MyProfile = () => {
  const navigate = useNavigate();
  const { user, setUser } = useContext(AppContext);
  const [userData, setUserData] = useState({
    name: "",
    image: assets.profile_pic,
    email: "",
    phone: "",
  });

  const [isEdit, setIsEdit] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // State lưu trữ thông tin ban đầu khi bắt đầu chỉnh sửa
  const [originalData, setOriginalData] = useState({});

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Bạn chưa đăng nhập. Vui lòng đăng nhập để tiếp tục.");
        return navigate("/account");
      }

      try {
        const response = await fetch("http://localhost:5000/profilePatient", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorText = await response.text();
          toast.error("Có lỗi xảy ra: " + errorText);
          if (response.status === 401) {  // token hết hạn hoặc không hợp lệ
            toast.error("Token không hợp lệ, vui lòng đăng nhập lại.");
            navigate("/account"); // Chuyển hướng đến trang đăng nhập
          }
          return;
        }

        const data = await response.json();
        setUserData({
          name: data.user.name,
          image: data.user.image || assets.profile_pic,
          email: data.user.email,
          phone: data.user.phone,
        });
        setOriginalData({
          name: data.user.name,
          email: data.user.email,
          phone: data.user.phone,
        });
        setUser({ ...data.user });
      } catch (error) {
        toast.error("Có lỗi xảy ra: " + error.message);
      }
    };

    fetchUserProfile();
  }, [setUser, navigate]);

  const handleSave = async () => {
    const token = localStorage.getItem("token");
    const userIdString = localStorage.getItem("user");
    const userIdObj = JSON.parse(userIdString);
    const userId = userIdObj.id;

    if (!token) {
      toast.error("Bạn chưa đăng nhập. Vui lòng đăng nhập để tiếp tục.");
      return;
    }

    const bodyData = {
      name: userData.name,
      phone: userData.phone,
      email: userData.email,
    };

    // Chỉ thêm mật khẩu nếu có giá trị
    if (oldPassword) {
      bodyData.oldPassword = oldPassword;
    }
    if (newPassword) {
      bodyData.newPassword = newPassword;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/updateProfilePatient/${userId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(bodyData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message);
        return;
      }

      toast.success(data.message);
      setUser({
        ...user,
        name: userData.name,
      });

      setErrorMessage("");
      setIsEdit(false);
      setOldPassword("");
      setNewPassword("");
    } catch (error) {
      toast.error("Có lỗi xảy ra: " + error.message);
      console.log(error.message);
    }
  };


  const handleCancel = () => {
    // Khôi phục lại giá trị ban đầu và thoát khỏi chế độ chỉnh sửa
    setUserData(originalData);
    setOldPassword("");
    setNewPassword("");
    setErrorMessage("");
    setIsEdit(false);
  };

  // Kiểm tra nếu nút Lưu nên bị vô hiệu hóa
  const isSaveDisabled = () => {
    return isEdit && newPassword && !oldPassword;
  };

  return (
    <div className="flex items-center justify-center mb-16 px-4 sm:px-6 md:px-8">
      <div className="max-w-lg w-full flex flex-col gap-2 text-sm bg-white shadow-lg rounded-lg p-6">
        <p className="text-lg md:text-xl text-center font-semibold text-gray-600">Chào mừng, {userData.name}!</p>
        <div className="flex items-center justify-center">
          <img className="w-36 rounded" src={userData.image} alt="Profile" />
        </div>

        {isEdit ? (
          <div className="flex justify-center mt-4">
            <input
              className="bg-gray-50 text-3xl font-medium max-w-[100%] sm:max-w-[80%] text-center"
              type="text"
              value={userData.name}
              onChange={(e) =>
                setUserData((prev) => ({ ...prev, name: e.target.value }))
              }
            />
          </div>
        ) : (
          <p className="font-medium text-3xl text-neutral-800 mt-4 text-center">
            {userData.name}
          </p>
        )}

        <hr className="bg-zinc-400 h-[1px] border-none" />

        <div>
          <p className="text-neutral-500 underline mt-3 text-center">THÔNG TIN CHI TIẾT:</p>
          <div className="grid grid-cols-1 gap-y-2.5 mt-3 text-neutral-700 sm:grid-cols-2 sm:gap-x-6">
            <p className="font-medium text-gray-800 flex items-center">Email:</p>
            {isEdit ? (
              <input
                className="bg-white border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 max-w-[340px]"
                type="email"
                value={userData.email}
                onChange={(e) =>
                  setUserData((prev) => ({ ...prev, email: e.target.value }))
                }
              />
            ) : (
              <p className="text-gray-600">{userData.email}</p>
            )}

            <p className="font-medium text-gray-800 flex items-center">Số điện thoại:</p>
            {isEdit ? (
              <input
                className="bg-white border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 max-w-[340px]"
                type="tel"
                value={userData.phone}
                onChange={(e) =>
                  setUserData((prev) => ({ ...prev, phone: e.target.value }))
                }
              />
            ) : (
              <p className="text-gray-600">{userData.phone}</p>
            )}

            {isEdit && (
              <>
                <p className="font-medium text-gray-800 flex items-center">Mật khẩu mới:</p>
                <div className="relative flex items-center">
                  <input
                    className="bg-white border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full sm:w-[340px]"
                    type="text"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Nhập mật khẩu mới"
                  />
                </div>
                {newPassword && (
                  <>
                    <p className="font-medium text-gray-800 flex items-center">Mật khẩu cũ: </p>
                    <div className="relative flex items-center">
                      <input
                        className="bg-white border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full sm:w-[340px]"
                        type="text"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        placeholder="Nhập mật khẩu cũ"
                      />
                    </div>

                    <small className="text-neutral-400 italic">
                      Chỉ cần nhập mật khẩu cũ nếu bạn muốn thiết lập một mật khẩu mới.
                    </small>
                  </>
                )}
              </>
            )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-4">
          {isEdit ? (
            <>
              <button
                onClick={handleSave}
                className={`bg-blue-500 text-white py-2 px-4 rounded ${isSaveDisabled() ? "bg-gray-300 disabled-button" : ""
                  }`}
                disabled={isSaveDisabled()}
              >
                Lưu
              </button>
              <button
                onClick={handleCancel}
                className="bg-gray-500 text-white py-2 px-4 rounded"
              >
                Hủy
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEdit(true)}
              className="bg-blue-500 text-white py-2 px-4 rounded"
            >
              Chỉnh sửa
            </button>
          )}
        </div>

        <ToastContainer />
      </div>
    </div>
  );
};

export default MyProfile;
