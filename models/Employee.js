const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  employeeId: { type: String, required: true, unique: true },
  firstName: String,
  lastName: String,
  email: String,
  lineManagerId: String,
  lineManagerEmail: String,
  costCenterId: String
});

module.exports = mongoose.model('Employee', employeeSchema);