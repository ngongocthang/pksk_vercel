const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../../models/User");
const RoleUser = require("../../models/User_role"); // Import model RoleUser
const Role = require("../../models/Role"); // Import model Role
const validateUser = require("../../requests/validateUser");
const Schedule = require("../../models/Schedule");
JWT_SECRET = process.env.JWT_SECRET;


const login = async (req, res) => {
  try {
    // Validate dữ liệu từ client
    const { error } = validateUser(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    // So sánh mật khẩu
    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password!" });
    }

    // Lấy danh sách role của người dùng
    const roleUsers = await RoleUser.find({ user_id: user._id }).populate(
      "role_id"
    );
    const userRole = roleUsers.length > 0 ? roleUsers[0].role_id.name : null;

    // Tạo token JWT
    const token = jwt.sign({ id: user._id, role: userRole }, JWT_SECRET, {
      expiresIn: "1h",
    });

    return res.status(200).json({
      message: "Login successful!",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: userRole,
        token: token,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

const logout = async (req, res) => {
  try {
    // Xóa thông tin người dùng trong session
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Could not log out." });
      }
      return res.status(200).json({ message: "Logout successful!" });
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const filter = async (req, res) => {
  try {
    const { doctorId, filterType, specialization } = req.query; // Thêm specialization từ query parameters
    const now = new Date();
    let startDate, endDate;

    // Xác định khoảng thời gian dựa trên filterType
    switch (filterType) {
      case "today":
        startDate = new Date(now.setHours(0, 0, 0, 0)); // Bắt đầu từ đầu ngày
        endDate = new Date(now.setHours(23, 59, 59, 999)); // Kết thúc vào cuối ngày
        break;
      case "week":
        const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay())); // Bắt đầu tuần
        startDate = new Date(startOfWeek.setHours(0, 0, 0, 0));
        endDate = new Date(startOfWeek.setDate(startOfWeek.getDate() + 6)); // Kết thúc tuần
        endDate = new Date(endDate.setHours(23, 59, 59, 999));
        break;
      case "month":
        startDate = new Date(now.getFullYear(), now.getMonth(), 1); // Bắt đầu tháng
        endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0); // Kết thúc tháng
        endDate = new Date(endDate.setHours(23, 59, 59, 999));
        break;
      default:
        return res.status(400).json({ message: "Invalid filter type" });
    }

    // Tạo điều kiện truy vấn
    const query = {
      work_date: { $gte: startDate, $lte: endDate }, // Lọc theo thời gian
    };

    // Nếu có chuyên khoa, thêm điều kiện vào truy vấn
    if (specialization) {
      query.specialization = specialization; // Giả sử bạn có trường specialization trong Schedule
    }

    // Truy vấn cơ sở dữ liệu để lấy lịch làm việc của bác sĩ trong khoảng thời gian đã xác định
    const schedules = await Schedule.find(query).sort({ work_date: 1 }); // Sắp xếp theo thời gian hẹn

    return res.status(200).json(schedules);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = { login, logout, filter };
