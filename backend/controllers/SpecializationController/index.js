const Specialization = require("../../models/Specialization");
const Doctor = require("../../models/Doctor");
const validateSpecialization = require("../../requests/validateSpecialization");
const validateUpdateSpecialization = require("../../requests/validateUpdateSpecialization");
const cloudinary = require("cloudinary").v2;

const createSpecialization = async (req, res) => {
  try {
    // Validate dữ liệu từ client
    const { error } = validateSpecialization(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    let imageUrl = null;
    if (req.file) {
      // Chuyển đổi buffer của file thành chuỗi Base64 để upload
      const base64Image = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;

      const result = await cloudinary.uploader.upload(base64Image, {
        folder: "specialization", // Thay đổi tên thư mục nếu cần
      });

      imageUrl = result.secure_url; // Lưu URL hình ảnh
    }

    // Tạo chuyên khoa mới
    const specialization = await Specialization.create({
      name: req.body.name,
      image: imageUrl,
      description: req.body.description,
    });

    if (specialization) {
      return res.status(200).json({success: true, data: specialization});
    }
    return res.status(400).json({success: false, message: "Specialization not created" });
  } catch (error) {
    return res.status(500).json({success: false, message: error.message });
  }
};

const findAllSpecialization = async (req, res) => {
  try {
    const specializations = await Specialization.find({});
    if (specializations) {
      return res.status(200).json({success: true, specializations});
    }
    return res.status(400).json({success: false, message: "Specialization not found" });
  } catch (error) {
    return res.status(500).json({success: false, message: error.message });
  }
};

const findSpecialization = async (req, res) => {
  try {
    const { id } = req.params;
    const specialization = await Specialization.findById(id);
    if (specialization) {
      return res.status(200).json({success: true, specialization});
    }
    return res.status(400).json({success: false, message: "Specialization not found" });
  } catch (error) {
    return res.status(500).json({success: false, message: error.message });
  }
};

const updateSpecialization = async (req, res) => {
  try {
    // Validate các trường không phải file
    const { error } = validateUpdateSpecialization(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { id } = req.params;
    const specialization = await Specialization.findById(id);

    if (!specialization) {
      return res.status(404).json({ message: "Specialization not found" });
    }

    let imageUrl = specialization.image;

    // Kiểm tra file ảnh nếu có
    if (req.file) {
      const validImageTypes = ["image/jpeg", "image/png", "image/gif"];
      if (!validImageTypes.includes(req.file.mimetype)) {
        return res.status(400).json({
          success: false,
          message: "Tệp tải lên phải là một ảnh (JPEG, PNG, GIF).",
        });
      }

      const base64Image = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;

      // Xóa ảnh cũ
      if (imageUrl) {
        const publicId = imageUrl.split("/").slice(-1)[0].split(".")[0];
        await cloudinary.uploader.destroy(`specialization/${publicId}`);
      }

      // Upload ảnh mới
      const result = await cloudinary.uploader.upload(base64Image, {
        folder: "specialization",
      });

      imageUrl = result.secure_url;
    }

    // Cập nhật dữ liệu
    const updatedSpecialization = await Specialization.findByIdAndUpdate(
      id,
      {
        name: req.body.name,
        description: req.body.description,
        image: imageUrl,
      },
      { new: true }
    );

    return res.status(200).json({ success: true, data: updatedSpecialization });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
const deleteSpecialization = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);

    // Kiểm tra xem chuyên khoa có tồn tại không
    const specialization = await Specialization.findById(id);
    if (!specialization) {
      return res.status(404).json({ message: "Chuyên khoa không tồn tại." });
    }

    // Kiểm tra xem có bác sĩ nào sử dụng chuyên khoa này không
    const findDoc = await Doctor.find({ specialization_id: id });
    if (findDoc.length > 0) {
      return res.status(400).json({ message: "Không thể xóa khi chuyên khoa còn tồn tại bác sĩ!" });
    }

    // Xóa hình ảnh trên Cloudinary nếu có
    const imageUrl = specialization.image;
    if (imageUrl) {
      const publicId = imageUrl.split("/").slice(-1)[0].split(".")[0];
      await cloudinary.uploader.destroy(`specialization/${publicId}`);
    }

    // Xóa chuyên khoa
    await Specialization.findByIdAndDelete(id);

    return res.status(200).json({ success: true, message: "Xóa chuyên khoa thành công!" });
  } catch (error) {
    console.error("Error deleting specialization:", error); // Ghi lại lỗi vào console
    return res.status(500).json({ success: false, message: error.message });
  }
};


module.exports = {
  createSpecialization,
  findAllSpecialization,
  findSpecialization,
  updateSpecialization,
  deleteSpecialization,
};
