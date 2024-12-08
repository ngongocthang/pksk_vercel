import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { assets } from "../../assets/assets";
import { AdminContext } from "../../context/AdminContext";

const EditSpecialty = () => {
    const [docImg, setDocImg] = useState(null);
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [specialization_id, setSpecialization_id] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [price, setPrice] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);

    const { backendUrl, aToken, spec, getAllSpecialists } =
        useContext(AdminContext);
    const navigate = useNavigate();
    const { id } = useParams();  // Lấy ID chuyên khoa từ URL

    useEffect(() => {
        // Lấy thông tin chuyên khoa cần chỉnh sửa
        const fetchSpecialty = async () => {
            try {
                const { data } = await axios.get(
                    `${backendUrl}/doctor/${id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${aToken}`,
                        },
                    }
                );
                if (data.success) {
                    const specialty = data.specialty;
                    setDocImg(specialty.image);
                    setName(specialty.name);
                    setPhone(specialty.phone);
                    setEmail(specialty.email);
                    setPrice(specialty.price);
                    setDescription(specialty.description);
                    setSpecialization_id(specialty.specialization_id);
                } else {
                    toast.error("Không tìm thấy chuyên khoa!");
                }
            } catch (error) {
                toast.error("Có lỗi xảy ra khi tải thông tin chuyên khoa!");
            }
        };

        fetchSpecialty();
    }, [id, backendUrl, aToken]);

    const formatPrice = (value) => {
        const numberValue = value.replace(/\D/g, "");
        return numberValue.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    };

    const onSubmitHandler = async (event) => {
        event.preventDefault();

        if (!docImg) {
            return toast.error("Ảnh không được trống!");
        }

        const validImageTypes = [
            "image/jpeg",
            "image/png",
            "image/gif",
            "image/bmp",
            "image/svg+xml",
            "image/webp",
        ];

        if (!validImageTypes.includes(docImg.type)) {
            return toast.error("Tệp tải lên phải là một ảnh.");
        }

        const numericPrice = price.replace(/\./g, "");
        const priceValue = Number(numericPrice);

        if (isNaN(priceValue) || priceValue < 0) {
            return toast.error(
                "Giá khám phải là một số hợp lệ và không được nhỏ hơn 0!"
            );
        }

        setLoading(true);

        const formData = new FormData();
        formData.append("image", docImg);
        formData.append("name", name);
        formData.append("phone", phone);
        formData.append("specialization_id", specialization_id);
        formData.append("email", email);
        formData.append("password", password);
        formData.append("description", description);
        formData.append("price", priceValue);

        try {
            const { data } = await axios.put(
                `${backendUrl}/doctor/update/${id}`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${aToken}`,
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            if (data.success) {
                toast.success("Chỉnh sửa chuyên khoa thành công!");
                navigate("/doctor-list");
            } else {
                toast.error("Chỉnh sửa chuyên khoa thất bại!");
            }
        } catch (error) {
            toast.error(error.response?.data.message || "Có lỗi xảy ra!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={onSubmitHandler} className="m-5 w-full">
            <div className="flex justify-between items-center mb-4">
                <p className="text-3xl font-bold text-[#0091a1]">Chỉnh sửa chuyên khoa</p>
            </div>
            <div className="overflow-x-auto bg-white p-4 rounded-md shadow-md">
                <div className="flex items-center gap-4 mb-8 text-gray-500">
                    <label htmlFor="doc-img" className="cursor-pointer">
                        <img
                            className="w-24 h-24 object-cover bg-gray-100 rounded-full border border-gray-300 shadow-md"
                            src={docImg ? URL.createObjectURL(docImg) : assets.upload_area}
                            alt="Doctor's preview"
                        />
                    </label>
                    <input
                        onChange={(e) => setDocImg(e.target.files[0])}
                        type="file"
                        id="doc-img"
                        hidden
                    />
                    {!docImg && (
                        <p className="text-base font-medium">Tải lên ảnh chuyên khoa</p>
                    )}
                </div>

                <div className="flex flex-col lg:flex-row items-start gap-10 text-gray-500">
                    <div className="w-full lg:flex-1 flex flex-col gap-4">
                        <div className="flex-1 flex flex-col gap-1">
                            <p className="font-bold">Chuyên khoa</p>
                            <input
                                onChange={(e) => setName(e.target.value)}
                                value={name}
                                className="border rounded px-3 py-2"
                                type="text"
                                placeholder="Tên"
                                required
                            />
                        </div>
                    </div>
                </div>

                <div className="flex-1 flex flex-col gap-1 text-gray-500">
                    <p className="mt-4 mb-2 font-bold">Giới thiệu</p>
                    <textarea
                        onChange={(e) => setDescription(e.target.value)}
                        value={description}
                        className="w-full border rounded px-4 pt-2"
                        placeholder="Mô tả về chuyên khoa"
                        rows={5}
                    />
                </div>

                <div className="flex justify-center items-center md:justify-start">
                    <button
                        type="submit"
                        className={`bg-primary px-10 py-3 mt-4 text-white rounded-full ${loading ? "opacity-50 cursor-not-allowed" : ""
                            }`}
                        disabled={loading}
                    >
                        {loading ? (
                            <div className="flex items-center justify-center">
                                <div className="w-5 h-5 border-t-2 border-white border-solid rounded-full animate-spin"></div>
                            </div>
                        ) : (
                            "Chỉnh sửa chuyên khoa"
                        )}
                    </button>
                </div>
            </div>
        </form>
    );
};

export default EditSpecialty;
