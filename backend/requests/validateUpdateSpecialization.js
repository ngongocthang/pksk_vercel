const Joi = require("joi");

// Sửa schema để chỉ kiểm tra trường "image" nếu có file
const specializationSchema = Joi.object({
  name: Joi.string().min(1).required().messages({
    "string.base": "Tên chuyên khoa phải là một chuỗi.",
    "string.empty": "Tên chuyên khoa không được để trống.",
    "string.min": "Tên chuyên khoa phải có ít nhất {#limit} ký tự.",
    "any.required": "Tên chuyên khoa là bắt buộc.",
  }),
  description: Joi.string().required().messages({
    "string.base": "Mô tả phải là một chuỗi.",
    "string.empty": "Mô tả không được để trống.",
    "any.required": "Mô tả là bắt buộc.",
  }),
  image: Joi.any().optional(), // Không kiểm tra file tại đây
});

const validateUpdateSpecialization = (data) => {
  return specializationSchema.validate(data, { abortEarly: false });
};

module.exports = validateUpdateSpecialization;