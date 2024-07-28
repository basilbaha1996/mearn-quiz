const express = require('express');
const Question = require('../models/Question');
const { protect } = require('../middleware/auth');
const router = express.Router();

// Add questions
router.post('/add', protect, async (req, res) => {
    const { questions } = req.body;
    try {
        const result = await Question.insertMany(questions);
        res.status(201).json(result);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// Get all questions
router.get('/', protect, async (req, res) => {
    try {
        const questions = await Question.find().select('-__v');
        res.json(questions);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

module.exports = router;
