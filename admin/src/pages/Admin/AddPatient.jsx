import React, { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const AddPatient = () => {
    const [patientImg, setPatientImg] = useState(false);
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate(); // Initialize navigate

    const onSubmitHandler = async (event) => {
        event.preventDefault();

        try {
            setLoading(true); // Set loading to true during the request
            const formData = new FormData();
            formData.append("name", name);
            formData.append("phone", phone);
            formData.append("email", email);
            formData.append("password", password);
            formData.append("description", description);

            const { data } = await axios.post("YOUR_API_ENDPOINT", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            setLoading(false); // Set loading to false after the request

            if (data.success) {
                toast.success("Thêm bệnh nhân thành công!");
                setPatientImg(false);
                setName("");
                setPhone("");
                setPassword("");
                setEmail("");
                setDescription("");
            } else {
                toast.error("Thêm bệnh nhân thất bại!");
            }
        } catch (error) {
            setLoading(false); // Set loading to false in case of error
            toast.error(error.response?.data.message || "Đã xảy ra lỗi.");
            console.log(error.response?.data || error.message);
        }
    };

    const onCancelHandler = () => {
        navigate("/patient-list"); // Navigate to the patient list page
    };

    return (
        <form onSubmit={onSubmitHandler} className="m-5 w-full">
            <p className="mb-3 text-lg font-medium">Thêm bệnh nhân</p>
            <div className="bg-white px-8 py-8 border rounded w-full max-w-4xl max-h-[80vh] overflow-y-scroll">
                <div className="flex flex-col lg:flex-row items-start gap-10 text-gray-500">
                    <div className="w-full lg:flex-1 flex flex-col gap-4">
                        <div className="flex-1 flex flex-col gap-1">
                            <p className="font-bold">Tên bệnh nhân</p>
                            <input
                                onChange={(e) => setName(e.target.value)}
                                value={name}
                                className="border rounded px-3 py-2"
                                type="text"
                                placeholder="Tên"
                            />
                        </div>
                        <div className="flex-1 flex flex-col gap-1">
                            <p className="font-bold">Số điện thoại bệnh nhân</p>
                            <input
                                onChange={(e) => setPhone(e.target.value)}
                                value={phone}
                                className="border rounded px-3 py-2"
                                type="tel"
                                placeholder="Số điện thoại"
                            />
                        </div>
                    </div>

                    <div className="w-full lg:flex-1 flex flex-col gap-4">
                        <div className="flex-1 flex flex-col gap-1">
                            <p className="font-bold">Email bệnh nhân</p>
                            <input
                                onChange={(e) => setEmail(e.target.value)}
                                value={email}
                                className="border rounded px-3 py-2"
                                type="email"
                                placeholder="Email"
                            />
                        </div>
                        <div className="flex-1 flex flex-col gap-1">
                            <p className="font-bold">Mật khẩu</p>
                            <input
                                onChange={(e) => setPassword(e.target.value)}
                                value={password}
                                className="border rounded px-3 py-2"
                                type="text"
                                placeholder="Mật khẩu"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex gap-4 mt-4">
                    <button
                        type="submit"
                        className={`bg-primary px-10 py-3 text-white rounded-full ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={loading}
                    >
                        {loading ? (
                            <div className="flex items-center justify-center">
                                <div className="w-5 h-5 border-t-2 border-white border-solid rounded-full animate-spin"></div>
                            </div>
                        ) : (
                            "Thêm bệnh nhân"
                        )}
                    </button>
                    <button
                        type="button"
                        onClick={onCancelHandler}
                        className="bg-gray-300 px-10 py-3 text-black rounded-full hover:bg-gray-400"
                    >
                        Hủy
                    </button>
                </div>
            </div>
        </form>
    );
};

export default AddPatient;
