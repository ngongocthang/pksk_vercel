const Joi = require('joi');

const patientSchema = Joi.object({
  name: Joi.string().min(3).max(50).required(),
  email: Joi.string().email().required(),
  phone: Joi.string().length(10).required(),
  password: Joi.string().min(6).required(),
});

const validatePatient = (data) => {
  return patientSchema.validate(data);
};

module.exports = validatePatient;
