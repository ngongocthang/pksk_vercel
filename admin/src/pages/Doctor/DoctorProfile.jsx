import React, { useContext, useEffect, useState } from "react";
import { DoctorContext } from "../../context/DoctorContext";
import axios from "axios";
import { toast } from "react-toastify";

const DoctorProfile = () => {
  const { dToken, profileData, setProfileData, getProfileData, backendUrl } =
    useContext(DoctorContext);
  const [isEdit, setIsEdit] = useState(false);
  const [formData, setFormData] = useState({});
  const [selectedImage, setSelectedImage] = useState(null);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    if (profileData) {
      setFormData(profileData.doctorProfile); // Initialize form data
    }
  }, [profileData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleImageChange = (e) => {
    setSelectedImage(e.target.files[0]);
  };

  const updateProfile = async () => {
    try {
      const doctorInfo = JSON.parse(sessionStorage.getItem("doctorInfo"));
      const doctorId = doctorInfo ? doctorInfo.id : null;
      const updatedData = new FormData();
      updatedData.append("name", formData.name);
      updatedData.append("email", formData.email);
      updatedData.append("phone", formData.phone);
      updatedData.append("description", formData.description);
      if (selectedImage) {
        updatedData.append("image", selectedImage); // Add the selected image to form data
      }

      // Chỉ thêm mật khẩu cũ và mới nếu mật khẩu mới được nhập
      if (newPassword) {
        updatedData.append("oldPassword", oldPassword);
        updatedData.append("newPassword", newPassword);
      }

      const { data } = await axios.put(
        `${backendUrl}/doctor/update-profile/${doctorId}`,
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${dToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (data.success) {
        toast.success(data.message);
        setIsEdit(false);
        getProfileData(); // Refresh profile data
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
      console.log(error);
    }
  };

  useEffect(() => {
    if (dToken) {
      getProfileData();
    }
  }, [dToken]);

  return (
    profileData && (
      <div>
        <div className="flex flex-col gap-4 m-5">
          <div>
            {isEdit ? (
              <div>
                <img
                  className="bg-primary/80 w-full sm:max-w-64 rounded-lg"
                  src={
                    selectedImage
                      ? URL.createObjectURL(selectedImage)
                      : profileData.doctorProfile.image
                  }
                  alt=""
                />
                <input
                  type="file"
                  onChange={handleImageChange}
                  className="mt-2"
                />
              </div>
            ) : (
              <img
                className="bg-primary/80 w-full sm:max-w-64 rounded-lg"
                src={profileData.doctorProfile.image}
                alt=""
              />
            )}
          </div>
          <div className="flex-1 border border-stone-100 rounded-lg p-8 py-7 bg-white">
            {isEdit ? (
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="text-3xl font-medium text-gray-700 w-full bg-gray-100 border p-2 rounded"
              />
            ) : (
              <p className="text-3xl font-medium text-gray-700">
                {profileData.doctorProfile.name}
              </p>
            )}
            <div className="flex items-center gap-2 mt-1 text-gray-600">
              <button className="py-0.5 px-2 border text-xs rounded-full">
                {profileData.doctorProfile.specialization_id.name}
              </button>
            </div>
            <p>Email:</p>
            {isEdit ? (
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="bg-gray-100 w-full border p-2 rounded"
              />
            ) : (
              <p>{profileData.doctorProfile.email}</p>
            )}
            <p>Phone:</p>
            {isEdit ? (
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="bg-gray-100 w-full border p-2 rounded"
              />
            ) : (
              <p>{profileData.doctorProfile.phone}</p>
            )}
            <div>
              <p>Giới thiệu:</p>
              {isEdit ? (
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="bg-gray-100 w-full border p-2 rounded"
                />
              ) : (
                <p className="text-sm text-gray-600 max-w-[700px]">
                  {profileData.doctorProfile.description}
                </p>
              )}
            </div>
            {isEdit && (
              <div className="mt-4">
                <p>Mật khẩu mới:</p>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="bg-gray-100 w-full border p-2 rounded mb-2"
                  placeholder="Nhập mật khẩu mới"
                />
                {/* Chỉ hiển thị ô nhập mật khẩu cũ nếu mật khẩu mới đã được nhập */}
                {newPassword && (
                  <>
                    <p>Mật khẩu cũ:</p>
                    <input
                      type="password"
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      className="bg-gray-100 w-full border p-2 rounded mb-2"
                      placeholder="Nhập mật khẩu cũ"
                    />
                    <small className="text-neutral-500 italic">
                      Điền mật khẩu cũ và mới để thay đổi mật khẩu.
                    </small>
                  </>
                )}
              </div>
            )}
            {isEdit ? (
              <button
                onClick={updateProfile}
                className="px-4 py-1 border border-primary text-sm rounded-full mt-5 hover:bg-primary hover:text-white transition-all"
              >
                Lưu
              </button>
            ) : (
              <button
                onClick={() => setIsEdit(true)}
                className="px-4 py-1 border border-primary text-sm rounded-full mt-5 hover:bg-primary hover:text-white transition-all"
              >
                Chỉnh sửa
              </button>
            )}
          </div>
        </div>
      </div>
    )
  );
};

export default DoctorProfile;
