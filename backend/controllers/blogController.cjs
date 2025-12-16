// controllers/blogController.cjs
const Blog = require('../models/Blog.cjs');
const mongoose = require('mongoose');

// Get all published blogs (public)
exports.getBlogs = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 10,
            category,
            tag,
            search,
            featured,
            sort = '-publishedAt'
        } = req.query;

        const filter = { status: 'published' };

        // Filter by category
        if (category) {
            filter.categories = { $in: [category] };
        }

        // Filter by tag
        if (tag) {
            filter.tags = { $in: [tag] };
        }

        // Filter by featured
        if (featured !== undefined) {
            filter.isFeatured = featured === 'true';
        }

        // Search filter
        if (search) {
            filter.$or = [
                { title: new RegExp(search, 'i') },
                { excerpt: new RegExp(search, 'i') },
                { content: new RegExp(search, 'i') },
                { categories: new RegExp(search, 'i') },
                { tags: new RegExp(search, 'i') }
            ];
        }

        const blogs = await Blog.find(filter)
            .populate('author', 'username email')
            .select('-content') // Don't include full content in list
            .sort(sort)
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await Blog.countDocuments(filter);

        res.json({
            success: true,
            data: blogs,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('Get blogs error:', error);
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
};

// Get single blog by slug (public)
exports.getBlogBySlug = async (req, res) => {
    try {
        const { slug } = req.params;

        const blog = await Blog.findOne({
            slug,
            status: 'published'
        })
            .populate('author', 'username email')
            .populate('comments.patient', 'firstName lastName');

        if (!blog) {
            return res.status(404).json({
                success: false,
                error: 'Blog not found'
            });
        }

        // Increment view count
        blog.views += 1;
        await blog.save();

        res.json({
            success: true,
            data: blog
        });
    } catch (error) {
        console.error('Get blog by slug error:', error);
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
};

// Get blog categories (public)
exports.getBlogCategories = async (req, res) => {
    try {
        const categories = await Blog.aggregate([
            { $match: { status: 'published' } },
            { $unwind: '$categories' },
            {
                $group: {
                    _id: '$categories',
                    count: { $sum: 1 }
                }
            },
            { $sort: { count: -1 } }
        ]);

        res.json({
            success: true,
            data: categories
        });
    } catch (error) {
        console.error('Get blog categories error:', error);
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
};

// Get blog tags (public)
exports.getBlogTags = async (req, res) => {
    try {
        const tags = await Blog.aggregate([
            { $match: { status: 'published' } },
            { $unwind: '$tags' },
            {
                $group: {
                    _id: '$tags',
                    count: { $sum: 1 }
                }
            },
            { $sort: { count: -1 } }
        ]);

        res.json({
            success: true,
            data: tags
        });
    } catch (error) {
        console.error('Get blog tags error:', error);
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
};

// Add comment to blog (public)
exports.addComment = async (req, res) => {
    try {
        const { slug } = req.params;
        const { text, name, email, patientId } = req.body;

        if (!text || !name || !email) {
            return res.status(400).json({
                success: false,
                error: 'Text, name, and email are required'
            });
        }

        const blog = await Blog.findOne({
            slug,
            status: 'published'
        });

        if (!blog) {
            return res.status(404).json({
                success: false,
                error: 'Blog not found'
            });
        }

        const newComment = {
            text,
            name,
            email,
            patient: patientId || null,
            isApproved: false // Comments need approval
        };

        blog.comments.push(newComment);
        await blog.save();

        res.json({
            success: true,
            message: 'Comment submitted for approval',
            data: newComment
        });
    } catch (error) {
        console.error('Add comment error:', error);
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
};

// Like/unlike blog (protected - requires patient auth)
exports.toggleLike = async (req, res) => {
    try {
        const { slug } = req.params;
        const { patientId } = req.body;

        if (!patientId) {
            return res.status(400).json({
                success: false,
                error: 'Patient ID is required'
            });
        }

        const blog = await Blog.findOne({
            slug,
            status: 'published'
        });

        if (!blog) {
            return res.status(404).json({
                success: false,
                error: 'Blog not found'
            });
        }

        const patientObjectId = new mongoose.Types.ObjectId(patientId);
        const hasLiked = blog.likes.includes(patientObjectId);

        if (hasLiked) {
            // Unlike
            blog.likes = blog.likes.filter(
                like => !like.equals(patientObjectId)
            );
        } else {
            // Like
            blog.likes.push(patientObjectId);
        }

        await blog.save();

        res.json({
            success: true,
            message: hasLiked ? 'Blog unliked' : 'Blog liked',
            data: {
                liked: !hasLiked,
                likeCount: blog.likes.length
            }
        });
    } catch (error) {
        console.error('Toggle like error:', error);
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
};

// Get featured blogs (public)
exports.getFeaturedBlogs = async (req, res) => {
    try {
        const { limit = 3 } = req.query;

        const blogs = await Blog.find({
            status: 'published',
            isFeatured: true
        })
            .populate('author', 'username email')
            .select('-content')
            .sort('-publishedAt')
            .limit(parseInt(limit));

        res.json({
            success: true,
            data: blogs
        });
    } catch (error) {
        console.error('Get featured blogs error:', error);
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
};

// Get recent blogs (public)
exports.getRecentBlogs = async (req, res) => {
    try {
        const { limit = 6 } = req.query;

        const blogs = await Blog.find({
            status: 'published'
        })
            .populate('author', 'username email')
            .select('-content')
            .sort('-publishedAt')
            .limit(parseInt(limit));

        res.json({
            success: true,
            data: blogs
        });
    } catch (error) {
        console.error('Get recent blogs error:', error);
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
};

// controllers/blogController.cjs - Add these admin methods

// Admin: Get all blogs (including drafts)
exports.getAdminBlogs = async (req, res) => {
    try {
        const { 
            page = 1, 
            limit = 10, 
            status, 
            category, 
            tag, 
            search,
            sort = '-createdAt'
        } = req.query;

        const filter = {};

        // Filter by status
        if (status) {
            filter.status = status;
        }

        // Filter by category
        if (category) {
            filter.categories = { $in: [category] };
        }

        // Filter by tag
        if (tag) {
            filter.tags = { $in: [tag] };
        }

        // Search filter
        if (search) {
            filter.$or = [
                { title: new RegExp(search, 'i') },
                { excerpt: new RegExp(search, 'i') },
                { content: new RegExp(search, 'i') }
            ];
        }

        const blogs = await Blog.find(filter)
            .populate('author', 'username email')
            .sort(sort)
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await Blog.countDocuments(filter);

        res.json({
            success: true,
            data: blogs,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('Get admin blogs error:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Server Error' 
        });
    }
};

// Admin: Get blog statistics
exports.getBlogStats = async (req, res) => {
    try {
        const totalBlogs = await Blog.countDocuments();
        const publishedBlogs = await Blog.countDocuments({ status: 'published' });
        const draftBlogs = await Blog.countDocuments({ status: 'draft' });
        const archivedBlogs = await Blog.countDocuments({ status: 'archived' });
        const featuredBlogs = await Blog.countDocuments({ isFeatured: true });

        // Get total views and likes
        const stats = await Blog.aggregate([
            {
                $group: {
                    _id: null,
                    totalViews: { $sum: '$views' },
                    totalLikes: { $sum: { $size: '$likes' } },
                    totalComments: { $sum: { $size: '$comments' } }
                }
            }
        ]);

        res.json({
            success: true,
            data: {
                total: totalBlogs,
                published: publishedBlogs,
                drafts: draftBlogs,
                archived: archivedBlogs,
                featured: featuredBlogs,
                totalViews: stats[0]?.totalViews || 0,
                totalLikes: stats[0]?.totalLikes || 0,
                totalComments: stats[0]?.totalComments || 0
            }
        });
    } catch (error) {
        console.error('Get blog stats error:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Server Error' 
        });
    }
};

// Admin: Get blog by ID
exports.getBlogById = async (req, res) => {
    try {
        const { id } = req.params;

        const blog = await Blog.findById(id)
            .populate('author', 'username email')
            .populate('comments.patient', 'firstName lastName email');

        if (!blog) {
            return res.status(404).json({
                success: false,
                error: 'Blog not found'
            });
        }

        res.json({
            success: true,
            data: blog
        });
    } catch (error) {
        console.error('Get blog by ID error:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Server Error' 
        });
    }
};

// Admin: Create blog
exports.createBlog = async (req, res) => {
    try {
        const {
            title,
            excerpt,
            content,
            featuredImage,
            categories,
            tags,
            status,
            isFeatured,
            metaTitle,
            metaDescription,
            language
        } = req.body;

        // Validate required fields
        if (!title || !excerpt || !content) {
            return res.status(400).json({
                success: false,
                error: 'Title, excerpt, and content are required'
            });
        }

        const blog = new Blog({
            title,
            excerpt,
            content,
            featuredImage: featuredImage || '',
            categories: categories || [],
            tags: tags || [],
            status: status || 'draft',
            isFeatured: isFeatured || false,
            metaTitle: metaTitle || title,
            metaDescription: metaDescription || excerpt.substring(0, 160),
            language: language || 'EN',
            author: req.admin.id // Set the current admin as author
        });

        const savedBlog = await blog.save();
        await savedBlog.populate('author', 'username email');

        res.status(201).json({
            success: true,
            message: 'Blog created successfully',
            data: savedBlog
        });
    } catch (error) {
        console.error('Create blog error:', error);
        
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(el => el.message);
            return res.status(400).json({
                success: false,
                error: errors.join(', ')
            });
        }
        
        res.status(500).json({ 
            success: false, 
            error: 'Server Error' 
        });
    }
};

// Admin: Update blog
exports.updateBlog = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const blog = await Blog.findByIdAndUpdate(
            id,
            updateData,
            { 
                new: true, 
                runValidators: true 
            }
        )
        .populate('author', 'username email')
        .populate('comments.patient', 'firstName lastName email');

        if (!blog) {
            return res.status(404).json({
                success: false,
                error: 'Blog not found'
            });
        }

        res.json({
            success: true,
            message: 'Blog updated successfully',
            data: blog
        });
    } catch (error) {
        console.error('Update blog error:', error);
        
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(el => el.message);
            return res.status(400).json({
                success: false,
                error: errors.join(', ')
            });
        }
        
        res.status(500).json({ 
            success: false, 
            error: 'Server Error' 
        });
    }
};

// Admin: Delete blog
exports.deleteBlog = async (req, res) => {
    try {
        const { id } = req.params;

        const blog = await Blog.findByIdAndDelete(id);

        if (!blog) {
            return res.status(404).json({
                success: false,
                error: 'Blog not found'
            });
        }

        res.json({
            success: true,
            message: 'Blog deleted successfully'
        });
    } catch (error) {
        console.error('Delete blog error:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Server Error' 
        });
    }
};

// Admin: Approve blog comment
exports.approveBlogComment = async (req, res) => {
    try {
        const { blogId, commentId } = req.params;

        const blog = await Blog.findById(blogId);

        if (!blog) {
            return res.status(404).json({
                success: false,
                error: 'Blog not found'
            });
        }

        const comment = blog.comments.id(commentId);
        if (!comment) {
            return res.status(404).json({
                success: false,
                error: 'Comment not found'
            });
        }

        comment.isApproved = true;
        await blog.save();

        res.json({
            success: true,
            message: 'Comment approved successfully',
            data: comment
        });
    } catch (error) {
        console.error('Approve comment error:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Server Error' 
        });
    }
};

// Admin: Delete blog comment
exports.deleteBlogComment = async (req, res) => {
    try {
        const { blogId, commentId } = req.params;

        const blog = await Blog.findById(blogId);

        if (!blog) {
            return res.status(404).json({
                success: false,
                error: 'Blog not found'
            });
        }

        blog.comments = blog.comments.filter(
            comment => comment._id.toString() !== commentId
        );

        await blog.save();

        res.json({
            success: true,
            message: 'Comment deleted successfully'
        });
    } catch (error) {
        console.error('Delete comment error:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Server Error' 
        });
    }
};