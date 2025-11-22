
const Bill = require('../models/bill.model');

// @desc    Get all bills for logged in user
// @route   GET /api/bills
exports.getBills = async (req, res) => {
    try {
        const bills = await Bill.find({ user: req.user.id }).sort({ date: -1 });
        res.status(200).json({ success: true, data: bills });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Create new bill
// @route   POST /api/bills
exports.createBill = async (req, res) => {
    try {
        req.body.user = req.user.id;
        const bill = await Bill.create(req.body);
        res.status(201).json({ success: true, data: bill });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// @desc    Update bill
// @route   PUT /api/bills/:id
exports.updateBill = async (req, res) => {
    try {
        let bill = await Bill.findById(req.params.id);

        if (!bill) {
            return res.status(404).json({ success: false, message: 'Bill not found' });
        }

        // Make sure user is bill owner
        if (bill.user.toString() !== req.user.id) {
            return res.status(401).json({ success: false, message: 'Not authorized to update this bill' });
        }

        bill = await Bill.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({ success: true, data: bill });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};
