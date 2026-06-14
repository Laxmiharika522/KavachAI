require('dotenv').config();
const express = require('express');
const cors = require('cors');

const analyzeRoutes = require('./routes/analyzeRoutes');
const scanRoutes = require('./routes/scanRoutes');

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api', analyzeRoutes);
app.use('/api', scanRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Hackathon Backend running' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
