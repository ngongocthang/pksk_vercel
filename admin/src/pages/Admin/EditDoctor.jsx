import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { assets } from "../../assets/assets";
import { AdminContext } from "../../context/AdminContext";
import { toast } from "react-toastify";
import axios from "axios";

const EditDoctor = () => {
  const { backendUrl, aToken, spec, getAllSpecialists } = useContext(AdminContext);
  const { id } = useParams();
  const [formData, setFormData] = useState({
    image: null,
    name: "",
    phone: "",
    specialization_id: "",
    email: "",
    price: "",
    description: "",
    available: false,
  });
  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    getAllSpecialists();

    const fetchDoctorData = async () => {
      try {
        const response = await axios.get(`${backendUrl}/doctor/find/${id}`, {
          headers: {
            Authorization: `Bearer ${aToken}`,
          },
        });

        if (response.data.success) {
          const doctor = response.data.data;
          setFormData({
            image: null,
            name: doctor.user_id.name,
            phone: doctor.user_id.phone,
            specialization_id: doctor.specialization_id._id,
            email: doctor.user_id.email,
            price: doctor.price.toString(),
            description: doctor.description,
            available: doctor.available,
          });
          setPreviewImage(doctor.user_id.image);
        } else {
          toast.error("Không tìm thấy bác sĩ!");
        }
      } catch (error) {
        toast.error(error.response?.data.message || "Có lỗi xảy ra khi lấy thông tin bác sĩ!");
      }
    };

    fetchDoctorData();
  }, [id, backendUrl, aToken]);

  const formatPrice = (value) => {
    const numberValue = value.replace(/\D/g, ""); // Loại bỏ ký tự không phải số
    return numberValue.replace(/\B(?=(\d{3})+(?!\d))/g, "."); // Thêm dấu phân cách
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
  
    const validImageTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/bmp",
      "image/svg+xml",
      "image/webp",
    ];
  
    // Kiểm tra loại ảnh
    if (formData.image && !validImageTypes.includes(formData.image.type)) {
      return toast.error("Tệp tải lên phải là một ảnh.");
    }
  
    const numericPrice = formData.price.replace(/\./g, ""); // Loại bỏ dấu chấm
    const priceValue = Number(numericPrice);
  
    if (isNaN(priceValue) || priceValue < 0) {
      return toast.error("Giá khám phải là một số hợp lệ và không được nhỏ hơn 0!");
    }
  
    setLoading(true);
    const formDataToSend = new FormData();
  
    // Thêm các giá trị vào formData (không bị lặp key)
    formDataToSend.set("name", formData.name);
    formDataToSend.set("phone", formData.phone);
    formDataToSend.set("specialization_id", formData.specialization_id);
    formDataToSend.set("email", formData.email);
    formDataToSend.set("price", priceValue); // Đảm bảo giá trị là số
    formDataToSend.set("description", formData.description);
    formDataToSend.set("available", formData.available);
  
    // Chỉ thêm ảnh nếu có ảnh mới
    if (formData.image) {
      formDataToSend.set("image", formData.image);
    }
  
    try {
      const { data } = await axios.put(
        `${backendUrl}/doctor/admin-update-profile/${id}`,
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${aToken}`,
            // "Content-Type": "multipart/form-data", // Không cần thiết
          },
        }
      );
  
      if (data.success) {
        toast.success("Cập nhật bác sĩ thành công!");
        navigate("/doctor-list");
      } else {
        toast.error("Cập nhật bác sĩ thất bại!");
      }
    } catch (error) {
      toast.error(error.response?.data.message || "Có lỗi xảy ra!");
    } finally {
      setLoading(false);
    }
  };
  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({
      ...prev,
      image: file,
    }));
    setPreviewImage(URL.createObjectURL(file));
  };

  return (
    <form onSubmit={onSubmitHandler} className="m-5 w-full">
      <div className="flex justify-between items-center mb-4">
        <p className="text-3xl font-bold text-[#0091a1]">Chỉnh sửa bác sĩ</p>
      </div>
      <div className="overflow-x-auto bg-white p-4 rounded-md shadow-md">
        <div className="flex items-center gap-4 mb-8 text-gray-500">
          <label htmlFor="doc-img" className="cursor-pointer">
            <img
              className="w-24 h-24 object-cover bg-gray-100 border border-gray-300 shadow-md"
              src={previewImage || assets.upload_area}
              alt="Doctor's preview"
            />
          </label>
          <input onChange={handleImageChange} type="file" id="doc-img" hidden />
          {!formData.image && (
            <p className="text-base font-medium">Tải lên ảnh bác sĩ</p>
          )}
        </div>

        <div className="flex items-center gap-2 text-gray-500 mb-2">
          <input
            onChange={() => {
              setFormData((prev) => ({
                ...prev,
                available: !prev.available,
              }));
            }}
            checked={formData.available}
            type="checkbox"
            name="available"
            id="available-checkbox"
          />
          <label htmlFor="available-checkbox" className="cursor-pointer">
            Available
          </label>
        </div>

        <div className="flex flex-col lg:flex-row items-start gap-10 text-gray-500">
          <div className="w-full lg:flex-1 flex flex-col gap-4">
            <div className="flex-1 flex flex-col gap-1">
              <p className="font-bold">Tên bác sĩ</p>
              <input
                onChange={handleInputChange}
                name="name"
                value={formData.name}
                className="border rounded px-3 py-2"
                type="text"
                placeholder="Tên"
                required
              />
            </div>
            <div className="flex-1 flex flex-col gap-1">
              <p className="font-bold">Số điện thoại bác sĩ</p>
              <input
                onChange={handleInputChange}
                name="phone"
                value={formData.phone}
                className="border rounded px-3 py-2"
                type="tel"
                placeholder="Số điện thoại"
                required
              />
            </div>
            <div className="flex-1 flex flex-col gap-1">
              <p className="font-bold">Chuyên khoa</p>
              <select
                onChange={handleInputChange}
                name="specialization_id"
                value={formData.specialization_id}
                className="border rounded px-3 py-2"
                required
              >
                <option value="" disabled>
                  Chọn chuyên khoa
                </option>
                {spec.map((specialization) => (
                  <option key={specialization._id} value={specialization._id}>
                    {specialization.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="w-full lg:flex-1 flex flex-col gap-4">
            <div className="flex-1 flex flex-col gap-1">
              <p className="font-bold">Email bác sĩ</p>
              <input
                onChange={handleInputChange}
                name="email"
                value={formData.email}
                className="border rounded px-3 py-2"
                type="email"
                placeholder="Email"
                required
              />
            </div>
            <div className="flex-1 flex flex-col gap-1">
              <p className="font-bold">Giá khám:</p>
              <input
                onChange={(e) =>
                  handleInputChange({
                    target: {
                      name: "price",
                      value: formatPrice(e.target.value),
                    },
                  })
                }
                name="price"
                value={formData.price ? formatPrice(formData.price) : ""}
                className="border rounded px-3 py-2"
                type="text"
                placeholder="Giá khám"
                required
              />
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col gap-1 text-gray-500">
          <p className="mt-4 mb-2 font-bold">Giới thiệu</p>
          <textarea
            onChange={handleInputChange}
            name="description"
            value={formData.description}
            className="w-full border rounded px-4 pt-2"
            placeholder="Mô tả về bác sĩ"
            rows={5}
          />
        </div>

        <div className="flex justify-center items-center md:justify-start">
          <button
            type="submit"
            className={`bg-primary px-10 py-3 mt-4 text-white rounded-full ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-t-2 border-white border-solid rounded-full animate-spin" />
              </div>
            ) : (
              "Cập nhật bác sĩ"
            )}
          </button>
        </div>
      </div>
    </form>
  );
};

export default EditDoctor;
