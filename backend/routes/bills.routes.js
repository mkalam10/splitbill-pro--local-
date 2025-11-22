
const express = require('express');
const { getBills, createBill, updateBill } = require('../controllers/bills.controller');
const { protect } = require('../middleware/auth.middleware');
const router = express.Router();

router.use(protect);

router.route('/')
    .get(getBills)
    .post(createBill);

router.route('/:id')
    .put(updateBill);

module.exports = router;
