const Specialization = require("../../models/Specialization");
const Doctor = require("../../models/Doctor");
const validateSpecialization = require("../../requests/validateSpecialization");
const cloudinary = require("cloudinary").v2;

// const createSpecialization = async (req, res) => {
//   try {
//     // Validate dữ liệu từ client
//     const { error } = validateSpecialization(req.body);
//     if (error) {
//       return res.status(400).json({ message: error.details[0].message });
//     }

//     const specialization = await Specialization.create(req.body);
//     if (specialization) {
//       return res.status(200).json(specialization);
//     }
//     return res.status(400).json({ message: "Specialization not found" });
//   } catch (error) {
//     return res.status(500).json({ message: error.message });
//   }
// };
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
      return res.status(200).json(specialization);
    }
    return res.status(400).json({ message: "Specialization not found" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// const updateSpecialization = async (req, res) => {
//   try {
//     // Validate dữ liệu từ client
//     const { error } = validateSpecialization(req.body);
//     if (error) {
//       return res.status(400).json({ message: error.details[0].message });
//     }

//     const { id } = req.params;
//     const specialization = await Specialization.findByIdAndUpdate(id, req.body);
//     if (!specialization) {
//       return res.status(400).json({ message: "Specialization not found" });
//     }
//     const specializationUpdate = await Specialization.findById(id);
//     return res.status(200).json(specializationUpdate);
//   } catch (error) {
//     return res.status(500).json({ message: error.message });
//   }
// };
const updateSpecialization = async (req, res) => {
  try {
    // Validate dữ liệu từ client
    const { error } = validateSpecialization(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { id } = req.params;
    const specialization = await Specialization.findById(id);

    if (!specialization) {
      return res.status(404).json({ message: "Specialization not found" });
    }

    let imageUrl = specialization.image; // Lưu URL hình ảnh hiện tại

    // Xử lý upload hình ảnh mới nếu có
    if (req.file) {
      const base64Image = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;

      // Xóa hình ảnh cũ trên Cloudinary nếu có
      if (imageUrl) {
        const publicId = imageUrl.split("/").slice(-1)[0].split(".")[0];
        await cloudinary.uploader.destroy(`specialization/${publicId}`); // Thay đổi thư mục nếu cần
      }

      // Upload hình ảnh mới lên Cloudinary
      const result = await cloudinary.uploader.upload(base64Image, {
        folder: "specialization", // Thay đổi tên thư mục nếu cần
      });

      imageUrl = result.secure_url; // Cập nhật URL hình ảnh mới
    }

    // Cập nhật chuyên khoa với các trường mới
    const updatedSpecialization = await Specialization.findByIdAndUpdate(
      id,
      {
        name: req.body.name,
        image: imageUrl,
        description: req.body.description,
      },
      { new: true } // Trả về tài nguyên đã cập nhật
    );

    return res.status(200).json({success: true, data: updatedSpecialization});
  } catch (error) {
    return res.status(500).json({success: false, message: error.message });
  }
};


// const deleteSpecialization = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const specialization = await Specialization.findById(id);
//     if (!specialization) {
//       return res.status(400).json({ message: "Specialization not found" });
//     }
//     await Specialization.findByIdAndDelete(id);
//     await Doctor.updateMany(
//       { specialization_id: id },
//       { $set: { specialization_id: null } }
//     );
//     return res.status(200).json({ message: "Delete specialization success!" });
//   } catch (error) {
//     return res.status(500).json({ message: error.message });
//   }
// };
const deleteSpecialization = async (req, res) => {
  try {
    const { id } = req.params;

    const findDoc = await Doctor.find({specialization_id: id});

    if (findDoc.length > 0) {
      return res.status(404).json({ message: "Không thể xoá khi chuyên khoa còn tồn tại bác sĩ!" });
    }
    
    if (!specialization) {
      return res.status(404).json({ message: "Specialization not found" });
    }

    const specialization = await Specialization.findById(id);
    
    if (!specialization) {
      return res.status(404).json({ message: "Specialization not found" });
    }

    // Xóa hình ảnh trên Cloudinary nếu có
    const imageUrl = specialization.image;
    if (imageUrl) {
      const publicId = imageUrl.split("/").slice(-1)[0].split(".")[0];
      await cloudinary.uploader.destroy(`specialization/${publicId}`);
    }

    // Xóa chuyên khoa
    await Specialization.findByIdAndDelete(id);

    // // Cập nhật các bác sĩ có chuyên khoa này
    // await Doctor.updateMany(
    //   { specialization_id: id },
    //   { $set: { specialization_id: null } }
    // );

    return res.status(200).json({success: true, message: "Delete specialization success!" });
  } catch (error) {
    return res.status(500).json({success: false, message: error.message });
  }
};

module.exports = { deleteSpecialization };


module.exports = {
  createSpecialization,
  findAllSpecialization,
  findSpecialization,
  updateSpecialization,
  deleteSpecialization,
};
