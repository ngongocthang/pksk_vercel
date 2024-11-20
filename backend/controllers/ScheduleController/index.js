const Appointment = require("../../models/Appointment");
const Schedule = require("../../models/Schedule");
const Doctor = require("../../models/Doctor");
const validateSchedule = require("../../requests/validateSchedule");
const transporter = require("../../helpers/mailer-config");

const createSchedule = async (req, res) => {
  try {
    // Validate dữ liệu từ client
    const { error } = validateSchedule(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const schedule = await Schedule.create(req.body);
    if (schedule) {
      return res.status(200).json(schedule);
    }
    return res.status(400).json({ message: "Schedule not found" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const findAllSchedule = async (req, res) => {
  try {
    const schedule = await Schedule.find({});
    if (schedule) {
      return res.status(200).json(schedule);
    }
    return res.status(400).json({ message: "Schedule not found" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const findSchedule = async (req, res) => {
  try {
    const { id } = req.params;
    const schedule = await Schedule.findById(id);
    if (schedule) {
      return res.status(200).json(schedule);
    }
    return res.status(400).json({ message: "Schedule not found" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const updateSchedule = async (req, res) => {
  try {
    // Validate dữ liệu từ client
    const { error } = validateSchedule(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { id } = req.params;
    const schedule = await Schedule.findByIdAndUpdate(id, req.body);
    if (!schedule) {
      return res.status(400).json({ message: "Schedule not found" });
    }
    const scheduleUpdate = await Schedule.findById(id);
    return res.status(200).json(scheduleUpdate);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const deleteSchedule = async (req, res) => {
  try {
    const { id } = req.params;
    const schedule = await Schedule.findById(id);
    if (!schedule) {
      return res.status(400).json({ success: false, message: "Schedule not found" });
    }

    const now = new Date();
    const workDate = new Date(schedule.work_date);
    // Tính toán thời gian còn lại đến lịch làm việc
    const timeDifference = workDate - now;

    // Kiểm tra nếu thời gian còn lại lớn hơn 24 giờ (24 * 60 * 60 * 1000 milliseconds)
    if (timeDifference > 24 * 60 * 60 * 1000) {
      await Schedule.findByIdAndDelete(id);
      return res.status(200).json({ success: true, message: "Delete schedule success!" });
    }

    return res.status(400).json({ success: false, message: "Cannot delete schedule less than 24 hours before the appointment!" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};


const getScheduleByDoctor = async (req, res) => {
  try {
    const { id } = req.params;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const doctor = await Doctor.findOne({_id: id});
    if (!doctor) {
      return res.status(400).json({ message: "Doctor not found" }); 
    }
    const schedules = await Schedule.find({
      doctor_id: doctor._id,
      work_date: { $gte: today },
    }).sort({ work_date: 1 });
    if (schedules.length <= 0) {
      return res.status(400).json({ message: "Schedule not found" });
    }
    return res.status(200).json(schedules);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
const getScheduleByDoctorDashboard = async (req, res) => {
  try {
    const { id } = req.params;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const doctor = await Doctor.findOne({user_id: id});
    if (!doctor) {
      return res.status(400).json({ message: "Doctor not found" }); 
    }
    const schedules = await Schedule.find({
      doctor_id: doctor._id,
      work_date: { $gte: today },
    }).sort({ work_date: 1 });
    if (schedules.length <= 0) {
      return res.status(400).json({ message: "Schedule not found" });
    }
    return res.status(200).json(schedules);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const doctorCreateSchedule = async (req, res) => {
  try {
    const { id } = req.params;
    const doctor = await Doctor.findOne({ user_id: id });
    if (!doctor) {
      return res.status(400).json({ message: "Doctor not found" });
    } 
    const schedule = await Schedule.create({
      ...req.body,
      doctor_id: doctor._id});
    if (schedule) {
      return res.status(200).json({ success: true, schedule});
    }
    return res.status(400).json({ success: false, message: "Schedule not found" });
    } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getSchedule = async (req, res) => {
  try {
    const { id } = req.params;
    const schedule = await Schedule.findById(id);
    if (!schedule) {
      return res.status(400).json({success: false, message: "Schedule not found" });
    }
    return res.status(200).json({success: true, schedule});
  } catch (error) {
    return res.status(500).json({success: false, message: error.message });
  }
};

const doctorUpdateSchedule = async (req, res) => {
  try { 
    const { id } = req.params;
    const user_id = req.body.id;
    const doctor = await Doctor.findOne({ user_id: user_id });
    
    if (!doctor) {
      return res.status(400).json({ message: "Doctor not found" });
    }
    
    const findSchedule = await Schedule.findById(id);
    
    if (!findSchedule) {
      return res.status(400).json({ success: false, message: "Schedule not found" });
    }
    
    const now = new Date();
    const workDate = new Date(findSchedule.work_date);
    
    // Tính toán thời gian còn lại đến lịch làm việc
    const timeDifference = workDate - now;

    // Kiểm tra nếu thời gian còn lại lớn hơn 24 giờ (24 * 60 * 60 * 1000 milliseconds)
    if (timeDifference > 24 * 60 * 60 * 1000) {
      const updatedSchedule = await Schedule.findByIdAndUpdate(id, { ...req.body, doctor_id: doctor._id }, { new: true });
      
      if (!updatedSchedule) {
        return res.status(400).json({ success: false, message: "Update schedule fail" });
      }
      
      // Cập nhật bảng appointment với work_date và work_shift mới
      await Appointment.updateMany(
        { doctor_id: doctor._id, work_date: findSchedule.work_date, work_shift: findSchedule.work_shift },
        { work_date: updatedSchedule.work_date, work_shift: updatedSchedule.work_shift }
      );

      return res.status(200).json({ success: true, schedule: updatedSchedule });
    }

    return res.status(400).json({ success: false, message: "Cannot update schedule less than 24 hours before the appointment!" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};


module.exports = {
  createSchedule,
  findAllSchedule,
  findSchedule,
  updateSchedule,
  deleteSchedule,
  getScheduleByDoctor,
  doctorCreateSchedule,
  doctorUpdateSchedule,
  getSchedule,
  getScheduleByDoctorDashboard
};
