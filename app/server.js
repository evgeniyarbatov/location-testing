const express = require('express');
const path = require('path');
const app = express();

const port = 80;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/location', (req, res) => {
  const { latitude, longitude } = req.query;
  res.send(`${latitude} ${longitude}`);
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
