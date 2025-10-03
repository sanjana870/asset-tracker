const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');
const { authenticate, authorize } = require('../middleware/auth');

router.get('/:id', authenticate, employeeController.getEmployee);
router.put('/:id/manager', authenticate, authorize(['manager']), employeeController.requestTransfer);
router.get('/transfer-requests', authenticate, authorize(['admin']), employeeController.getTransferRequests);
router.put('/transfer-requests/:id/approve', authenticate, authorize(['admin']), employeeController.approveTransfer);
router.put('/transfer-requests/:id/reject', authenticate, authorize(['admin']), employeeController.rejectTransfer);

module.exports = router;