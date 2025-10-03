const Asset = require('../models/Asset');
const AssetHistory = require('../models/AssetHistory');

exports.getAssets = async (req, res) => {
  const { page = 1, limit = 10, search = '', type, costCenterId } = req.query;
  const query = {};

  if (search) {
    query.$or = [
      { serial: { $regex: search, $options: 'i' } },
      { 'assignedTo.employeeId': { $regex: search, $options: 'i' } },
      { costCenterId: { $regex: search, $options: 'i' } }
    ];
  }
  if (type) query.status = type;
  if (costCenterId) query.costCenterId = costCenterId;

  const assets = await Asset.find(query)
    .skip((page - 1) * limit)
    .limit(Number(limit));

  const total = await Asset.countDocuments(query);
  res.json({
    success: true,
    assets,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / limit)
    }
  });
};

exports.addAsset = async (req, res) => {
  const asset = new Asset(req.body);
  await asset.save();
  res.status(201).json({ success: true, message: 'Asset created successfully', asset });
};

exports.assignAsset = async (req, res) => {
  const { serial } = req.params;
  const asset = await Asset.findOneAndUpdate(
    { serial },
    { assignedTo: req.body, status: 'assigned' },
    { new: true }
  );
  res.json({ success: true, message: 'Asset assigned successfully', asset });
};

exports.reissueAsset = async (req, res) => {
  const { serial } = req.params;
  const asset = await Asset.findOneAndUpdate(
    { serial },
    { assignedTo: req.body, status: 'assigned' },
    { new: true }
  );
  res.json({ success: true, message: 'Asset reissued successfully', asset });
};

exports.deleteAsset = async (req, res) => {
  const { serial } = req.params;
  const { reason, deletedBy } = req.body;

  const asset = await Asset.findOne({ serial });
  if (!asset) return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Asset not found' } });

  const history = new AssetHistory({
    serial: asset.serial,
    manufacturer: asset.manufacturer,
    model: asset.model,
    costCenterId: asset.costCenterId,
    deleteReason: reason,
    deletedBy
  });

  await history.save();
  await Asset.deleteOne({ serial });

  res.json({ success: true, message: 'Asset deleted successfully' });
};

exports.getDeletedAssets = async (req, res) => {
  const deletedAssets = await AssetHistory.find();
  res.json({ success: true, deletedAssets });
};