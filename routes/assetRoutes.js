import express from 'express';
import assetController from '../Controllers/assetControllers.js';
import { authenticate, authorize } from '../middlewares/Auth.middleware.js';

const router = express.Router();

router.get('/', authenticate, assetController.getAssets);
router.post('/', authenticate, authorize(['admin', 'manager']), assetController.addAsset);
router.put('/:serial/assign', authenticate, authorize(['admin', 'manager']), assetController.assignAsset);
router.put('/:serial/reissue', authenticate, authorize(['admin']), assetController.reissueAsset);
router.delete('/:serial', authenticate, authorize(['admin']), assetController.deleteAsset);
router.get('/history', authenticate, authorize(['admin']), assetController.getDeletedAssets);

export default router;