const Appointment = require("../models/Appointment");
const User = require("../models/User");
const transporter = require("../helpers/mailer-config");
const moment = require("moment");
require("moment/locale/vi");

const sendAppointmentReminders = async () => {
  try {
    const now = moment();
    const next24Hours = moment().add(24, 'hours');

    // Tìm tất cả các cuộc hẹn trong 24 giờ tới
    const upcomingAppointments = await Appointment.find({
      work_date: { $gte: now.toDate(), $lt: next24Hours.toDate() },
      status: "confirmed",
    })
      .populate("patient_id")
      .populate("doctor_id");

    for (const appointment of upcomingAppointments) {
      const patient = await User.findById(appointment.patient_id.user_id);
      const doctor = await User.findById(appointment.doctor_id.user_id);

      moment.locale('vi');

      const vietnamTime = moment.utc(appointment.work_date)
        .tz("Asia/Ho_Chi_Minh")
        .format("dddd, DD-MM-YYYY");

      // Chuyển chữ cái đầu tiên của ngày thành chữ in hoa
      const formattedVietnamTime = vietnamTime.charAt(0).toUpperCase() + vietnamTime.slice(1);

      const workShiftText = appointment.work_shift === "morning" ? "Sáng" : "Chiều";

      const mailOptionsPatient = {
        from: process.env.EMAIL_USER,
        to: patient.email,
        subject: "Nhắc nhở: Cuộc hẹn sắp tới",
        text: `Xin chào ${patient.name},\n\nĐây là lời nhắc nhở cho cuộc hẹn sắp tới của bạn vào ngày ${formattedVietnamTime} - Ca khám: ${workShiftText}.\n\nTrân trọng!`,
      };

      const mailOptionsDoctor = {
        from: process.env.EMAIL_USER,
        to: doctor.email,
        subject: "Nhắc nhở: Cuộc hẹn sắp tới",
        text: `Xin chào ${doctor.name},\n\nĐây là lời nhắc nhở cho cuộc hẹn sắp tới của bạn với bệnh nhân ${patient.name} vào ngày ${formattedVietnamTime} - Ca khám: ${workShiftText}.\n\nTrân trọng!`,
      };

      // Gửi email
      await Promise.all([
        transporter.sendMail(mailOptionsPatient),
        transporter.sendMail(mailOptionsDoctor),
      ]);
    }
  } catch (error) {
    console.error("Lỗi khi gửi nhắc nhở cuộc hẹn:", error);
  }
};

module.exports = sendAppointmentReminders;
