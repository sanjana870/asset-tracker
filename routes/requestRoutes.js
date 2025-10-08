import express from 'express';
import requestController from '../Controllers/requestControllers.js';
import { authenticate, authorize } from '../middlewares/Auth.middleware.js';

const router = express.Router();

router.post('/', authenticate, authorize(['manager']), requestController.submitRequest);
router.get('/', authenticate, requestController.getRequests);
router.put('/:id/approve', authenticate, authorize(['admin']), requestController.approveRequest);
router.put('/:id/reject', authenticate, authorize(['admin']), requestController.rejectRequest);

export default router;