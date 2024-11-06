import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

const TopDoctors = () => {
    const navigate = useNavigate();
    const { doctors, setDoctors } = useContext(AppContext);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const response = await fetch('http://localhost:5000/doctor/find-all');
                if (!response.ok) {
                    throw new Error('Failed to fetch doctors');
                }
                const data = await response.json();
                setDoctors(data);
            } catch (err) {
                setError(err.message);
            } 
        };

        fetchDoctors();
    }, [setDoctors]);

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className='flex flex-col items-center gap-4 my-16 text-gray-900 md:mx-10'>
            <h1 className='text-3xl font-medium'>Các Bác Sĩ Hàng Đầu Để Đặt Lịch Hẹn</h1>
            <p className='sm:w-1/2 text-center'>Khám phá danh sách phong phú các bác sĩ uy tín của chúng tôi để dễ dàng lên lịch hẹn.</p>
            <div className='w-full grid grid-cols-5 gap-4 pt-5 gap-y-6 px-3 sm:px-0'>
                {doctors.slice(0, 10).map((item, index) => (
                    <div 
                        onClick={() => { navigate(`/appointment/${item._id}`); scrollTo(0, 0); }} 
                        className='border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500' 
                        key={index}
                    >
                        <img className='bg-blue-50' src={item.user_id.image} alt={item.user_id.name} />
                        <div className='p-4'>
                            <div className='flex items-center gap-2 text-sm text-center text-green-500 text-[#00759c]'>
                                <p className='w-2 h-2 bg-[#00759c] rounded-full'></p><p>Đặt lịch</p>
                            </div>
                            <p className='text-gray-900 text-lg font-medium'>{item.user_id.name}</p>
                            <p className='text-gray-600 text-sm'>{item.specialization_id ? item.specialization_id.name : 'Chưa có chuyên khoa'}</p>
                        </div>
                    </div>
                ))}
            </div>
            <button onClick={() => { navigate('/doctors'); scrollTo(0, 0); }} className='bg-blue-50 text-gray-600 px-12 py-3 rounded-full mt-10'>Tất cả</button>
        </div>
    );
};

export default TopDoctors;