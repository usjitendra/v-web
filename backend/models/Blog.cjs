// models/Blog.cjs
const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Blog title is required'],
        trim: true,
        maxlength: [200, 'Title cannot be more than 200 characters']
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    excerpt: {
        type: String,
        required: [true, 'Excerpt is required'],
        maxlength: [300, 'Excerpt cannot be more than 300 characters']
    },
    content: {
        type: String,
        required: [true, 'Blog content is required']
    },
    featuredImage: {
        type: String,
        default: ''
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin',
        required: true
    },
    categories: [{
        type: String,
        trim: true
    }],
    tags: [{
        type: String,
        trim: true
    }],
    status: {
        type: String,
        enum: ['draft', 'published', 'archived'],
        default: 'draft'
    },
    isFeatured: {
        type: Boolean,
        default: false
    },
    readTime: {
        type: Number, // in minutes
        default: 0
    },
    views: {
        type: Number,
        default: 0
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient'
    }],
    comments: [{
        patient: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Patient'
        },
        text: {
            type: String,
            required: true
        },
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        isApproved: {
            type: Boolean,
            default: false
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    language: {
        type: String,
        default: 'EN'
    },
    metaTitle: {
        type: String,
        trim: true
    },
    metaDescription: {
        type: String,
        trim: true,
        maxlength: [160, 'Meta description cannot be more than 160 characters']
    },
    publishedAt: {
        type: Date
    }
}, {
    timestamps: true
});

// Generate slug from title before saving
blogSchema.pre('validate', function (next) {
    if (this.isModified('title') && this.title) {
        this.slug = this.title
            .toLowerCase()
            .replace(/[^a-z0-9 -]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim('-');
    }

    // Calculate read time (approximately 200 words per minute)
    if (this.isModified('content') && this.content) {
        const words = this.content.split(/\s+/).length;
        this.readTime = Math.ceil(words / 200);
    }

    // Set publishedAt date when status changes to published
    if (this.isModified('status') && this.status === 'published' && !this.publishedAt) {
        this.publishedAt = new Date();
    }

    next();
});

// Index for better performance
blogSchema.index({ slug: 1 });
blogSchema.index({ status: 1, publishedAt: -1 });
blogSchema.index({ categories: 1 });
blogSchema.index({ isFeatured: 1 });
blogSchema.index({ author: 1 });

// Virtual for comment count
blogSchema.virtual('commentCount').get(function () {
    return this.comments.filter(comment => comment.isApproved).length;
});

// Virtual for like count
blogSchema.virtual('likeCount').get(function () {
    return this.likes.length;
});

module.exports = mongoose.model('Blog', blogSchema);