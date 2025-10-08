import Request from '../models/Request.js';

export const submitRequest = async (req, res) => {
  try {
    const request = new Request(req.body);
    await request.save();
    res.status(201).json({ 
      success: true, 
      message: 'Request submitted successfully', 
      requestId: request._id 
    });
  } catch (error) {
    res.status(400).json({ 
      success: false, 
      error: { code: 'VALIDATION_ERROR', message: error.message } 
    });
  }
};

export const getRequests = async (req, res) => {
  try {
    const { managerId } = req.query;
    const query = managerId ? { managerId } : {};
    const requests = await Request.find(query);
    res.json({ success: true, requests });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: { code: 'SERVER_ERROR', message: 'Internal server error' } 
    });
  }
};

export const approveRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { approvedBy, approvalDate } = req.body;

    const request = await Request.findByIdAndUpdate(id, {
      status: 'approved',
      approvedBy,
      approvalDate
    }, { new: true });

    if (!request) {
      return res.status(404).json({ 
        success: false, 
        error: { code: 'NOT_FOUND', message: 'Request not found' } 
      });
    }

    res.json({ success: true, message: 'Request approved successfully', request });
  } catch (error) {
    res.status(400).json({ 
      success: false, 
      error: { code: 'VALIDATION_ERROR', message: error.message } 
    });
  }
};

export const rejectRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { rejectedBy, rejectionReason, rejectionDate } = req.body;

    const request = await Request.findByIdAndUpdate(id, {
      status: 'rejected',
      rejectedBy,
      rejectionReason,
      rejectionDate
    }, { new: true });

    if (!request) {
      return res.status(404).json({ 
        success: false, 
        error: { code: 'NOT_FOUND', message: 'Request not found' } 
      });
    }

    res.json({ success: true, message: 'Request rejected successfully', request });
  } catch (error) {
    res.status(400).json({ 
      success: false, 
      error: { code: 'VALIDATION_ERROR', message: error.message } 
    });
  }
};

export default {
  submitRequest,
  getRequests,
  approveRequest,
  rejectRequest
};