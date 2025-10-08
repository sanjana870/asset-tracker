import Employee from '../models/Employee.js';
import TransferRequest from '../models/TransferRequest.js';

export const getEmployee = async (req, res) => {
  try {
    const employee = await Employee.findOne({ employeeId: req.params.id });
    if (!employee) {
      return res.status(404).json({ 
        success: false, 
        error: { code: 'NOT_FOUND', message: 'Employee not found' } 
      });
    }
    res.json({ success: true, employee });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: { code: 'SERVER_ERROR', message: 'Internal server error' } 
    });
  }
};

export const createEmployee = async (req, res) => {
  try {
    const employee = new Employee(req.body);
    await employee.save();
    res.status(201).json({ 
      success: true, 
      message: 'Employee created successfully', 
      employee 
    });
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ 
        success: false, 
        error: { code: 'DUPLICATE_ERROR', message: 'Employee ID already exists' } 
      });
    } else {
      res.status(400).json({ 
        success: false, 
        error: { code: 'VALIDATION_ERROR', message: error.message } 
      });
    }
  }
};

export const updateEmployee = async (req, res) => {
  const { employeeId } = req.params;
  const updateData = req.body;

  try {
    const employee = await Employee.findOneAndUpdate(
      { employeeId },
      updateData,
      { new: true, runValidators: true }
    );

    if (!employee) {
      return res.status(404).json({ 
        success: false, 
        error: { code: 'NOT_FOUND', message: 'Employee not found' } 
      });
    }

    res.json({ 
      success: true, 
      message: 'Employee updated successfully', 
      employee 
    });
  } catch (error) {
    res.status(400).json({ 
      success: false, 
      error: { code: 'VALIDATION_ERROR', message: error.message } 
    });
  }
};

export const requestTransfer = async (req, res) => {
  try {
    const transfer = new TransferRequest(req.body);
    await transfer.save();
    res.status(201).json({ 
      success: true, 
      message: 'Transfer request submitted for approval' 
    });
  } catch (error) {
    res.status(400).json({ 
      success: false, 
      error: { code: 'VALIDATION_ERROR', message: error.message } 
    });
  }
};

export const getTransferRequests = async (req, res) => {
  try {
    const requests = await TransferRequest.find({ status: 'pending' });
    res.json({ success: true, transferRequests: requests });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: { code: 'SERVER_ERROR', message: 'Internal server error' } 
    });
  }
};

export const approveTransfer = async (req, res) => {
  const { id } = req.params;
  const { approvedBy } = req.body;

  try {
    const request = await TransferRequest.findByIdAndUpdate(id, {
      status: 'approved',
      approvedBy
    }, { new: true });

    if (!request) {
      return res.status(404).json({ 
        success: false, 
        error: { code: 'NOT_FOUND', message: 'Transfer request not found' } 
      });
    }

    res.json({ success: true, message: 'Transfer request approved', request });
  } catch (error) {
    res.status(400).json({ 
      success: false, 
      error: { code: 'VALIDATION_ERROR', message: error.message } 
    });
  }
};

export const rejectTransfer = async (req, res) => {
  const { id } = req.params;
  const { rejectedBy, rejectionReason } = req.body;

  try {
    const request = await TransferRequest.findByIdAndUpdate(id, {
      status: 'rejected',
      rejectedBy,
      rejectionReason
    }, { new: true });

    if (!request) {
      return res.status(404).json({ 
        success: false, 
        error: { code: 'NOT_FOUND', message: 'Transfer request not found' } 
      });
    }

    res.json({ success: true, message: 'Transfer request rejected', request });
  } catch (error) {
    res.status(400).json({ 
      success: false, 
      error: { code: 'VALIDATION_ERROR', message: error.message } 
    });
  }
};

export default {
  getEmployee,
  createEmployee,
  updateEmployee,
  requestTransfer,
  getTransferRequests,
  approveTransfer,
  rejectTransfer
};