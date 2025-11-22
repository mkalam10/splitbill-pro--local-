const User = require('../models/user.model');
const jwt = require('jsonwebtoken');

// Generate JWT
const getSignedJwtToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// @desc    Register user
// @route   POST /api/auth/register
exports.register = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Check if user already exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ success: false, message: 'An account with this email already exists.' });
        }
        
        if (password.length < 6) {
            return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long.' });
        }

        // Create user
        user = await User.create({ name, email, password });

        const token = getSignedJwtToken(user._id);
        const userResponse = user.toJSON();

        res.status(201).json({ success: true, token, user: userResponse });

    } catch (err) {
        console.error("Auth Controller Error:", err); // Log the actual error
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Login user
// @route   POST /api/auth/login
exports.login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Please provide an email and password' });
    }

    try {
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid email or password.' });
        }

        const isMatch = await user.matchPassword(password);

        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid email or password.' });
        }
        
        const token = getSignedJwtToken(user._id);
        const userResponse = user.toJSON();

        res.status(200).json({ success: true, token, user: userResponse });
    } catch (err) {
        console.error("Auth Controller Error:", err); // Log the actual error
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};