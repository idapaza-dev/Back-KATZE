const mongoose = require('mongoose');

async function connectDB(mongoUri) {
  if (!mongoUri) {
    console.error('MONGO_URI no definido. Revisa tu .env');
    process.exit(1);
  }
  try {
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('MongoDB conectado');
  } catch (err) {
    console.error('Error conectando a MongoDB:', err.message);
    process.exit(1);
  }
}

module.exports = { connectDB };