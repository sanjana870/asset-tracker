import express from 'express';
import reportController from '../Controllers/reportControllers.js';
import { authenticate, authorize } from '../middlewares/Auth.middleware.js';
import multer from 'multer';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/assets/bulk-upload', authenticate, authorize(['manager']), upload.single('file'), reportController.bulkUpload);
router.get('/assets', authenticate, reportController.generateReport);

export default router;