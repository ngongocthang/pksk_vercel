const Joi = require('joi');

const specializationSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().required(),
});

const validateSpecialization = (data) => {
  return specializationSchema.validate(data);
};

module.exports = validateSpecialization;
