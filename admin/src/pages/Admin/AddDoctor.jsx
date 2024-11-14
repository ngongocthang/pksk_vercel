import React, { useContext, useEffect } from 'react';
import { assets } from '../../assets/assets';
import { useState } from 'react';
import { AdminContext } from '../../context/AdminContext';
import { toast } from 'react-toastify';
import axios from 'axios';

const AddDoctor = () => {
    const [docImg, setDocImg] = useState(false);
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [specialization_id, setSpecialization_id] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [description, setDescription] = useState('');

    const { backendUrl, aToken, spec, getAllSpecialists } = useContext(AdminContext);

    useEffect(() => {
        getAllSpecialists();
    }, []);

    const onSubmitHandler = async (event) => {
        event.preventDefault();

        try {
            if (!docImg) {
                return toast.error('Ảnh không được trống!');
            }

            const formData = new FormData();
            formData.append('image', docImg);
            formData.append('name', name);
            formData.append('phone', phone);
            formData.append('specialization_id', specialization_id);
            formData.append('email', email);
            formData.append('password', password);
            formData.append('description', description);

            // Gửi yêu cầu với Content-Type là multipart/form-data
            const { data } = await axios.post(`${backendUrl}/doctor/create`, formData, {
                headers: {
                    'Authorization': `Bearer ${aToken}`, // Đảm bảo sử dụng token đúng
                    'Content-Type': 'multipart/form-data' // Thiết lập Content-Type
                }
            });

            if (data.success) {
                toast.success(data.message);
                setDocImg(false);
                setName('');
                setPhone('');
                setPassword('');
                setEmail('');
                setDescription('');
                setSpecialization_id('');
            } else {
                toast.error(data.message);
            }

        } catch (error) {
            toast.error(error.message || "Tạo mới bác sĩ thất bại!");
            console.log(error.response?.data || error.message);
        }
    };

    return (
        <form onSubmit={onSubmitHandler} className='m-5 w-full'>
            <p className='mb-3 text-lg font-medium'>Thêm bác sĩ</p>
            <div className='bg-white px-8 py-8 border rounded w-full max-w-4xl max-h-[80vh] overflow-y-scroll'>
                <div className='flex items-center gap-4 mb-8 text-gray-500'>
                    <label htmlFor="doc-img" className="cursor-pointer">
                        <img
                            className='w-24 h-24 object-cover bg-gray-100 rounded-full border border-gray-300 shadow-md'
                            src={docImg ? URL.createObjectURL(docImg) : assets.upload_area}
                            alt="Doctor's preview"
                        />
                    </label>
                    <input onChange={(e) => setDocImg(e.target.files[0])} type="file" id="doc-img" hidden />
                    {!docImg && <p className="text-base font-medium">Tải lên ảnh bác sĩ</p>}
                </div>

                <div className='flex flex-col lg:flex-row items-start gap-10 text-gray-500'>
                    <div className='w-full lg:flex-1 flex flex-col gap-4'>
                        <div className='flex-1 flex flex-col gap-1'>
                            <p>Tên bác sĩ</p>
                            <input onChange={(e) => setName(e.target.value)} value={name} className='border rounded px-3 py-2' type="text" placeholder='Tên' required />
                        </div>
                        <div className='flex-1 flex flex-col gap-1'>
                            <p>Số điện thoại bác sĩ</p>
                            <input onChange={(e) => setPhone(e.target.value)} value={phone} className='border rounded px-3 py-2' type="tel" placeholder='Số điện thoại' required />
                        </div>
                        <div className='flex-1 flex flex-col gap-1'>
                            <p>Chuyên khoa</p>
                            <select onChange={(e) => setSpecialization_id(e.target.value)} value={specialization_id} className='border rounded px-3 py-2' required>
                                <option value="" disabled>Chọn chuyên khoa</option>
                                {spec.map((specialization) => (
                                    <option key={specialization._id} value={specialization._id}>{specialization.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className='w-full lg:flex-1 flex flex-col gap-4'>
                        <div className='flex-1 flex flex-col gap-1'>
                            <p>Email bác sĩ</p>
                            <input onChange={(e) => setEmail(e.target.value)} value={email} className='border rounded px-3 py-2' type="email" placeholder='Email' required />
                        </div>
                        <div className='flex-1 flex flex-col gap-1'>
                            <p>Mật khẩu</p>
                            <input onChange={(e) => setPassword(e.target.value)} value={password} className='border rounded px-3 py-2' type="text" placeholder='Mật khẩu' required />
                        </div>
                    </div>
                </div>

                <div className='flex-1 flex flex-col gap-1'>
                    <p className='mt-4 mb-2'>Giới thiệu</p>
                    <textarea onChange={(e) => setDescription(e.target.value)} value={description} className='w-full border rounded px-4 pt-2' placeholder='Mô tả về bác sĩ' rows={5} required />
                </div>

                <button type='submit' className='bg-primary px-10 py-3 mt-4 text-white rounded-full'>Thêm bác sĩ</button>
            </div>
        </form>
    );
}

export default AddDoctor;
