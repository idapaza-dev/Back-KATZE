const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const { connectDB } = require('./config/db');
const apiRouter = require('./routes');

const app = express();

const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';
const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true); // allow server-to-server or curl
    if (origin === CLIENT_URL) return callback(null, true);
    callback(new Error('CORS no permitido por el servidor'));
  },
  credentials: false
};

app.use(helmet());
app.use(cors(corsOptions));
app.use(morgan('dev'));
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// Connect DB
connectDB(process.env.MONGO_URI);

// API routes mounted
app.use('/api/v1', apiRouter);

app.get('/', (req, res) => {
  res.send(`
    <h1>KATZE API v1</h1>
    <p>Bienvenido a la API de adopciones 🐱</p>
    <ul>
      <li><a href="/api/v1/auth">/api/v1/auth</a></li>
      <li><a href="/api/v1/cats">/api/v1/cats</a></li>
      <li><a href="/api/v1/adoptions">/api/v1/adoptions</a></li>
      <li><a href="/api/v1/uploads">/api/v1/uploads</a></li>
      <li><a href="/health">/health</a></li>
    </ul>
  `);
});


// health
app.get('/health', (req, res) => res.json({ ok: true, time: new Date() }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`http://localhost:${PORT}`));