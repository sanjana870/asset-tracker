import express from 'express';
import employeeController from '../Controllers/employeeControllers.js';
import { authenticate, authorize } from '../middlewares/Auth.middleware.js';

const router = express.Router();

router.get('/:id', authenticate, employeeController.getEmployee);
router.post('/', authenticate, authorize(['admin', 'manager']), employeeController.createEmployee);
router.put('/:employeeId', authenticate, authorize(['admin', 'manager']), employeeController.updateEmployee);
router.put('/:id/manager', authenticate, authorize(['manager']), employeeController.requestTransfer);
router.get('/transfer-requests', authenticate, authorize(['admin']), employeeController.getTransferRequests);
router.put('/transfer-requests/:id/approve', authenticate, authorize(['admin']), employeeController.approveTransfer);
router.put('/transfer-requests/:id/reject', authenticate, authorize(['admin']), employeeController.rejectTransfer);

export default router;