// // request/validateDoctor.js
// const Joi = require("joi");

// const doctorSchema = Joi.object({
//   name: Joi.string().min(1).max(50).required(),
//   email: Joi.string().email().required(),
//   phone: Joi.string().length(10).required(),
//   description: Joi.string().required(),
//   image: Joi.any().required(),
//   password: Joi.string().min(6).required(),
//   specialization_id: Joi.string().required(),
// });

// const validateDoctor = (data) => {
//   return doctorSchema.validate(data);
// };

// module.exports = validateDoctor;
const Joi = require("joi");

const doctorSchema = Joi.object({
  name: Joi.string()
    .min(1)
    .max(50)
    .required()
    .messages({
      'string.base': 'Tên bác sĩ phải là một chuỗi.',
      'string.empty': 'Tên bác sĩ không được để trống.',
      'string.min': 'Tên bác sĩ phải có ít nhất {#limit} ký tự.',
      'string.max': 'Tên bác sĩ không được vượt quá {#limit} ký tự.',
      'any.required': 'Tên bác sĩ là bắt buộc.'
    }),
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.base': 'Email phải là một chuỗi.',
      'string.empty': 'Email không được để trống.',
      'string.email': 'Email không hợp lệ.',
      'any.required': 'Email là bắt buộc.'
    }),
  phone: Joi.string()
    .length(10)
    .required()
    .messages({
      'string.base': 'Số điện thoại phải là một chuỗi.',
      'string.empty': 'Số điện thoại không được để trống.',
      'string.length': 'Số điện thoại phải có đúng {#limit} ký tự.',
      'any.required': 'Số điện thoại là bắt buộc.'
    }),
  description: Joi.string()
    .required()
    .max(200)
    .messages({
      'string.base': 'Mô tả phải là một chuỗi.',
      'string.empty': 'Mô tả không được để trống.',
      'string.max': 'Mô tả tối đa {#limit} ký tự.',
      'any.required': 'Mô tả là bắt buộc.'
    }),
  image: Joi.any()
    .required()
    .messages({
      'any.required': 'Ảnh là bắt buộc.'
    }),
  password: Joi.string()
    .min(6)
    .required()
    .messages({
      'string.base': 'Mật khẩu phải là một chuỗi.',
      'string.empty': 'Mật khẩu không được để trống.',
      'string.min': 'Mật khẩu phải có ít nhất {#limit} ký tự.',
      'any.required': 'Mật khẩu là bắt buộc.'
    }),
  specialization_id: Joi.string()
    .required()
    .messages({
      'string.base': 'Chuyên khoa phải là một chuỗi.',
      'string.empty': 'Chuyên khoa không được để trống.',
      'any.required': 'Chuyên khoa là bắt buộc.'
    }),
});

const validateDoctor = (data) => {
  return doctorSchema.validate(data);
};

module.exports = validateDoctor;
