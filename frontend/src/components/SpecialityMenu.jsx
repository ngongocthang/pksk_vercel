import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { convertToSlug } from "../utils/stringUtils";

const VITE_BACKEND_URI = import.meta.env.VITE_BACKEND_URI;

const SpecialityMenu = () => {
    const [specialityData, setSpecialityData] = useState([]);

    useEffect(() => {
        const fetchSpecialities = async () => {
            try {
                const response = await axios.get(`${VITE_BACKEND_URI}/specialization/find-all`);
                const data = response.data.specializations.map(item => ({
                    speciality: item.name,
                    image: item.image || './Dermatologist.svg' 
                }));
                setSpecialityData(data);
            } catch (error) {
                console.error('Error fetching specialities:', error);
            }
        };
        fetchSpecialities();
    }, []);

    return (
        <div className='flex flex-col items-center gap-4 py-12 text-gray-800' id='speciality'>
            <h1 className='text-3xl font-medium text-center'>Tìm Kiếm Theo Chuyên Ngành</h1>
            <p className='sm:w-2/3 text-center text-lg'>Khám phá danh sách đa dạng các bác sĩ uy tín, giúp bạn dễ dàng đặt lịch hẹn theo nhu cầu của mình.</p>
            <div className='flex sm:justify-center gap-4 pt-5 w-full overflow-scroll'>
                {specialityData.map((item, index) => (
                    <Link onClick={() => scrollTo(0, 0)} className='flex flex-col items-center text-xs cursor-pointer flex-shrink-0 hover:translate-y-[-10px] transition-all duration-500' key={index} to={`/doctors/${convertToSlug(item.speciality)}`}>
                        <img className='w-16 sm:w-24 mb-2' src={item.image} alt={item.speciality} />
                        <p className='text-lg'>{item.speciality}</p>
                    </Link>
                ))}
            </div>
        </div>
    );
}

export default SpecialityMenu;
