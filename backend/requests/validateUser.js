const Joi = require('joi');

const doctorUser = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const validateUser = (data) => {
  return doctorUser.validate(data);
};

module.exports = validateUser;
