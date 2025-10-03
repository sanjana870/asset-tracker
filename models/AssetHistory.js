const mongoose = require('mongoose');

const assetHistorySchema = new mongoose.Schema({
  serial: String,
  manufacturer: String,
  model: String,
  costCenterId: String,
  deleteReason: String,
  deleteDate: { type: Date, default: Date.now },
  deletedBy: String
});

module.exports = mongoose.model('AssetHistory', assetHistorySchema);