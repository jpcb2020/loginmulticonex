const express = require('express');
const path = require('path');

const app = express();
const port = 3236;

// Serve static files from the 'public' directory (or root if not using a dedicated public folder)
// For this project, assets are in the root and in 'img'
app.use(express.static(path.join(__dirname))); // Serves files like script.js, styles.css from root
app.use('/img', express.static(path.join(__dirname, 'img'))); // Serves images from /img

// Route to serve index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
