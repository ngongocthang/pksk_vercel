const Joi = require('joi');

const appointmentSchema = Joi.object({
  patient_id: Joi.required(),
  doctor_id: Joi.required(),
  work_shift: Joi.required(),
  work_date: Joi.required(),
  status: Joi.string(),
});

const validateAppointment = (data) => {
  return appointmentSchema.validate(data);
};

module.exports = validateAppointment;
