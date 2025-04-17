// Production server entry point
const express = require('express');
const path = require('path');
const http = require('http');
const fs = require('fs');

try {
  // Check if the production build exists
  if (fs.existsSync(path.join(__dirname, 'dist/server/production.js'))) {
    console.log('Loading production build...');
    // Import the production module
    require('./dist/server/production.js');
  } else {
    // Fallback to basic Express server if build files aren't found
    console.log('Production build not found, starting fallback server...');
    const app = express();
    
    // Serve static files from the dist directory
    app.use(express.static(path.join(__dirname, 'dist/public')));
    
    // For any other request, send the index.html
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist/public/index.html'));
    });
    
    // Error handling
    app.use((err, _req, res, _next) => {
      console.error('Server error:', err);
      res.status(500).send('Internal Server Error');
    });
    
    const PORT = process.env.PORT || 10000;
    const server = http.createServer(app);
    
    server.listen(PORT, () => {
      console.log(`Fallback server running on port ${PORT}`);
    });
  }
} catch (error) {
  console.error('Failed to start production server:', error);
  process.exit(1);
}