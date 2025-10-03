const express = require('express');
const router = express.Router();
const assetController = require('../controllers/assetController');
const { authenticate, authorize } = require('../middleware/auth');

router.get('/', authenticate, assetController.getAssets);
router.post('/', authenticate, authorize(['admin', 'manager']), assetController.addAsset);
router.put('/:serial/assign', authenticate, authorize(['admin', 'manager']), assetController.assignAsset);
router.put('/:serial/reissue', authenticate, authorize(['admin']), assetController.reissueAsset);
router.delete('/:serial', authenticate, authorize(['admin']), assetController.deleteAsset);
router.get('/history', authenticate, authorize(['admin']), assetController.getDeletedAssets);

module.exports = router;