const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    // Get all collection names
    const collections = await mongoose.connection.db.listCollections().toArray();
    
    res.json(collections.map(col => col.name));
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ 
      error: 'Failed to fetch collections',
      details: err.message 
    });
  }
  // No need to manually close connection with Mongoose
});

module.exports = router;