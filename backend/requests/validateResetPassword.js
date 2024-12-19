const Joi = require('joi');

const resetPasswordSchema = Joi.object({
  password: Joi.string().min(6).required().messages({
    "string.base": "Mật khẩu phải là một chuỗi.",
    "string.empty": "Mật khẩu không được để trống.",
    "string.min": "Mật khẩu phải có ít nhất {#limit} ký tự.",
    "any.required": "Mật khẩu là bắt buộc.",
  }),
});

const validateResetPassword = (data) => {
  return resetPasswordSchema.validate(data);
};

module.exports = validateResetPassword;
