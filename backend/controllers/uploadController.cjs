// backend/controllers/uploadController.cjs
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const url_prefix = require("../data/variable").default;



// Configure storage with correct path
const storage = multer.diskStorage({
    destination: function (req, res, cb) {
        // Save to src/backend/uploads/[folder]
        const uploadPath = path.join(__dirname, '../uploads', req.params.folder || 'general');

        console.log('Upload path:', uploadPath); // Debug log

        // Create directory if it doesn't exist
        if (!fs.existsSync(uploadPath)) {
            console.log('Creating directory:', uploadPath);
            fs.mkdirSync(uploadPath, { recursive: true });
        }

        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        // Generate unique filename
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const extension = path.extname(file.originalname);
        cb(null, (req.params.folder || 'general') + '-' + uniqueSuffix + extension);
    }
});


// File filter
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed!'), false);
    }
};

// Initialize upload
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    },
    fileFilter: fileFilter
});

// Upload middleware
const uploadImage = (req, res, next) => {
    const uploadSingle = upload.single('image');

    uploadSingle(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            return res.status(400).json({
                success: false,
                error: err.message
            });
        } else if (err) {
            return res.status(400).json({
                success: false,
                error: err.message
            });
        }

        next();
    });
};

// Handle upload
// In your uploadController.cjs - update the handleUpload function
// In your uploadController.cjs - Fix the response handling
const handleUpload = (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                error: 'No file uploaded'
            });
        }



        // Generate the URL path
        const filePath = `/uploads/${req.params.folder || 'general'}/${req.file.filename}`;
        const fullUrl = `${url_prefix}${filePath}`;

        console.log('=== UPLOAD SUCCESS ===');
        console.log('File saved to:', req.file.path);
        console.log('File accessible at:', fullUrl);

        res.json({
            success: true,
            message: 'Image uploaded successfully',
            imageUrl: fullUrl,
            imagePath: filePath,
            fileName: req.file.filename,
            originalName: req.file.originalname, // Fixed: use req.file
            size: req.file.size, // Fixed: use req.file
            mimetype: req.file.mimetype // Fixed: use req.file
        });

    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error during upload'
        });
    }
};
// Delete image
const deleteImage = (req, res) => {
    const { folder, filename } = req.params;
    const filePath = path.join(__dirname, '../uploads', folder || 'general', filename);

    console.log('Delete path:', filePath); // Debug log

    // Check if file exists
    if (!fs.existsSync(filePath)) {
        return res.status(404).json({
            success: false,
            error: 'File not found'
        });
    }

    // Delete file
    fs.unlink(filePath, (err) => {
        if (err) {
            return res.status(500).json({
                success: false,
                error: 'Failed to delete file'
            });
        }

        res.json({
            success: true,
            message: 'Image deleted successfully'
        });
    });
};

module.exports = {
    uploadImage,
    handleUpload,
    deleteImage
};