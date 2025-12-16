const ProcedureCost = require('../models/ProcedureCost.cjs');

// Get all procedure costs with filtering
exports.getProcedureCosts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10000,
      category,
      search
    } = req.query;

    const filter = { isActive: true };
    if (category) filter.category = category;
    if (search) {
      filter.$or = [
        { title: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') }
      ];
    }

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: { title: 1 }
    };

    const procedures = await ProcedureCost.find(filter)
      .sort(options.sort)
      .limit(options.limit * 1)
      .skip((options.page - 1) * options.limit);

    const total = await ProcedureCost.countDocuments(filter);

    res.json({
      success: true,
      count: procedures.length,
      total,
      page: options.page,
      pages: Math.ceil(total / options.limit),
      data: procedures
    });
  } catch (err) {
    console.error('Get procedure costs error:', err);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// Get single procedure cost
exports.getProcedureCost = async (req, res) => {
  try {
    const procedure = await ProcedureCost.findById(req.params.id);

    if (!procedure) {
      return res.status(404).json({ success: false, error: 'Procedure not found' });
    }

    res.json({
      success: true,
      data: procedure
    });
  } catch (err) {
    console.error('Get procedure cost error:', err);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// Create new procedure cost
exports.createProcedureCost = async (req, res) => {
  try {
    const { title, basePrice, category } = req.body;

    if (!title || !basePrice || !category) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: title, basePrice, category'
      });
    }

    // Check if procedure already exists
    const existingProcedure = await ProcedureCost.findOne({
      title: new RegExp(`^${title}$`, 'i')
    });

    if (existingProcedure) {
      return res.status(400).json({
        success: false,
        error: 'Procedure with this title already exists'
      });
    }

    const procedure = await ProcedureCost.create(req.body);
    res.status(201).json({ success: true, data: procedure });
  } catch (err) {
    console.error('Create procedure cost error:', err);
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(val => val.message);
      return res.status(400).json({ success: false, error: messages });
    }
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// Update procedure cost
exports.updateProcedureCost = async (req, res) => {
  try {
    const procedure = await ProcedureCost.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!procedure) {
      return res.status(404).json({ success: false, error: 'Procedure not found' });
    }

    res.json({ success: true, data: procedure });
  } catch (err) {
    console.error('Update procedure cost error:', err);
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(val => val.message);
      return res.status(400).json({ success: false, error: messages });
    }
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// Delete procedure cost (soft delete)
exports.deleteProcedureCost = async (req, res) => {
  try {
    const procedure = await ProcedureCost.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!procedure) {
      return res.status(404).json({ success: false, error: 'Procedure not found' });
    }

    res.json({ success: true, message: 'Procedure deleted successfully', data: procedure });
  } catch (err) {
    console.error('Delete procedure cost error:', err);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// Get procedures by category
exports.getProceduresByCategory = async (req, res) => {
  try {
    const { page = 1, limit = 10000 } = req.query;
    const filter = { category: req.params.category, isActive: true };

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: { basePrice: 1 }
    };

    const procedures = await ProcedureCost.find(filter)
      .sort(options.sort)
      .limit(options.limit * 1)
      .skip((options.page - 1) * options.limit);

    const total = await ProcedureCost.countDocuments(filter);

    res.json({
      success: true,
      count: procedures.length,
      total,
      page: options.page,
      pages: Math.ceil(total / options.limit),
      data: procedures
    });
  } catch (err) {
    console.error('Get procedures by category error:', err);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// Get procedures by treatment
exports.getProceduresByTreatment = async (req, res) => {
  try {
    const { page = 1, limit = 10000 } = req.query;
    const treatmentId = req.params.treatmentId;

    if (!treatmentId) {
      return res.status(400).json({ success: false, error: 'Treatment ID is required' });
    }

    const filter = { treatment: treatmentId, isActive: true };

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: { basePrice: 1 }
    };

    const procedures = await ProcedureCost.find(filter)
      .populate("treatment", "title description category") // optional: populate treatment details
      .sort(options.sort)
      .limit(options.limit * 1)
      .skip((options.page - 1) * options.limit);

    const total = await ProcedureCost.countDocuments(filter);

    res.json({
      success: true,
      count: procedures.length,
      total,
      page: options.page,
      pages: Math.ceil(total / options.limit),
      data: procedures
    });
  } catch (err) {
    console.error('Get procedures by treatment error:', err);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};
