const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
const app = express();
app.use(cors());
app.use(express.json());
mongoose.connect(process.env.URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.get('/', (req, res) => {
    res.send('Server is running!');
});
const authRoutes = require('./routes/authRoutes');
const transact = require('./routes/transactionRoutes');
app.use('/api/auth', authRoutes);
app.use('/api/transact', transact);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});    