import mongoose from 'mongoose';

const requestSchema = new mongoose.Schema({
  assetSerial: { type: String, required: true },
  manufacturer: String,
  model: String,
  employeeId: { type: String, required: true },
  managerId: { type: String, required: true },
  type: { type: String, enum: ['return', 'replacement'], required: true },
  reason: { type: String, required: true },
  requestDate: { type: Date, default: Date.now },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  approvalDate: Date,
  rejectionDate: Date,
  approvedBy: String,
  rejectedBy: String,
  rejectionReason: String
});

export default mongoose.model('Request', requestSchema);