const express = require('express');
const User = require('../models/User');
const router = express.Router();

// Add score
router.post('/add', async (req, res) => {
    const { userId, score } = req.body;
    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        user.scores.push({ score });
        await user.save();
        res.status(201).json({ message: 'Score added successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Get leaderboard
router.get('/leaderboard', async (req, res) => {
    try {
        const users = await User.find().sort({ 'scores.score': -1 }).limit(10);
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
