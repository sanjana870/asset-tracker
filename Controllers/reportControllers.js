import multer from 'multer';
import csvParser from '../utils/csvParser.js';
import Asset from '../models/Asset.js';

export const bulkUpload = async (req, res) => {
  try {
    const { costCenterId } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ 
        success: false, 
        error: { code: 'MISSING_FILE', message: 'No file uploaded' } 
      });
    }

    const { parsed, errors } = await csvParser(file.path, costCenterId);
    const summary = {
      totalProcessed: parsed.length + errors.length,
      successful: parsed.length,
      failed: errors.length,
      duplicates: errors.filter(e => e.error.includes('exists')).length
    };

    await Asset.insertMany(parsed);
    res.json({ success: true, message: 'Assets uploaded successfully', summary, errors });
  } catch (error) {
    res.status(400).json({ 
      success: false, 
      error: { code: 'UPLOAD_ERROR', message: error.message } 
    });
  }
};

export const generateReport = async (req, res) => {
  try {
    const { costCenterId, format = 'csv' } = req.query;
    
    if (!costCenterId) {
      return res.status(400).json({ 
        success: false, 
        error: { code: 'MISSING_PARAMETER', message: 'Cost Center ID is required' } 
      });
    }

    const assets = await Asset.find({ costCenterId });

    // Convert to CSV or Excel (simplified here)
    const rows = assets.map(a => ({
      serial: a.serial,
      manufacturer: a.manufacturer,
      model: a.model,
      date: a.date.toISOString().split('T')[0],
      status: a.status,
      employeeId: a.assignedTo?.employeeId || '',
      name: `${a.assignedTo?.firstName || ''} ${a.assignedTo?.lastName || ''}`,
      email: a.assignedTo?.email || '',
      lineManager: a.assignedTo?.lineManager || '',
      lineManagerId: a.assignedTo?.lineManagerId || '',
      lineManagerEmail: a.assignedTo?.lineManagerEmail || '',
      costCenterId: a.assignedTo?.costCenterId || ''
    }));

    res.setHeader('Content-Disposition', `attachment; filename="Asset_Report_${costCenterId}.${format}"`);
    res.setHeader('Content-Type', 'application/octet-stream');
    res.send(rows.map(r => Object.values(r).join(',')).join('\n'));
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: { code: 'SERVER_ERROR', message: 'Internal server error' } 
    });
  }
};

export default {
  bulkUpload,
  generateReport
};