import React, { useContext, useEffect } from 'react'
import { AdminContext } from '../../context/AdminContext'
import axios from 'axios';
import { toast } from 'react-toastify';

const DoctorsList = () => {
  const { doctors, aToken, getAllDoctors } = useContext(AdminContext)

  useEffect(() => {
    if (aToken) {
      getAllDoctors()
    }
  }, [aToken])

  const deleteDoctor = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:5000/doctor/delete/${id}`, {
        headers: {
          'Authorization': `Bearer ${aToken}`
        }
      });

      if (response.data.success) {
        toast.success("Đã xóa bác sĩ thành công!");
        getAllDoctors(); // Cập nhật danh sách bác sĩ
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error deleting doctor:", error);
      toast.error("Đã xảy ra lỗi khi xóa bác sĩ.");
    }
  }

  return (
    <div className='m-5 max-h-[90vh] overflow-y-scroll'>
      <h1 className='text-lg font-medium'>Tất cả bác sĩ</h1>
      <div className='w-full flex flex-wrap gap-4 pt-5 gap-y-6'>
        {
          doctors.map((item, index) => (
            <div className='border border-indigo-200 rounded-xl max-w-56 overflow-hidden cursor-pointer group' key={index}>
              <img className='bg-indigo-50 group-hover:bg-primary transition-all duration-500' src={item.user_id.image} alt="" />
              <div className='p-4'>
                <p className='text-neutral-800 text-lg font-medium'>{item.user_id.name}</p>
                <p className='text-zinc-600 text-sm'>{item.specialization_id.name}</p>
                <p className='text-zinc-600 text-sm'>{item.user_id.phone}</p>
                <p className='text-zinc-600 text-sm'>{item.user_id.email}</p>
                <button 
                  className='bg-red-500 text-white px-3 py-1 rounded mt-2'
                  onClick={() => deleteDoctor(item.user_id._id)} // Gọi hàm xóa khi nhấn nút
                >
                  Xoá
                </button>
              </div>
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default DoctorsList
