import React, { useContext, useEffect } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import { AdminContext } from './context/AdminContext';
import { DoctorContext } from './context/DoctorContext';
import AddDoctor from './pages/Admin/AddDoctor';
import AddPatient from './pages/Admin/AddPatient';
import AllAppointments from './pages/Admin/AllAppointments';
import Dashboard from './pages/Admin/Dashboard';
import DoctorsList from './pages/Admin/DoctorsList';
import EditPatient from './pages/Admin/EditPatient';
import PatientList from './pages/Admin/PatientList';
import ConfirmationAppointments from './pages/Doctor/ConfirmationAppointments';
import ConfirmCompletedAppointments from './pages/Doctor/ConfirmCompletedAppointments';
import DoctorAppointments from './pages/Doctor/DoctorAppointments';
import DoctorCreateSchedule from './pages/Doctor/DoctorCreateSchedule';
import DoctorDashboard from './pages/Doctor/DoctorDashboard';
import DoctorProfile from './pages/Doctor/DoctorProfile';
import DoctorWorkSchedule from './pages/Doctor/DoctorWorkSchedule';
import EditWorkSchedule from './pages/Doctor/EditWorkSchedule';
import Login from './pages/Login';
import Forbidden from "./components/Forbidden";

const App = () => {
  const { aToken } = useContext(AdminContext);
  const { dToken } = useContext(DoctorContext);
  const navigate = useNavigate();

  useEffect(() => {
    // Nếu không có token, điều hướng đến trang đăng nhập
    if (!aToken && !dToken) {
      navigate('/login');
    }
  }, [aToken, dToken, navigate]);

  return (
    <div className='bg-[#F8F9FD]'>
      <ToastContainer />
      {aToken || dToken ? (
        <>
          <Navbar />
          <div className='flex items-start'>
            <Sidebar />
            <Routes>
              {/* Admin Route */}
              <Route path="/" element={aToken ? <Dashboard /> : <Forbidden />} />
              <Route path="/admin-dashboard" element={aToken ? <Dashboard /> : <Forbidden />} />
              <Route path="/all-appointments" element={aToken ? <AllAppointments /> : <Forbidden />} />
              <Route path="/add-doctor" element={aToken ? <AddDoctor /> : <Forbidden />} />
              <Route path="/doctor-list" element={aToken ? <DoctorsList /> : <Forbidden />} />
              <Route path="/doctor-list/:speciality" element={aToken ? <DoctorsList /> : <Forbidden />} />
              <Route path="/patient-list" element={aToken ? <PatientList /> : <Forbidden />} />
              <Route path="/add-patient" element={aToken ? <AddPatient /> : <Forbidden />} />
              <Route path="/edit-patient/:id" element={aToken ? <EditPatient /> : <Forbidden />} />

              {/* Doctor Route */}
              <Route path="/doctor-dashboard" element={dToken ? <DoctorDashboard /> : <Forbidden />} />
              <Route path="/doctor-appointments" element={dToken ? <DoctorAppointments /> : <Forbidden />} />
              <Route path="/confirm-completed-appointments" element={dToken ? <ConfirmCompletedAppointments /> : <Forbidden />} />
              <Route path="/doctor-profile" element={dToken ? <DoctorProfile /> : <Forbidden />} />
              <Route path="/doctor-work-schedule" element={dToken ? <DoctorWorkSchedule /> : <Forbidden />} />
              <Route path="/doctor-create-schedule" element={dToken ? <DoctorCreateSchedule /> : <Forbidden />} />
              <Route path="/confirmation-appointments" element={dToken ? <ConfirmationAppointments /> : <Forbidden />} />
              <Route path="/edit-work-schedule/:id" element={dToken ? <EditWorkSchedule /> : <Forbidden />} />
            </Routes>
          </div>
        </>
      ) : (
        <Login />
      )}
    </div>
  );
};

export default App;

