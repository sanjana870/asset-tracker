import mongoose from 'mongoose';

const transferRequestSchema = new mongoose.Schema({
  employeeId: String,
  currentManagerId: String,
  newManagerId: String,
  newManagerName: String,
  newManagerEmail: String,
  newCostCenterId: String,
  transferReason: String,
  requestDate: { type: Date, default: Date.now },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  approvedBy: String,
  rejectedBy: String,
  rejectionReason: String
});

export default mongoose.model('TransferRequest', transferRequestSchema);