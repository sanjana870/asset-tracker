const multer = require('multer');
const csvParser = require('../utils/csvParser');
const Asset = require('../models/Asset');

exports.bulkUpload = async (req, res) => {
  const { costCenterId } = req.body;
  const file = req.file;

  const { parsed, errors } = await csvParser(file.path, costCenterId);
  const summary = {
    totalProcessed: parsed.length + errors.length,
    successful: parsed.length,
    failed: errors.length,
    duplicates: errors.filter(e => e.error.includes('exists')).length
  };

  await Asset.insertMany(parsed);
  res.json({ success: true, message: 'Assets uploaded successfully', summary, errors });
};

exports.generateReport = async (req, res) => {
  const { costCenterId, format = 'csv' } = req.query;
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
};