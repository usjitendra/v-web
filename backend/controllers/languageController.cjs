const Language = require('../models/Language.cjs');

// Get all languages (public)
exports.getAllLanguages = async (req, res) => {
    try {
        const languages = await Language.find({ isActive: true })
            .sort({ fullName: 1 })
            .select('fullName shortCode isDefault');

        res.json({
            success: true,
            data: languages
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// Get all languages for admin
exports.adminGetAllLanguages = async (req, res) => {
    try {
        const { page = 1, limit = 10, search = '' } = req.query;

        const query = {};
        if (search) {
            query.$or = [
                { fullName: { $regex: search, $options: 'i' } },
                { shortCode: { $regex: search, $options: 'i' } }
            ];
        }

        const languages = await Language.find(query)
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await Language.countDocuments(query);

        res.json({
            success: true,
            data: languages,
            total,
            page: parseInt(page),
            pages: Math.ceil(total / limit)
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// Get single language
exports.getLanguage = async (req, res) => {
    try {
        const language = await Language.findById(req.params.id);
        if (!language) {
            return res.status(404).json({
                success: false,
                error: 'Language not found'
            });
        }

        res.json({
            success: true,
            data: language
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// Create language
exports.createLanguage = async (req, res) => {
    try {
        const { fullName, shortCode, isActive = true, isDefault = false } = req.body;

        // Check if language already exists
        const existingLanguage = await Language.findOne({
            $or: [
                { fullName: fullName.trim() },
                { shortCode: shortCode.trim().toUpperCase() }
            ]
        });

        if (existingLanguage) {
            return res.status(400).json({
                success: false,
                error: 'Language with this name or code already exists'
            });
        }

        const language = new Language({
            fullName: fullName.trim(),
            shortCode: shortCode.trim().toUpperCase(),
            isActive,
            isDefault
        });

        await language.save();

        res.status(201).json({
            success: true,
            data: language
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// Update language
exports.updateLanguage = async (req, res) => {
    try {
        const { fullName, shortCode, isActive, isDefault } = req.body;

        const language = await Language.findById(req.params.id);
        if (!language) {
            return res.status(404).json({
                success: false,
                error: 'Language not found'
            });
        }

        // Check for duplicate languages
        if (fullName || shortCode) {
            const duplicateQuery = {
                _id: { $ne: req.params.id },
                $or: []
            };

            if (fullName) duplicateQuery.$or.push({ fullName: fullName.trim() });
            if (shortCode) duplicateQuery.$or.push({ shortCode: shortCode.trim().toUpperCase() });

            if (duplicateQuery.$or.length > 0) {
                const existingLanguage = await Language.findOne(duplicateQuery);
                if (existingLanguage) {
                    return res.status(400).json({
                        success: false,
                        error: 'Language with this name or code already exists'
                    });
                }
            }
        }

        if (fullName) language.fullName = fullName.trim();
        if (shortCode) language.shortCode = shortCode.trim().toUpperCase();
        if (typeof isActive !== 'undefined') language.isActive = isActive;
        if (typeof isDefault !== 'undefined') language.isDefault = isDefault;

        await language.save();

        res.json({
            success: true,
            data: language
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// Delete language
exports.deleteLanguage = async (req, res) => {
    try {
        const language = await Language.findById(req.params.id);
        if (!language) {
            return res.status(404).json({
                success: false,
                error: 'Language not found'
            });
        }

        // Prevent deletion of default language
        if (language.isDefault) {
            return res.status(400).json({
                success: false,
                error: 'Cannot delete default language'
            });
        }

        await Language.findByIdAndDelete(req.params.id);

        res.json({
            success: true,
            message: 'Language deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// Set default language
exports.setDefaultLanguage = async (req, res) => {
    try {
        const language = await Language.findById(req.params.id);
        if (!language) {
            return res.status(404).json({
                success: false,
                error: 'Language not found'
            });
        }

        // Update all languages to not default
        await Language.updateMany({}, { $set: { isDefault: false } });

        // Set this language as default
        language.isDefault = true;
        await language.save();

        res.json({
            success: true,
            data: language
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};