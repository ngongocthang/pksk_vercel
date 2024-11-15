const Joi = require('joi');

const patientSchema = Joi.object({
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
  phone: Joi.string().pattern(/^0\d{9}$/).required().messages({
    "string.base": "Số điện thoại phải là một chuỗi.",
    "string.empty": "Số điện thoại không được để trống.",
    "string.pattern.base": "Số điện thoại phải bắt đầu bằng 0 và có đúng 10 chữ số.",
    "any.required": "Số điện thoại là bắt buộc.",
  }),
  password: Joi.string().min(6).required().messages({
    "string.base": "Mật khẩu phải là một chuỗi.",
    "string.empty": "Mật khẩu không được để trống.",
    "string.min": "Mật khẩu phải có ít nhất {#limit} ký tự.",
    "any.required": "Mật khẩu là bắt buộc.",
  }),
});

const validatePatient = (data) => {
  return patientSchema.validate(data);
};

module.exports = validatePatient;
