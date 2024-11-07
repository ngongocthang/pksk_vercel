import React, { useContext, useEffect } from 'react';
import { DoctorContext } from '../../context/DoctorContext';
import { AppContext } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';

const DoctorAppointments = () => {
    const { dToken, appointments, getAppointments, deleteAppointment, editAppointment } = useContext(DoctorContext);
    const { slotDateFormat } = useContext(AppContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (dToken) {
            getAppointments();
        }
    }, [dToken]);

    console.log("appointments: ", appointments);

    return (
        <div className='w-full max-w-6xl m-5'>
            <div className='flex justify-between items-center mb-3'>
                <p className='text-lg font-medium'>Tất cả lịch làm việc</p>
                <button
                    onClick={() => navigate('/doctor-create-schedule')}
                    className='flex items-center px-5 py-3 bg-[#a2dbde] text-white text-base rounded hover:bg-[#0091a1]'
                >
                    {/* SVG Icon */}
                    <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" />
                    </svg>
                    Tạo lịch làm việc
                </button>
            </div>
            <div className='bg-white border rounded text-sm max-h-[80vh] min-h-[50vh] overflow-y-scroll'>
                <div className='max-sm:hidden grid grid-cols-[0.5fr_2fr_1fr_1fr] gap-1 py-3 px-6 border-b'>
                    <p>#</p>
                    <p>Ngày làm việc</p>
                    <p>Ca làm việc</p>
                    <p>Hành động</p>
                </div>

                {appointments && appointments.length > 0 ? (
                    appointments.reverse().map((item, index) => (
                        <div
                            className='flex flex-wrap justify-between max-sm:gap-5 max-sm:text-base sm:grid grid-cols-[0.5fr_2fr_1fr_1fr] gap-1 items-center text-gray-500 py-3 px-6 border-b hover:bg-gray-50'
                            key={item._id}
                        >
                            <p className='max-sm:hidden'>{index + 1}</p>
                            <div className='flex items-center gap-2'>
                                <p>{item.patient_id.user_id.name}</p>
                            </div>
                            <p>{slotDateFormat(item.work_date)}</p>
                            {item.status === 'cancelled' ? (
                                <p className='text-red-400 text-xs font-medium'>Đã hủy</p>
                            ) : item.status === 'completed' ? (
                                <p className='text-green-500 text-xs font-medium'>Đã hoàn thành</p>
                            ) : (
                                <div className='flex gap-3'>
                                    {/* Sửa (cây bút) */}
                                    <svg
                                        onClick={() => window.location.href = `/edit-work-schedule/${item._id}`}
                                        className='w-6 h-6 cursor-pointer text-blue-500 hover:text-blue-600'
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 512 512"
                                    >
                                        <path d="M362.7 19.3L314.3 67.7 444.3 197.7l48.4-48.4c25-25 25-65.5 0-90.5L453.3 19.3c-25-25-65.5-25-90.5 0zm-71 71L58.6 323.5c-10.4 10.4-18 23.3-22.2 37.4L1 481.2C-1.5 489.7 .8 498.8 7 505s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L421.7 220.3 291.7 90.3z" />
                                    </svg>

                                    {/* Xóa (thùng rác) */}
                                    <svg
                                        onClick={() => console.log("Delete appointment", item._id)}
                                        className='w-6 h-6 cursor-pointer text-red-500 hover:text-red-600'
                                        fill="currentColor"
                                        viewBox="0 0 448 512"
                                    >
                                        <path d="M135.2 17.7L128 32 32 32C14.3 32 0 46.3 0 64S14.3 96 32 96l384 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-96 0-7.2-14.3C307.4 6.8 296.3 0 284.2 0L163.8 0c-12.1 0-23.2 6.8-28.6 17.7zM416 128L32 128 53.2 467c1.6 25.3 22.6 45 47.9 45l245.8 0c25.3 0 46.3-19.7 47.9-45L416 128z" />
                                    </svg>
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <p className='text-gray-500 text-center py-3'>Không tìm thấy lịch làm việc nào.</p>
                )}
            </div>
        </div>
    );
}

export default DoctorAppointments;