// app.js

const express = require('express');
const app = express();
const routes = require('./routes/questions');
const cors = require('cors');

app.use(cors({
  origin: 'http://localhost:3000'
}));

app.use(express.json());
app.use('/api', routes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
