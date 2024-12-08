const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// Serve static files from the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// Serve JSON data from the 'public/data' folder
app.get('/data', (req, res) => {
    const data = require('./public/data/data.json');
    res.json(data);
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});