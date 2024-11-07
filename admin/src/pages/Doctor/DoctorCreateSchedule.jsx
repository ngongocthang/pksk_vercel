import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { toast, ToastContainer } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css';

const CreateDoctorSchedule = () => {
  const [scheduleForm, setScheduleForm] = useState({
    doctorName: '',
    workDate: new Date(),
    timeSlot: '',
    specialty: 'pediatrics',
    notes: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setScheduleForm({ ...scheduleForm, [name]: value });
  };

  const handleDateChange = (date) => {
    setScheduleForm({ ...scheduleForm, workDate: date });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Doctor Schedule Created:', scheduleForm);
    // Display toast notification
    toast.success("Bạn đã đăng ký lịch làm việc thành công!");
  };

  return (
    <div className='max-w-2xl mx-auto p-5'>
      <div className='bg-white p-8 rounded-lg shadow-lg'>
        <h2 className='text-2xl font-semibold mb-5'>Tạo Lịch Làm Việc Cho Bác Sĩ</h2>
        <form onSubmit={handleSubmit} className='space-y-5'>

          {/* Specialty */}
          <div>
            <label className='block text-gray-700 mb-2'>Chuyên khoa</label>
            <p className='w-full p-3 border rounded bg-gray-100 text-gray-700'>
              Nhi khoa
            </p>
          </div>

          {/* Ngày làm việc */}
          <div>
            <label className='block text-gray-700 mb-2'>Ngày làm việc</label>
            <DatePicker
              selected={scheduleForm.workDate}
              onChange={handleDateChange}
              dateFormat="dd/MM/yyyy"
              className='w-full p-3 border rounded focus:outline-none focus:border-blue-500'
            />
          </div>

          {/* Ca làm việc */}
          <div>
            <label className='block text-gray-700 mb-2'>Ca làm việc</label>
            <select
              name='timeSlot'
              value={scheduleForm.timeSlot}
              onChange={handleInputChange}
              required
              className='w-full p-3 border rounded focus:outline-none focus:border-blue-500'
            >
              <option value='' disabled>Chọn ca làm việc</option>
              <option value='morning'>Buổi sáng</option>
              <option value='afternoon'>Buổi chiều</option>
              <option value='allday'>Cả ngày</option>
            </select>
          </div>

          {/* Nút gửi */}
          <button
            type='submit'
            className='w-full py-3 mt-5 bg-[#a2dbde] text-white rounded hover:bg-[#0091a1] font-semibold'
          >
            Tạo Lịch Làm Việc
          </button>
        </form>
      </div>
      {/* Toast container */}
      <ToastContainer />
    </div>
  );
};

export default CreateDoctorSchedule;
