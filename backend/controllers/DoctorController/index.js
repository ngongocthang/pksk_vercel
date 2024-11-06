const bcrypt = require("bcrypt");
const Role = require("../../models/Role");
const User = require("../../models/User");
const UserRole = require("../../models/User_role");
const Doctor = require("../../models/Doctor");
const cloudinary = require("cloudinary").v2;
const validateDoctor = require("../../requests/validateDoctor");
const Appointment = require("../../models/Appointment");

//{ key: value } là một đtuong trong js, thường dùng để crud
/*
{id} dgl "destructuring assignment" (gán giá trị phân rã) lấy các giá trị
từ đối tượng hoặc mảng và gán chúng vào các biến riêng biệt (cach viet khac id = user.id)
*/
/**
  populate dung de lấy dữ liệu từ các bảng (collections) khác trong MongoDB dựa trên các trường 
 tham chiếu (reference fields)
 */
//...req.body: Đây là cú pháp spread operator



const createDoctor = async (req, res) => {
  try {
    const { error } = validateDoctor(req.body);
    if (error)
      return res.status(400).json({ message: error.details[0].message });

    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    let imageUrl = null;
    if (req.file) {
      // Chuyển đổi buffer của file thành chuỗi Base64 để upload
      const base64Image = `data:${
        req.file.mimetype
      };base64,${req.file.buffer.toString("base64")}`;

      const result = await cloudinary.uploader.upload(base64Image, {
        folder: "doctor",
      });

      imageUrl = result.secure_url;
    }

    const doctor = await User.create({
      ...req.body,
      password: hashedPassword,
      image: imageUrl, // Gán URL của ảnh đã upload
    });

    if (doctor) {
      const role = await Role.findOne({ name: "doctor" });
      if (!role)
        return res.status(400).json({ message: "Role 'doctor' not found" });

      await UserRole.create({ user_id: doctor._id, role_id: role._id });
      await Doctor.create({
        user_id: doctor._id,
        specialization_id: req.body.specialization_id,
        description: req.body.description,
      });

      res.status(200).json(doctor);
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const findAllDoctor = async (req, res) => {
  try {
    const doctors = await Doctor.find({})
      .populate("user_id")
      .populate("specialization_id");

    if (doctors) {
      return res.status(200).json(doctors);
    } else {
      return res.status(404).json({ message: "Doctors not found." });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const findDoctor = async (req, res) => {
  try {
    const { id } = req.params;
    const doctor = await Doctor.findById(id)
      .populate("user_id")
      .populate("specialization_id");
    if (doctor) {
      return res.status(200).json(doctor);
    } else {
      return res.status(404).json({ message: "Doctor not found" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


const updateDoctor = async (req, res) => {
  try {
    const { id } = req.params;
    const doctor = await Doctor.findById(id).populate("user_id"); // Load thông tin User

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    // Validate dữ liệu từ client
    const { error } = validateDoctor(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    let hashedPassword = doctor.user_id.password; // Mặc định giữ mật khẩu cũ
    if (req.body.password) {
      hashedPassword = await bcrypt.hash(req.body.password, 10);
    }

    let imageUrl = doctor.user_id.image; // Giữ URL ảnh cũ nếu không có ảnh mới

    if (req.file) {
      console.log("Cập nhật ảnh mới");

      // Tạo base64 của ảnh mới để upload
      const base64Image = `data:${
        req.file.mimetype
      };base64,${req.file.buffer.toString("base64")}`;

      // Lấy `public_id` từ URL ảnh cũ nếu có ảnh cũ
      if (imageUrl) {
        const publicId = imageUrl.split("/").slice(-1)[0].split(".")[0]; // Trích xuất `public_id`
        await cloudinary.uploader.destroy(`doctor/${publicId}`); // Xóa ảnh cũ
      }

      // Upload ảnh mới
      const result = await cloudinary.uploader.upload(base64Image, {
        folder: "doctor",
      });

      imageUrl = result.secure_url; // Cập nhật URL ảnh mới
    }

    // Cập nhật thông tin vào bảng User và Doctor
    await User.findByIdAndUpdate(doctor.user_id._id, {
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
      image: imageUrl,
      phone: req.body.phone,
    });

    const doctorUpdate = await Doctor.findByIdAndUpdate(
      id,
      {
        specialization_id: req.body.specialization_id,
        description: req.body.description,
      },
      { new: true }
    );

    return res.status(200).json(doctorUpdate);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const deleteDoctor = async (req, res) => {
  try {
    const { id } = req.params;
    const doctor = await Doctor.findById(id);

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found!" });
    }
    // Xóa bác sĩ
    await Doctor.findByIdAndDelete(id);

    // Xóa info liên quan
    await User.deleteOne({ _id: doctor.user_id });
    await UserRole.deleteOne({ user_id: doctor.user_id });
    return res.status(200).json({ message: "Delete doctor success!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const confirmAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (status === "confirmed" || status === "canceled" || status === "finished") {
      const updatedAppointment = await Appointment.findByIdAndUpdate(
        id,
        { status }
      );

      if (!updatedAppointment) {
        return res.status(404).json({ message: "Appointment not found" });
      }

      const afterUpdateAppointment = await Appointment.findById(id);
      // Gửi phản hồi thành công
      return res.status(200).json({
        message: `Appointment ${status}`,
        appointment: afterUpdateAppointment,
      });
    } else {
      return res.status(400).json({
        message: "Invalid status. Status must be 'confirmed' or 'canceled'",
      });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


module.exports = {
  createDoctor,
  findAllDoctor,
  findDoctor,
  updateDoctor,
  deleteDoctor,
  confirmAppointment
};
