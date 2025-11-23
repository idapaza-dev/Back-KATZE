const express = require('express');
const router = express.Router();

const authRouter = require('./auth');
const catsRouter = require('./cats');
const adoptionsRouter = require('./adoptions');
const uploadsRouter = require('./uploads');

router.use('/auth', authRouter);
router.use('/cats', catsRouter);
router.use('/adoptions', adoptionsRouter);
router.use('/uploads', uploadsRouter);

router.get('/', (req, res) => res.json({ api: 'KATZE API', version: 'v1' }));

module.exports = router;