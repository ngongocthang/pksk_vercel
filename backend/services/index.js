const Appointment = require("../models/Appointment");
const User = require("../models/User");
const transporter = require("../helpers/mailer-config");
const moment = require("moment");
require("moment/locale/vi");

const sendAppointmentReminders = async () => {
  try {
    const now = new Date();
    const next24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    // Tìm tất cả các cuộc hẹn trong 24 giờ tới
    const upcomingAppointments = await Appointment.find({
      work_date: { $gte: now, $lt: next24Hours },
      status: "confirmed",
    })
      .populate("patient_id")
      .populate("doctor_id");

    for (const appointment of upcomingAppointments) {
      const patient = await User.findById(appointment.patient_id.user_id);
      const doctor = await User.findById(appointment.doctor_id.user_id);
      console.log("Original work_date from DB:", appointment.work_date);


      moment.locale("vi");

      // Định dạng ngày gốc trong database (UTC)
      const formattedDate = moment.utc(appointment.work_date).format("dddd, DD-MM-YYYY");

      const converWorkShift =
        appointment.work_shift === "morning" ? "Buổi sáng" : "Buổi chiều";

      const mailOptionsPatient = {
        from: process.env.EMAIL_USER,
        to: patient.email,
        subject: "Nhắc nhở: Cuộc hẹn sắp tới",
        text: `Xin chào ${patient.name},\n\nĐây là lời nhắc nhở cho cuộc hẹn sắp tới của bạn vào ngày: ${formattedDate} - ${converWorkShift}.\n\nTrân trọng!`,
      };

      const mailOptionsDoctor = {
        from: process.env.EMAIL_USER,
        to: doctor.email,
        subject: "Nhắc nhở: Cuộc hẹn sắp tới",
        text: `Xin chào ${doctor.name},\n\nĐây là lời nhắc nhở cho cuộc hẹn sắp tới của bạn với bệnh nhân ${patient.name} vào ngày: ${formattedDate} - ${converWorkShift}.\n\nTrân trọng!`,
      };

      // Gửi email
      await transporter.sendMail(mailOptionsPatient);
      await transporter.sendMail(mailOptionsDoctor);
    }
  } catch (error) {
    console.error("Error:", error);
  }
};


module.exports = sendAppointmentReminders;
