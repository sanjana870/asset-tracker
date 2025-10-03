const Employee = require('../models/Employee');
const TransferRequest = require('../models/TransferRequest');

exports.getEmployee = async (req, res) => {
  const employee = await Employee.findOne({ employeeId: req.params.id });
  if (!employee) return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Employee not found' } });
  res.json({ success: true, employee });
};

exports.requestTransfer = async (req, res) => {
  const transfer = new TransferRequest(req.body);
  await transfer.save();
  res.status(201).json({ success: true, message: 'Transfer request submitted for approval' });
};

exports.getTransferRequests = async (req, res) => {
  const requests = await TransferRequest.find({ status: 'pending' });
  res.json({ success: true, transferRequests: requests });
};

exports.approveTransfer = async (req, res) => {
  const { id } = req.params;
  const { approvedBy } = req.body;

  const request = await TransferRequest.findByIdAndUpdate(id, {
    status: 'approved',
    approvedBy
  }, { new: true });

  res.json({ success: true, message: 'Transfer request approved', request });
};

exports.rejectTransfer = async (req, res) => {
  const { id } = req.params;
  const { rejectedBy, rejectionReason } = req.body;

  const request = await TransferRequest.findByIdAndUpdate(id, {
    status: 'rejected',
    rejectedBy,
    rejectionReason
  }, { new: true });

  res.json({ success: true, message: 'Transfer request rejected', request });
};