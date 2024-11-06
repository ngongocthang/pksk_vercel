const Role = require("../../models/Role");

const createRole = async (req, res) => {
  try {
    const role = await Role.create(req.body);
    if (role) {
      res.status(200).json(role);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const findAllRole = async (req, res) => {
  try {
    const roles = await Role.find({});
    if (roles) {
      res.status(200).json(roles);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createRole, findAllRole };
