const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config({ path: '../.env' });

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/hms', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/patients', require('./routes/patientRoutes'));
app.use('/api/doctors', require('./routes/doctorRoutes'));
app.use('/api/nurses', require('./routes/nurseRoutes'));
app.use('/api/admins', require('./routes/adminRoutes'));
app.use('/api/appointments', require('./routes/appointmentRoutes'));
app.use('/api/payments', require('./routes/paymentRoutes'));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
