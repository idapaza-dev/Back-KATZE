const express = require('express');
const router = express.Router();
const Adoption = require('../models/Adoption');
const { authenticate, authorize } = require('../middlewares/auth');

// POST /api/v1/adoptions (public)
router.post('/', async (req, res) => {
  try {
    const ad = new Adoption(req.body);
    await ad.save();
    res.status(201).json(ad);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/v1/adoptions (admin)
router.get('/', authenticate, authorize('admin'), async (req, res) => {
  try {
    const items = await Adoption.find().populate('catId').sort({ createdAt: -1 });
    res.json({ data: items });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/v1/adoptions/:id/status (admin)
router.put('/:id/status', authenticate, authorize('admin'), async (req, res) => {
  try {
    const { status, note } = req.body;
    const adoption = await Adoption.findById(req.params.id);
    if (!adoption) return res.status(404).json({ message: 'No encontrado' });
    adoption.history = adoption.history || [];
    adoption.history.push({ status, note, at: new Date(), by: req.user.email });
    adoption.status = status;
    await adoption.save();
    res.json(adoption);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;