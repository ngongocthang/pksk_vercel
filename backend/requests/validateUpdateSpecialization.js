const Joi = require("joi");

const MAX_IMAGE_SIZE = 10 * 1024 * 1024;

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
  image: Joi.any().optional(),
  image: Joi.any().custom((value, helpers) => {
    if (value && value.size > MAX_IMAGE_SIZE) {
      return helpers.message('Kích thước tệp phải nhỏ hơn 10 MB.');
    }

    return value;
  }).optional(), 
});

const validateUpdateSpecialization = (data) => {
  return specializationSchema.validate(data, { abortEarly: false });
};

module.exports = validateUpdateSpecialization;