import mongoose from 'mongoose';

const assetSchema = new mongoose.Schema({
  serial: { type: String, required: true, unique: true },
  manufacturer: String,
  model: String,
  date: { type: Date, required: true },
  costCenterId: { type: String, required: true },
  status: { type: String, enum: ['available', 'assigned', 'returned'], default: 'available' },
  assignedTo: {
    firstName: String,
    lastName: String,
    employeeId: String,
    email: String,
    lineManagerId: String,
    lineManagerEmail: String,
    costCenterId: String
  }
}, { timestamps: true });

export default mongoose.model('Asset', assetSchema);

