const Request = require('../models/Request');

exports.submitRequest = async (req, res) => {
  const request = new Request(req.body);
  await request.save();
  res.status(201).json({ success: true, message: 'Request submitted successfully', requestId: request._id });
};

exports.getRequests = async (req, res) => {
  const { managerId } = req.query;
  const query = managerId ? { managerId } : {};
  const requests = await Request.find(query);
  res.json({ success: true, requests });
};

exports.approveRequest = async (req, res) => {
  const { id } = req.params;
  const { approvedBy, approvalDate } = req.body;

  const request = await Request.findByIdAndUpdate(id, {
    status: 'approved',
    approvedBy,
    approvalDate
  }, { new: true });

  res.json({ success: true, message: 'Request approved successfully', request });
};

exports.rejectRequest = async (req, res) => {
  const { id } = req.params;
  const { rejectedBy, rejectionReason, rejectionDate } = req.body;

  const request = await Request.findByIdAndUpdate(id, {
    status: 'rejected',
    rejectedBy,
    rejectionReason,
    rejectionDate
  }, { new: true });

  res.json({ success: true, message: 'Request rejected successfully', request });
};