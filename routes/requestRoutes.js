const express = require('express');
const router = express.Router();
const requestController = require('../controllers/requestController');
const { authenticate, authorize } = require('../middleware/auth');

router.post('/', authenticate, authorize(['manager']), requestController.submitRequest);
router.get('/', authenticate, requestController.getRequests);
router.put('/:id/approve', authenticate, authorize(['admin']), requestController.approveRequest);
router.put('/:id/reject', authenticate, authorize(['admin']), requestController.rejectRequest);

module.exports = router;