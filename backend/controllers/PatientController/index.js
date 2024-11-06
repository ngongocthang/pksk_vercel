const bcrypt = require("bcrypt");
const Role = require("../../models/Role");
const User = require("../../models/User");
const UserRole = require("../../models/User_role");
const Doctor = require("../../models/Patient");
const validatePatient = require("../../requests/validatePatient");
const Patient = require("../../models/Patient");

//{ key: value } là một đtuong trong js, thường dùng để crud
/*
{id} dgl "destructuring assignment" (gán giá trị phân rã) lấy các giá trị
từ đối tượng hoặc mảng và gán chúng vào các biến riêng biệt (cach viet khac id = user.id)
*/
/**
  populate dung de lấy dữ liệu từ các bảng (collections) khác trong MongoDB dựa trên các trường 
 tham chiếu (reference fields)
 */
const createPatient = async (req, res) => {
  try {
    // Validate dữ liệu từ client
    const { error } = validatePatient(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    // Băm mật khẩu
    const hashedPassword = await bcrypt.hash(req.body.password, 10); // 10 là số vòng băm

    const patient = await User.create({
      ...req.body,
      password: hashedPassword,
    });

    // Kiểm tra xem người dùng có được tạo thành công không
    if (patient) {
      // Tìm ID của vai trò "patient"
      const role = await Role.findOne({ name: "patient" });

      if (!role) {
        return res.status(400).json({ message: "Role 'patient' not found" });
      }

      // Tạo bản ghi trong bảng user_role
      await UserRole.create({ user_id: patient._id, role_id: role._id });

      // Tạo bản ghi trong bảng patient
      await Patient.create({
        user_id: patient._id,
      });

      // Trả về thông tin người dùng
      res.status(200).json(patient);
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const findAllPatient = async (req, res) => {
  try {
    const patient = await Patient.find({}).populate("user_id");

    if (patient) {
      return res.status(200).json(patient);
    } else {
      return res.status(400).json({ message: "Patient not found." });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const findPatient = async (req, res) => {
  try {
    const { id } = req.params;
    const patient = await Patient.findById(id).populate("user_id");
    if (patient) {
      return res.status(200).json(patient);
    } else {
      return res.status(400).json({ message: "Patient not found" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const updatePatient = async (req, res) => {
  try {
    const { id } = req.params;
    const patient = await Patient.findById(id);
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    // Validate dữ liệu từ client
    const { error } = validatePatient(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    // Cập nhật thông tin bệnh nhân
    const patientUpdate = await Patient.findByIdAndUpdate(id, req.body, { new: true });

    // Chỉ băm mật khẩu nếu nó được cung cấp
    if (req.body.password) {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      await User.findByIdAndUpdate(
        { _id: patient.user_id },
        {
          name: req.body.name,
          email: req.body.email,
          password: hashedPassword,
          phone: req.body.phone,
        }
      );
    } else {
      // Nếu không có mật khẩu mới, chỉ cập nhật các trường khác
      await User.findByIdAndUpdate(
        { _id: patient.user_id },
        {
          name: req.body.name,
          email: req.body.email,
          phone: req.body.phone,
        }
      );
    }

    return res.status(200).json(patientUpdate);
  } catch (error) {
    console.error(error); // Ghi lại lỗi
    return res.status(500).json({ message: error.message });
  }
};


const deletePatient = async (req, res) => {
  try {
    const { id } = req.params;
    const patient = await Patient.findById(id);

    if (!patient) {
      return res.status(404).json({ message: "Patient not found!" });
    }
    // Xóa benh nhan
    await Patient.findByIdAndDelete(id);

    // Xóa info liên quan
    await User.deleteOne({ _id: patient.user_id });
    await UserRole.deleteOne({ user_id: patient.user_id });
    return res.status(200).json({ message: "Delete patient success!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const profilePatient = async (req, res) => {
  try {
    const user_id = req.user.id; // Lấy ID người dùng từ token
    const userInfo  = await User.findById(user_id);


    // Kiểm tra xem userInfo có tồn tại không
    if (!userInfo) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      message: "User information retrieved successfully",
      user: userInfo, // Trả về thông tin người dùng
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};



const updateProfilePatient = async (req, res) => {
  try {
    const user_id = req.user.id;

    // Lấy các trường thông tin từ yêu cầu
    const { oldPassword, newPassword, name, email, phone } = req.body;

    // Tìm người dùng bằng ID
    const user = await User.findById(user_id);

    if (!user) {
      return res.status(404).json({ message: "Người dùng không tồn tại!" });
    }

    // Kiểm tra xem người dùng có muốn thay đổi mật khẩu không
    if (newPassword) {
      // Nếu có mật khẩu mới, yêu cầu người dùng nhập mật khẩu cũ để xác minh
      const isOldPasswordCorrect = await bcrypt.compare(oldPassword, user.password);
      if (!isOldPasswordCorrect) {
        return res.status(400).json({ message: "Mật khẩu cũ không chính xác!" });
      }
      // Mã hóa mật khẩu mới và cập nhật
      user.password = await bcrypt.hash(newPassword, 10);
    }

    // Cập nhật các thông tin khác của người dùng (không liên quan đến mật khẩu)
    user.name = name;
    user.email = email;
    user.phone = phone;

    // Lưu các thay đổi
    await user.save();

    // Trả về phản hồi thành công
    return res.status(200).json({ message: "Thông tin đã được cập nhật thành công!", user });
  } catch (error) {
    return res.status(500).json({ message: "Đã xảy ra lỗi khi cập nhật: " + error.message });
  }
};

module.exports = {
  createPatient,
  findAllPatient,
  findPatient,
  updatePatient,
  deletePatient,
  profilePatient,
  updateProfilePatient,
};
