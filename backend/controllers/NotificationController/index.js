const Specialization = require("../../models/Specialization");
const Notification = require("../../models/Notification");
const Doctor = require("../../models/Doctor");
const validateNotification = require("../../requests/validateNotification");
const Patient = require("../../models/Patient");

const createNotification = async (req, res) => {
  try {
    // Validate dữ liệu từ client
    const { error } = validateNotification(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const notification = await Notification.create(req.body);
    if (notification) {
      return res.status(200).json(notification);
    }
    return res.status(400).json({ message: "Notification not found" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const findAllNotification = async (req, res) => {
  try {
    const notifications = await Notification.find({});
    if (notifications) {
      return res.status(200).json(notifications);
    }
    return res.status(400).json({ message: "Notification not found" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const findNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await Notification.findById(id);
    if (notification) {
      return res.status(200).json(notification);
    }
    return res.status(400).json({ message: "Notification not found" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const updateNotification = async (req, res) => {
  try {
    // Validate dữ liệu từ client
    const { error } = validateNotification(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { id } = req.params;
    const notification = await Notification.findByIdAndUpdate(id, req.body);
    if (!notification) {
      return res.status(400).json({ message: "Notification not found" });
    }
    const notificationUpdate = await Notification.findById(id);
    return res.status(200).json(notificationUpdate);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await Notification.findById(id);
    if (!notification) {
      return res.status(400).json({ message: "Notification not found" });
    }
    await Notification.findByIdAndDelete(id);
    return res.status(200).json({ message: "Delete notification success!" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getCurrentUserNotifications = async (req, res) => {
  try {
    const user_id = req.user?.id;
    const user_role = req.user?.role;
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to start of the day

    let notifications;

    if (user_role === "patient") {
      const patient = await Patient.findOne({ user_id: user_id });
      if (!patient) {
        return res.status(400).json({ message: "Patient not found" });
      }

      notifications = await Notification.find({
        patient_id: patient._id,
        createdAt: { $gte: today },
      })
      .sort({ createdAt: -1 }); // Sort notifications from newest to oldest

      if (notifications.length > 0) {
        return res.status(200).json(notifications);
      }
    } else if (user_role === "doctor") {
      const doctor = await Doctor.findOne({ user_id: user_id });
      if (!doctor) {
        return res.status(400).json({ message: "Doctor not found" });
      }

      notifications = await Notification.find({ doctor_id: doctor._id })
        .sort({ createdAt: -1 }); // Sort notifications from newest to oldest

      if (notifications.length > 0) {
        return res.status(200).json(notifications);
      }
    }
    return res.status(404).json({ message: "Notifications not found" });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return res.status(500).json({ message: error.message });
  }
};


module.exports = {
  createNotification,
  findAllNotification,
  findNotification,
  updateNotification,
  deleteNotification,
  getCurrentUserNotifications,
};
