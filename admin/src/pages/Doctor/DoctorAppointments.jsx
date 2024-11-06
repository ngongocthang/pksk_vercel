import React, { useContext, useEffect } from 'react';
import { DoctorContext } from '../../context/DoctorContext';
import { AppContext } from '../../context/AppContext';
import { assets } from '../../assets/assets';

const DoctorAppointments = () => {
  const { dToken, appointments, getAppointments } = useContext(DoctorContext);
  // const { dToken, appointments, getAppointments, completeAppointment, cancelAppointment } = useContext(DoctorContext);
  const { slotDateFormat } = useContext(AppContext);

  useEffect(() => {
    if (dToken) {
      getAppointments();
    }
  }, [dToken]);

  console.log("appointments: ".appointments);

  return (
    <div className='w-full max-w-6xl m-5'>
      <p className='mb-3 text-lg font-medium'>Tất cả lịch hẹn</p>
      <div className='bg-white border rounded text-sm max-h-[80vh] min-h-[50vh] overflow-y-scroll'>
        <div className='max-sm:hidden grid grid-cols-[0.5fr_2fr_1fr_1fr] gap-1 py-3 px-6 border-b'>
          <p>#</p>
          <p>Bệnh nhân</p>
          <p>Ngày khám</p>
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
                <div className='flex'>
                  {/* <img
                    onClick={() => cancelAppointment(item._id)}
                    className='w-10 cursor-pointer'
                    src={assets.cancel_icon}
                    alt="Cancel icon"
                  />
                  <img
                    onClick={() => completeAppointment(item._id)}
                    className='w-10 cursor-pointer'
                    src={assets.tick_icon}
                    alt="Complete icon"
                  /> */}
                </div>
              )}
            </div>
          ))
        ) : (
          <p className='text-gray-500 text-center py-3'>Không tìm thấy lịch hẹn.</p>
        )}
      </div>
    </div>
  );
}

export default DoctorAppointments;
