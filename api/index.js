const express = require('express');
const path = require('path');

const app = express();

// Serve static files from dist/public
const publicDir = path.join(__dirname, '..', 'dist', 'public');
console.log('[v0] Serving static files from:', publicDir);

app.use(express.static(publicDir));

// Handle client-side routing - serve index.html for all non-file routes
app.get('*', (req, res) => {
  console.log('[v0] Route requested:', req.path);
  res.sendFile(path.join(publicDir, 'index.html'));
});

module.exports = app;
