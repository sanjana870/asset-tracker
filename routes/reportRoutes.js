const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const { authenticate, authorize } = require('../middleware/auth');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

router.post('/assets/bulk-upload', authenticate, authorize(['manager']), upload.single('file'), reportController.bulkUpload);
router.get('/assets', authenticate, reportController.generateReport);

module.exports = router;