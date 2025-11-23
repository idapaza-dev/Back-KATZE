const express = require('express');
const router = express.Router();
const Cat = require('../models/Cat');
const { authenticate, authorize } = require('../middlewares/auth');

// GET /api/v1/cats
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 20, 100);
    const q = req.query.q;
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (q) filter.$or = [
      { name: new RegExp(q, 'i') },
      { description: new RegExp(q, 'i') },
      { breed: new RegExp(q, 'i') }
    ];
    const total = await Cat.countDocuments(filter);
    const cats = await Cat.find(filter)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });
    res.json({ data: cats, meta: { page, limit, total } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/v1/cats/:id
router.get('/:id', async (req, res) => {
  try {
    const cat = await Cat.findById(req.params.id);
    if (!cat) return res.status(404).json({ message: 'No encontrado' });
    res.json(cat);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/v1/cats (admin)
router.post('/', authenticate, authorize('admin'), async (req, res) => {
  try {
    const c = new Cat(req.body);
    await c.save();
    res.status(201).json(c);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/v1/cats/:id (admin)
router.put('/:id', authenticate, authorize('admin'), async (req, res) => {
  try {
    const updated = await Cat.findByIdAndUpdate(req.params.id, { ...req.body }, { new: true });
    if (!updated) return res.status(404).json({ message: 'No encontrado' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/v1/cats/:id (admin)
router.delete('/:id', authenticate, authorize('admin'), async (req, res) => {
  try {
    const deleted = await Cat.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'No encontrado' });
    res.json({ message: 'Eliminado' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;