import Asset from '../models/Asset.js';
import AssetHistory from '../models/AssetHistory.js';

export const getAssets = async (req, res) => {
  try {
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
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: { code: 'SERVER_ERROR', message: 'Internal server error' } 
    });
  }
};

export const addAsset = async (req, res) => {
  try {
    const asset = new Asset(req.body);
    await asset.save();
    res.status(201).json({ success: true, message: 'Asset created successfully', asset });
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ 
        success: false, 
        error: { code: 'DUPLICATE_ERROR', message: 'Asset serial number already exists' } 
      });
    } else {
      res.status(400).json({ 
        success: false, 
        error: { code: 'VALIDATION_ERROR', message: error.message } 
      });
    }
  }
};

export const assignAsset = async (req, res) => {
  try {
    const { serial } = req.params;
    const asset = await Asset.findOneAndUpdate(
      { serial },
      { assignedTo: req.body, status: 'assigned' },
      { new: true }
    );

    if (!asset) {
      return res.status(404).json({ 
        success: false, 
        error: { code: 'NOT_FOUND', message: 'Asset not found' } 
      });
    }

    res.json({ success: true, message: 'Asset assigned successfully', asset });
  } catch (error) {
    res.status(400).json({ 
      success: false, 
      error: { code: 'VALIDATION_ERROR', message: error.message } 
    });
  }
};

export const reissueAsset = async (req, res) => {
  try {
    const { serial } = req.params;
    const asset = await Asset.findOneAndUpdate(
      { serial },
      { assignedTo: req.body, status: 'assigned' },
      { new: true }
    );

    if (!asset) {
      return res.status(404).json({ 
        success: false, 
        error: { code: 'NOT_FOUND', message: 'Asset not found' } 
      });
    }

    res.json({ success: true, message: 'Asset reissued successfully', asset });
  } catch (error) {
    res.status(400).json({ 
      success: false, 
      error: { code: 'VALIDATION_ERROR', message: error.message } 
    });
  }
};

export const deleteAsset = async (req, res) => {
  try {
    const { serial } = req.params;
    const { reason, deletedBy } = req.body;

    const asset = await Asset.findOne({ serial });
    if (!asset) {
      return res.status(404).json({ 
        success: false, 
        error: { code: 'NOT_FOUND', message: 'Asset not found' } 
      });
    }

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
  } catch (error) {
    res.status(400).json({ 
      success: false, 
      error: { code: 'VALIDATION_ERROR', message: error.message } 
    });
  }
};

export const getDeletedAssets = async (req, res) => {
  try {
    const deletedAssets = await AssetHistory.find();
    res.json({ success: true, deletedAssets });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: { code: 'SERVER_ERROR', message: 'Internal server error' } 
    });
  }
};

export default {
  getAssets,
  addAsset,
  assignAsset,
  reissueAsset,
  deleteAsset,
  getDeletedAssets
};