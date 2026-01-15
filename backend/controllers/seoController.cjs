// controllers/seoController.cjs
const SEO = require('../models/SEO.cjs');

// Get all SEO entries with filtering and pagination
exports.getSEOEntries = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 10,
            pageType,
            status,
            language,
            search,
            sort = '-updatedAt'
        } = req.query;

        const filter = {};

        // Apply filters
        if (pageType) filter.pageType = pageType;
        if (status) filter.status = status;
        if (language) filter.language = language;

        // Search filter
        if (search) {
            filter.$or = [
                { title: new RegExp(search, 'i') },
                { description: new RegExp(search, 'i') },
                { pageIdentifier: new RegExp(search, 'i') },
                { keywords: new RegExp(search, 'i') }
            ];
        }

        const seoEntries = await SEO.find(filter)
            .populate('lastUpdatedBy', 'username email')
            .sort(sort)
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await SEO.countDocuments(filter);

        res.json({
            success: true,
            data: seoEntries,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('Get SEO entries error:', error);
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
};

// Get SEO entry by slug (for frontend use)
exports.getSEOBySlug = async (req, res) => {
    try {
        const { slug } = req.params;

        const seoEntry = await SEO.findOne({
            slug,
            status: 'active'
        }).populate('lastUpdatedBy', 'username email');

        if (!seoEntry) {
            return res.status(404).json({
                success: false,
                error: 'SEO entry not found'
            });
        }

        res.json({
            success: true,
            data: seoEntry
        });
    } catch (error) {
        console.error('Get SEO by slug error:', error);
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
};

// Get SEO entry by page type and identifier
exports.getSEOByPage = async (req, res) => {
    try {
        const { pageType, pageIdentifier } = req.params;
        // pageIdentifier might be undefined if not provided in URL
        const identifier = pageIdentifier || '';

        const seoEntry = await SEO.findOne({
            pageType,
            pageIdentifier: identifier,
            status: 'active'
        }).populate('lastUpdatedBy', 'username email');

        if (!seoEntry) {
            return res.status(404).json({
                success: false,
                error: 'SEO entry not found'
            });
        }

        res.json({
            success: true,
            data: seoEntry
        });
    } catch (error) {
        console.error('Get SEO by page error:', error);
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
};

// Get SEO entry by ID
exports.getSEOById = async (req, res) => {
    try {
        const { id } = req.params;

        const seoEntry = await SEO.findById(id)
            .populate('lastUpdatedBy', 'username email');

        if (!seoEntry) {
            return res.status(404).json({
                success: false,
                error: 'SEO entry not found'
            });
        }

        res.json({
            success: true,
            data: seoEntry
        });
    } catch (error) {
        console.error('Get SEO by ID error:', error);
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
};

// Create new SEO entry
exports.createSEO = async (req, res) => {
    try {
        const {
            pageType,
            pageIdentifier,
            title,
            description,
            keywords,
            canonicalUrl,
            ogTitle,
            ogDescription,
            ogImage,
            ogType,
            ogUrl,
            twitterCard,
            twitterTitle,
            twitterDescription,
            twitterImage,
            twitterSite,
            structuredData,
            googleAnalyticsId,
            facebookPixelId,
            targetKeywords,
            language,
            alternateLanguages,
            customMetaTags
        } = req.body;

        // Check if SEO entry already exists for this page
        const existingEntry = await SEO.findOne({
            pageType,
            pageIdentifier: pageIdentifier || ''
        });

        if (existingEntry) {
            return res.status(400).json({
                success: false,
                error: 'SEO entry already exists for this page'
            });
        }

        const seoEntry = new SEO({
            pageType,
            pageIdentifier: pageIdentifier || '',
            title,
            description,
            keywords: keywords || [],
            canonicalUrl,
            ogTitle: ogTitle || title,
            ogDescription: ogDescription || description,
            ogImage,
            ogType: ogType || 'website',
            ogUrl,
            twitterCard: twitterCard || 'summary_large_image',
            twitterTitle: twitterTitle || title,
            twitterDescription: twitterDescription || description,
            twitterImage,
            twitterSite,
            structuredData,
            googleAnalyticsId,
            facebookPixelId,
            targetKeywords: targetKeywords || [],
            language: language || 'en',
            alternateLanguages: alternateLanguages || [],
            customMetaTags: customMetaTags || [],
            lastUpdatedBy: "000000000000000000000123"
        });

        const savedEntry = await seoEntry.save();
        await savedEntry.populate('lastUpdatedBy', 'username email');

        res.status(201).json({
            success: true,
            message: 'SEO entry created successfully',
            data: savedEntry
        });
    } catch (error) {
        console.error('Create SEO error:', error);

        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(el => el.message);
            return res.status(400).json({
                success: false,
                error: 'Validation error',
                details: errors
            });
        }

        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
};

// Update SEO entry
exports.updateSEO = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = {
            ...req.body,
            lastUpdatedBy: req.admin.id
        };

        const seoEntry = await SEO.findByIdAndUpdate(
            id,
            updateData,
            {
                new: true,
                runValidators: true
            }
        ).populate('lastUpdatedBy', 'username email');

        if (!seoEntry) {
            return res.status(404).json({
                success: false,
                error: 'SEO entry not found'
            });
        }

        res.json({
            success: true,
            message: 'SEO entry updated successfully',
            data: seoEntry
        });
    } catch (error) {
        console.error('Update SEO error:', error);

        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(el => el.message);
            return res.status(400).json({
                success: false,
                error: 'Validation error',
                details: errors
            });
        }

        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
};

// Delete SEO entry
exports.deleteSEO = async (req, res) => {
    try {
        const { id } = req.params;

        const seoEntry = await SEO.findByIdAndDelete(id);

        if (!seoEntry) {
            return res.status(404).json({
                success: false,
                error: 'SEO entry not found'
            });
        }

        res.json({
            success: true,
            message: 'SEO entry deleted successfully'
        });
    } catch (error) {
        console.error('Delete SEO error:', error);
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
};

// Get SEO statistics
exports.getSEOStats = async (req, res) => {
    try {
        const totalEntries = await SEO.countDocuments();
        const activeEntries = await SEO.countDocuments({ status: 'active' });
        const inactiveEntries = await SEO.countDocuments({ status: 'inactive' });
        const draftEntries = await SEO.countDocuments({ status: 'draft' });

        // Count by page type
        const pageTypeStats = await SEO.aggregate([
            {
                $group: {
                    _id: '$pageType',
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { count: -1 }
            }
        ]);

        // Recent updates
        const recentUpdates = await SEO.find()
            .populate('lastUpdatedBy', 'username')
            .sort('-updatedAt')
            .limit(5)
            .select('pageType title updatedAt lastUpdatedBy');

        res.json({
            success: true,
            data: {
                total: totalEntries,
                active: activeEntries,
                inactive: inactiveEntries,
                draft: draftEntries,
                byPageType: pageTypeStats,
                recentUpdates
            }
        });
    } catch (error) {
        console.error('Get SEO stats error:', error);
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
};

// Bulk update SEO entries
exports.bulkUpdateSEO = async (req, res) => {
    try {
        const { entries, action } = req.body;

        if (!Array.isArray(entries) || entries.length === 0) {
            return res.status(400).json({
                success: false,
                error: 'Entries array is required'
            });
        }

        let updateResult;

        switch (action) {
            case 'activate':
                updateResult = await SEO.updateMany(
                    { _id: { $in: entries } },
                    { status: 'active', lastUpdatedBy: req.admin.id }
                );
                break;
            case 'deactivate':
                updateResult = await SEO.updateMany(
                    { _id: { $in: entries } },
                    { status: 'inactive', lastUpdatedBy: req.admin.id }
                );
                break;
            case 'delete':
                updateResult = await SEO.deleteMany({ _id: { $in: entries } });
                break;
            default:
                return res.status(400).json({
                    success: false,
                    error: 'Invalid action'
                });
        }

        res.json({
            success: true,
            message: `${updateResult.modifiedCount || updateResult.deletedCount} SEO entries updated successfully`,
            data: updateResult
        });
    } catch (error) {
        console.error('Bulk update SEO error:', error);
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
};

// Generate default SEO data for common pages
exports.generateDefaultSEO = async (req, res) => {
    try {
        const defaultEntries = [
            {
                pageType: 'home',
                title: 'Medical Tourism Platform - World-Class Healthcare Abroad',
                description: 'Connect with top hospitals and doctors worldwide. Get personalized medical treatment with our comprehensive healthcare platform.',
                keywords: ['medical tourism', 'healthcare abroad', 'international treatment', 'medical travel'],
                canonicalUrl: '/',
                ogTitle: 'Medical Tourism Platform - World-Class Healthcare Abroad',
                ogDescription: 'Connect with top hospitals and doctors worldwide. Get personalized medical treatment with our comprehensive healthcare platform.',
                ogType: 'website',
                twitterCard: 'summary_large_image'
            },
            {
                pageType: 'doctor-listing',
                title: 'Find Expert Doctors Worldwide - Medical Tourism Platform',
                description: 'Browse and connect with board-certified doctors and specialists worldwide. Compare expertise, experience, and patient reviews.',
                keywords: ['doctors', 'specialists', 'medical experts', 'physicians', 'surgeons'],
                canonicalUrl: '/doctors',
                ogTitle: 'Find Expert Doctors Worldwide - Medical Tourism Platform',
                ogDescription: 'Browse and connect with board-certified doctors and specialists worldwide.',
                ogType: 'website'
            },
            {
                pageType: 'hospital-listing',
                title: 'Top Hospitals Worldwide - International Healthcare Facilities',
                description: 'Discover world-class hospitals with advanced medical technology. Compare facilities, accreditations, and patient care quality.',
                keywords: ['hospitals', 'medical facilities', 'healthcare centers', 'clinics', 'medical centers'],
                canonicalUrl: '/hospitals',
                ogTitle: 'Top Hospitals Worldwide - International Healthcare Facilities',
                ogDescription: 'Discover world-class hospitals with advanced medical technology.',
                ogType: 'website'
            }
        ];

        const createdEntries = [];

        for (const entry of defaultEntries) {
            const existingEntry = await SEO.findOne({
                pageType: entry.pageType,
                pageIdentifier: ''
            });

            if (!existingEntry) {
                const newEntry = new SEO({
                    ...entry,
                    lastUpdatedBy: req.admin.id
                });
                const saved = await newEntry.save();
                createdEntries.push(saved);
            }
        }

        res.json({
            success: true,
            message: `Created ${createdEntries.length} default SEO entries`,
            data: createdEntries
        });
    } catch (error) {
        console.error('Generate default SEO error:', error);
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
};
