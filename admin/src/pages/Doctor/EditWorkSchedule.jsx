import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { toast, ToastContainer } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css';

const EditWorkSchedule = ({ schedule, onUpdate }) => {
  const [scheduleForm, setScheduleForm] = useState({
    doctorName: schedule.doctorName || '',
    workDate: schedule.workDate || new Date(),
    timeSlot: schedule.timeSlot || '',
    specialty: schedule.specialty || 'pediatrics',
    notes: schedule.notes || '',
  });

  useEffect(() => {
    setScheduleForm({
      doctorName: schedule.doctorName || '',
      workDate: schedule.workDate || new Date(),
      timeSlot: schedule.timeSlot || '',
      specialty: schedule.specialty || 'pediatrics',
      notes: schedule.notes || '',
    });
  }, [schedule]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setScheduleForm({ ...scheduleForm, [name]: value });
  };

  const handleDateChange = (date) => {
    setScheduleForm({ ...scheduleForm, workDate: date });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Updated Doctor Schedule:', scheduleForm);
    // Call the update function passed as a prop
    onUpdate(scheduleForm);
    // Display toast notification
    toast.success("Lịch làm việc của bác sĩ đã được cập nhật thành công!");
  };

  return (
    <div className='max-w-2xl mx-auto p-5'>
      <div className='bg-white p-8 rounded-lg shadow-lg'>
        <h2 className='text-2xl font-semibold mb-5'>Chỉnh Sửa Lịch Làm Việc Của Bác Sĩ</h2>
        <form onSubmit={handleSubmit} className='space-y-5'>

          {/* Specialty */}
          <div>
            <label className='block text-gray-700 mb-2'>Chuyên khoa</label>
            <select
              name='specialty'
              value={scheduleForm.specialty}
              onChange={handleInputChange}
              required
              className='w-full p-3 border rounded focus:outline-none focus:border-blue-500'
            >
              <option value='pediatrics'>Nhi khoa</option>
              <option value='general'>Chung</option>
              <option value='cardiology'>Tim mạch</option>
              <option value='neurology'>Thần kinh</option>
              {/* Thêm các chuyên khoa khác nếu cần */}
            </select>
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

          {/* Ghi chú */}
          <div>
            <label className='block text-gray-700 mb-2'>Ghi chú</label>
            <textarea
              name='notes'
              value={scheduleForm.notes}
              onChange={handleInputChange}
              rows='4'
              className='w-full p-3 border rounded focus:outline-none focus:border-blue-500'
            ></textarea>
          </div>

          {/* Nút gửi */}
          <button
            type='submit'
            className='w-full py-3 mt-5 bg-[#a2dbde] text-white rounded hover:bg-[#0091a1] font-semibold'
          >
            Cập Nhật Lịch Làm Việc
          </button>
        </form>
      </div>
      {/* Toast container */}
      <ToastContainer />
    </div>
  );
};

export default EditWorkSchedule;
