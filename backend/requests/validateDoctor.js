const Joi = require("joi");

const MAX_IMAGE_SIZE = 10 * 1024 * 1024;

const doctorSchema = Joi.object({
  name: Joi.string().min(1).max(50).required().messages({
    "string.base": "Tên bác sĩ phải là một chuỗi.",
    "string.empty": "Tên bác sĩ không được để trống.",
    "string.min": "Tên bác sĩ phải có ít nhất {#limit} ký tự.",
    "string.max": "Tên bác sĩ không được vượt quá {#limit} ký tự.",
    "any.required": "Tên bác sĩ là bắt buộc.",
  }),
  email: Joi.string().email().required().messages({
    "string.base": "Email phải là một chuỗi.",
    "string.empty": "Email không được để trống.",
    "string.email": "Email không hợp lệ.",
    "any.required": "Email là bắt buộc.",
  }),
  phone: Joi.string()
    .pattern(/^0\d{9}$/)
    .required()
    .messages({
      "string.base": "Số điện thoại phải là một chuỗi.",
      "string.empty": "Số điện thoại không được để trống.",
      "string.pattern.base":
        "Số điện thoại phải bắt đầu bằng 0 và có đúng 10 chữ số.",
      "any.required": "Số điện thoại là bắt buộc.",
    }),
  description: Joi.string().required().messages({
    "string.base": "Mô tả phải là một chuỗi.",
    "string.empty": "Mô tả không được để trống.",
    "any.required": "Mô tả là bắt buộc.",
  }),
  image: Joi.any().custom((value, helpers) => {
    const validImageTypes = ["image/jpeg", "image/png", "image/gif"];

    if (
      !value ||
      !value.mimetype ||
      !validImageTypes.includes(value.mimetype)
    ) {
      return helpers.message("Tệp tải lên phải là một ảnh (JPEG, PNG, GIF).");
    }

    if (value.size > MAX_IMAGE_SIZE) {
      return helpers.message("Kích thước tệp phải nhỏ hơn 10 MB.");
    }

    return value;
  }),
  password: Joi.string().min(6).required().messages({
    "string.base": "Mật khẩu phải là một chuỗi.",
    "string.empty": "Mật khẩu không được để trống.",
    "string.min": "Mật khẩu phải có ít nhất {#limit} ký tự.",
    "any.required": "Mật khẩu là bắt buộc.",
  }),
  price: Joi.number().min(0).required().messages({
    "number.base": "Giá khám phải là một số.",
    "number.min": "Giá khám không được nhỏ hơn 0.",
    "any.required": "Giá khám là bắt buộc.",
  }),
  specialization_id: Joi.string().required().messages({
    "string.base": "ID chuyên khoa phải là một chuỗi.",
    "string.empty": "ID chuyên khoa không được để trống.",
    "any.required": "ID chuyên khoa là bắt buộc.",
  }),
});

const validateDoctor = (data) => {
  return doctorSchema.validate(data);
};

module.exports = validateDoctor;
