// models/SEO.cjs
const mongoose = require('mongoose');

const seoSchema = new mongoose.Schema({
    // Page identification
    pageType: {
        type: String,
        required: true,
        enum: [
            'home',
            'doctor-listing',
            'hospital-listing',
            'doctor-detail',
            'hospital-detail',
            'blog-listing',
            'blog-detail',
            'contact',
            'about',
            'treatments',
            'custom'
        ]
    },
    pageIdentifier: {
        type: String,
        default: '',
        // For detail pages, this could be slug/ID
        // For custom pages, this could be custom identifier
    },

    // Basic Meta Tags
    title: {
        type: String,
        required: true,
        maxlength: [70, 'Title should not exceed 70 characters for optimal SEO']
    },
    description: {
        type: String,
        required: true,
        maxlength: [160, 'Description should not exceed 160 characters for optimal SEO']
    },
    keywords: [{
        type: String,
        trim: true
    }],
    canonicalUrl: {
        type: String,
        trim: true
    },

    // Open Graph Tags (Facebook, LinkedIn, etc.)
    ogTitle: {
        type: String,
        maxlength: [95, 'Open Graph title should not exceed 95 characters']
    },
    ogDescription: {
        type: String,
        maxlength: [200, 'Open Graph description should not exceed 200 characters']
    },
    ogImage: {
        type: String,
        default: ''
    },
    ogType: {
        type: String,
        default: 'website',
        enum: ['website', 'article', 'product', 'profile']
    },
    ogUrl: {
        type: String,
        trim: true
    },

    // Twitter Card Tags
    twitterCard: {
        type: String,
        default: 'summary_large_image',
        enum: ['summary', 'summary_large_image', 'app', 'player']
    },
    twitterTitle: {
        type: String,
        maxlength: [70, 'Twitter title should not exceed 70 characters']
    },
    twitterDescription: {
        type: String,
        maxlength: [200, 'Twitter description should not exceed 200 characters']
    },
    twitterImage: {
        type: String,
        default: ''
    },
    twitterSite: {
        type: String,
        default: '@MedicalTravelCo' // Default Twitter handle
    },

    // Structured Data (JSON-LD)
    structuredData: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    },

    // Additional SEO Settings
    robotsMeta: {
        index: {
            type: Boolean,
            default: true
        },
        follow: {
            type: Boolean,
            default: true
        },
        noarchive: {
            type: Boolean,
            default: false
        },
        nosnippet: {
            type: Boolean,
            default: false
        },
        noimageindex: {
            type: Boolean,
            default: false
        }
    },

    // Custom Meta Tags
    customMetaTags: [{
        name: String,
        property: String, // For Open Graph
        content: {
            type: String,
            required: true
        },
        httpEquiv: String // For http-equiv tags
    }],

    // Analytics & Tracking
    googleAnalyticsId: {
        type: String,
        trim: true
    },
    facebookPixelId: {
        type: String,
        trim: true
    },

    // SEO Performance Tracking
    targetKeywords: [{
        keyword: {
            type: String,
            required: true
        },
        priority: {
            type: String,
            enum: ['high', 'medium', 'low'],
            default: 'medium'
        },
        currentRanking: {
            type: Number,
            default: null
        },
        searchVolume: {
            type: Number,
            default: null
        },
        competition: {
            type: String,
            enum: ['low', 'medium', 'high'],
            default: 'medium'
        }
    }],

    // Content Optimization
    readabilityScore: {
        type: Number,
        min: 0,
        max: 100,
        default: null
    },
    seoScore: {
        type: Number,
        min: 0,
        max: 100,
        default: null
    },

    // Multilingual Support
    language: {
        type: String,
        default: 'en',
        maxlength: [2, 'Language code should be 2 characters']
    },
    alternateLanguages: [{
        lang: {
            type: String,
            required: true,
            maxlength: [2, 'Language code should be 2 characters']
        },
        url: {
            type: String,
            required: true
        }
    }],

    // Status & Management
    status: {
        type: String,
        enum: ['active', 'inactive', 'draft'],
        default: 'active'
    },
    lastUpdatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin'
    },

    // Auto-generated fields
    slug: {
        type: String,
        unique: true,
        lowercase: true
    }
}, {
    timestamps: true
});

// Generate slug before saving
seoSchema.pre('validate', function (next) {
    if (this.isModified('pageType') || this.isModified('pageIdentifier')) {
        const baseSlug = this.pageIdentifier
            ? `${this.pageType}-${this.pageIdentifier}`
            : this.pageType;

        this.slug = baseSlug
            .toLowerCase()
            .replace(/[^a-z0-9 -]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim('-');
    }

    // Set default Open Graph and Twitter values if not provided
    if (!this.ogTitle && this.title) {
        this.ogTitle = this.title;
    }
    if (!this.ogDescription && this.description) {
        this.ogDescription = this.description;
    }
    if (!this.twitterTitle && this.title) {
        this.twitterTitle = this.title;
    }
    if (!this.twitterDescription && this.description) {
        this.twitterDescription = this.description;
    }

    next();
});

// Virtual for full robots meta content
seoSchema.virtual('robotsContent').get(function () {
    const directives = [];

    if (!this.robotsMeta.index) directives.push('noindex');
    if (!this.robotsMeta.follow) directives.push('nofollow');
    if (this.robotsMeta.noarchive) directives.push('noarchive');
    if (this.robotsMeta.nosnippet) directives.push('nosnippet');
    if (this.robotsMeta.noimageindex) directives.push('noimageindex');

    return directives.length > 0 ? directives.join(', ') : 'index, follow';
});

// Ensure virtual fields are serialized
seoSchema.set('toJSON', { virtuals: true });
seoSchema.set('toObject', { virtuals: true });

// Indexes for better performance
seoSchema.index({ pageType: 1, pageIdentifier: 1 }, { unique: true });
seoSchema.index({ slug: 1 }, { unique: true });
seoSchema.index({ status: 1 });
seoSchema.index({ language: 1 });

module.exports = mongoose.model('SEO', seoSchema);
