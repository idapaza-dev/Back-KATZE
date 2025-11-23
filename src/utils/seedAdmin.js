require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const { connectDB } = require('../config/db');

async function seed() {
  await connectDB(process.env.MONGO_URI);
  const email = 'admin@katze.local';
  const exists = await User.findOne({ email });
  if (exists) {
    console.log('Admin ya existe:', email);
    process.exit(0);
  }
  const user = new User({ name: 'Admin', email, password: 'Admin123!', role: 'admin' });
  await user.save();
  console.log('Admin creado:', email, 'password: Admin123!');
  process.exit(0);
}

seed().catch(err => { console.error(err); process.exit(1); });