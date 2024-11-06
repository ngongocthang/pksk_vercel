const Joi = require('joi');

const scheduleSchema = Joi.object({
  doctor_id: Joi.required(),
  work_shift: Joi.required(),
  work_date: Joi.required(),
});

const validateSchedule = (data) => {
  return scheduleSchema.validate(data);
};

module.exports = validateSchedule;
