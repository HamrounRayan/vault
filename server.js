const uri = "mongodb+srv://orhamroun:OY9XqQRBkleb1N4J@cluster0.nx9c1j2.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();
app.use(cors());
app.use(express.json());
mongoose.connect(uri)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.get('/', (req, res) => {
    res.send('Server is running!');
});
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});    
