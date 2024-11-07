// doctorappointment
import React, { useContext, useEffect } from 'react';
import { DoctorContext } from '../../context/DoctorContext';
import { assets } from '../../assets/assets';

const DoctorAppointments = () => {
  const { dToken, appointments, getAppointments, completeAppointment, cancelAppointment } = useContext(DoctorContext);

  useEffect(() => {
    if (dToken) {
      getAppointments();
    }
  }, [dToken]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB'); // 'en-GB' for dd/mm/yyyy format
  };

  return (
    <div className='w-full max-w-6xl m-5'>
      <p className='mb-4 text-lg font-medium'>Các lịch hẹn chờ xác nhận:</p>
      <div className='bg-white border rounded text-sm max-h-[80vh] min-h-[50vh] overflow-y-scroll'>
        
        {/* Header Row */}
        <div className='max-sm:hidden grid grid-cols-[0.5fr_2fr_1fr_1fr_2fr_auto] gap-4 py-4 px-6 border-b text-center'>
          <p>#</p>
          <p>Bệnh nhân</p>
          <p>Ngày khám</p>
          <p>Ca khám</p>
          <p className='justify-self-end'>Hành động</p> {/* Align action column to the right */}
        </div>

        {/* Appointment Rows */}
        {appointments && appointments.length > 0 ? (
          appointments.reverse().map((item, index) => (
            <div className='grid grid-cols-[0.5fr_2fr_1fr_1fr_2fr_auto] items-center gap-4 py-4 px-6 border-b hover:bg-gray-50' key={index}>
              <p className='max-sm:hidden text-center'>{index + 1}</p>
              {/* <p className='text-base text-center'>{item.patient_id.user_id.name}</p> */}
              <p className='text-base text-center'>{formatDate(item.work_date)}</p>
              <p className='text-base text-center'>{item.work_shift}</p>
              {item.cancelled ? (
                <p className='text-red-400 text-xs font-medium text-center'>Cancelled</p>
              ) : item.isCompleted ? (
                <p className='text-green-500 text-xs font-medium text-center'>Completed</p>
              ) : (
                <div className='flex gap-3 justify-self-end'> {/* Align action icons to the right */}
                  <img onClick={() => cancelAppointment(item._id)} className='w-8 cursor-pointer' src={assets.cancel_icon} alt="Cancel" />
                  <img onClick={() => completeAppointment(item._id)} className='w-8 cursor-pointer' src={assets.tick_icon} alt="Complete" />
                </div>
              )}
            </div>
          ))
        ) : (
          <p className='text-gray-500 py-3 text-center'>Không có lịch hẹn nào chờ được xác nhận.</p>
        )}
      </div>
    </div>
  );
};

export default DoctorAppointments;
