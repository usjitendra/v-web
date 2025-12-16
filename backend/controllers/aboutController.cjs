// controllers/aboutController.cjs
const About = require('../models/About.cjs');

// @desc    Get about page content
// @route   GET /api/about
// @access  Public
exports.getAbout = async (req, res) => {
    try {
        let about = await About.find({ isActive: true });

        // If no about content exists, create default
        if (!about) {
            about = await About.create({
                title: "About Us",
                subtitle: "We're committed to making healthcare accessible, transparent, and easy to navigate",
                missionTitle: "Our Mission",
                missionDescription: "This platform was created as a learning project to replicate the experience of a modern healthcare directory and booking service.",
                image: "/aboutpage.jpg",
                highlights: [
                    { icon: "HeartPulse", text: "Simplifying healthcare decisions with clarity" },
                    { icon: "Stethoscope", text: "Intuitive tools for better patient experience" },
                    { icon: "Users", text: "Building trust through transparency" }
                ],
                whatsappNumber: "+1234567890",
                whatsappMessage: "Hello! I have a question about your healthcare services."
            });
        }

        res.json({
            success: true,
            data: about
        });
    } catch (err) {
        console.error('Get about error:', err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// @desc    Update about page content
// @route   PUT /api/about
// @access  Protected (Admin)
exports.updateAbout = async (req, res) => {
    try {
        let about = await About.findOne({ isActive: true });

        if (!about) {
            about = new About(req.body);
        } else {
            about = await About.findByIdAndUpdate(
                about._id,
                req.body,
                { new: true, runValidators: true }
            );
        }

        const savedAbout = await about.save();

        res.json({
            success: true,
            message: 'About page updated successfully',
            data: savedAbout
        });
    } catch (err) {
        console.error('Update about error:', err);
        res.status(400).json({ success: false, error: 'Error updating about page' });
    }
};

// @desc    Create about page content
// @route   POST /api/about
// @access  Protected (Admin)
exports.createAbout = async (req, res) => {
    try {
        // Deactivate any existing about pages
        await About.updateMany({}, { isActive: false });

        const about = new About(req.body);
        const savedAbout = await about.save();

        res.status(201).json({
            success: true,
            message: 'About page created successfully',
            data: savedAbout
        });
    } catch (err) {
        console.error('Create about error:', err);
        res.status(400).json({ success: false, error: 'Error creating about page' });
    }
};