import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import axios from "axios";

const Doctors = () => {
  const { speciality } = useParams();
  const [filterDoc, setFilterDoc] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const [specializations, setSpecializations] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [doctorsPerPage] = useState(8);
  const navigate = useNavigate();
  const location = useLocation();

  const fetchDoctors = async () => {
    try {
      const response = await axios.get("http://localhost:5000/doctor/find-all");
      if (response.data.success && Array.isArray(response.data.doctors)) {
        setDoctors(response.data.doctors);
      } else {
        console.error("Invalid data format for doctors");
        setDoctors([]); // Thiết lập giá trị mặc định
      }
    } catch (error) {
      console.error("Error fetching doctors:", error);
    }
  };

  const fetchSpecializations = async () => {
    try {
      const response = await axios.get("http://localhost:5000/specialization/find-all");
      if (response.data.success && Array.isArray(response.data.specializations)) {
        setSpecializations(response.data.specializations);
      } else {
        console.error("Invalid data format for specializations");
        setSpecializations([]); // Thiết lập giá trị mặc định
      }
    } catch (error) {
      console.error("Error fetching specializations:", error);
    }
  };

  const applyFilter = () => {
    if (speciality) {
      const filtered = doctors.filter((doc) => doc.specialization_id.name === speciality);
      setFilterDoc(filtered);
    } else {
      setFilterDoc(doctors);
    }
  };

  useEffect(() => {
    fetchDoctors();
    fetchSpecializations();
  }, []);

  useEffect(() => {
    applyFilter();
  }, [doctors, speciality]);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const page = queryParams.get("page");
    setCurrentPage(page ? parseInt(page, 10) : 1);
  }, [location]);

  const indexOfLastDoctor = currentPage * doctorsPerPage;
  const indexOfFirstDoctor = indexOfLastDoctor - doctorsPerPage;

  const currentDoctors = Array.isArray(filterDoc) ? filterDoc.slice(indexOfFirstDoctor, indexOfLastDoctor) : [];
  const totalPages = Math.ceil(Array.isArray(filterDoc) ? filterDoc.length : 0 / doctorsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    const queryParams = new URLSearchParams(location.search);
    queryParams.set("page", page);
    navigate(`/doctors${speciality ? `/${speciality}` : ""}?${queryParams.toString()}`);
  };

  return (
    <div>
      <p className="text-gray-600">Duyệt qua các bác sĩ chuyên khoa.</p>
      <div className="flex flex-col sm:flex-row items-start gap-5 mt-5">
        <button
          className={`py-1 px-3 border rounded text-sm transition-all sm:hidden ${showFilter ? "bg-primary text-white" : ""}`}
          onClick={() => setShowFilter((prev) => !prev)}
        >
          Filters
        </button>
        <div className={`flex-col gap-4 text-[18px] text-gray-600 ${showFilter ? "flex" : "hidden sm:flex"}`}>
          {specializations.map((spec) => (
            <div
              key={spec._id}
              onClick={() => speciality === spec.name ? navigate("/doctors") : navigate(`/doctors/${spec.name}`)}
              className={`w-[263px] h-[49px] pl-3 pr-16 border border-gray-300 rounded transition-all cursor-pointer flex items-center ${speciality === spec.name ? "bg-indigo-100 text-black" : ""}`}
            >
              <p className="m-0">{spec.name}</p>
            </div>
          ))}
        </div>
        <div className="w-full grid grid-cols-4 gap-4 gap-y-6">
          {currentDoctors.map((item, index) => (
            <div
              onClick={() => navigate(`/appointment/${item._id}`)}
              className="border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500"
              key={index}
            >
              <img className="bg-blue-50" src={item.user_id.image} alt="" />
              <div className="p-4">
                <div className="flex items-center gap-2 text-sm text-center text-[#00759c]">
                  <p className="w-2 h-2 bg-[#00759c] rounded-full"></p>
                  <p>Đặt lịch</p>
                </div>
                <p className="text-gray-900 text-lg font-medium">{item.user_id.name}</p>
                <p className="text-gray-600 text-sm">{item.specialization_id ? item.specialization_id.name : "Chưa có chuyên khoa"}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-6 space-x-2">
          {Array.from({ length: totalPages }, (_, index) => {
            const page = index + 1;
            const shouldDisplay = page >= currentPage - 2 && page <= currentPage + 2;

            if (shouldDisplay) {
              return (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`py-1 px-3 border rounded ${page === currentPage ? "bg-indigo-500 text-white" : "text-gray-600"}`}
                >
                  {page}
                </button>
              );
            }
            return null;
          })}
        </div>
      )}
    </div>
  );
};

export default Doctors;



