import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Footer from './components/Footer'
import Navbar from './components/Navbar'
import About from './pages/About'
import AllSchedule from './pages/AllSchedule'
import Appointment from './pages/Appointment'
import Contact from './pages/Contact'
import Doctors from './pages/Doctors'
import Home from './pages/Home'
import Login from './pages/Login'
import MedicalHistory from './pages/MedicalHistory'
import MyAppointments from './pages/MyAppointments'
import MyProfile from './pages/MyProfile'
import Notifications from './pages/Notifications'


const App = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-grow mx-4 sm:mx-[10%]">
        <Navbar />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/doctors' element={<Doctors />} />
          <Route path='/doctors/:speciality' element={<Doctors />} />
          <Route path='/account' element={<Login />} />
          <Route path='/abouts' element={<About />} />
          <Route path='/contact' element={<Contact />} />
          <Route path='/notifications' element={<Notifications />} />
          <Route path='/my-appointments' element={<MyAppointments />} />
          <Route path='/appointment/:docId' element={<Appointment />} />
          <Route path='/medical-history' element={<MedicalHistory />} />
          <Route path='/all-schedule' element={<AllSchedule />} />
          <Route path='/my-profile' element={<MyProfile />} />
        </Routes>
      </div>
      <Footer />
    </div>
  )
}

export default App;
