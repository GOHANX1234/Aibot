const path = require('path');
const express = require('express');
const { createServer } = require('node:http');

const app = express();
const server = createServer(app);

// Import routes
const setupRoutes = async () => {
  try {
    const { registerRoutes } = require('./dist/server/routes.js');
    await registerRoutes(app);
    console.log('[server] API routes registered');
  } catch (error) {
    console.error('[server] Failed to register API routes:', error);
  }
};

// Setup static file serving
app.use(express.static(path.join(__dirname, 'dist/client')));

// Always return the main index.html for any route that doesn't match an API or static file
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/client/index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('[server] Error:', err);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, '0.0.0.0', async () => {
  console.log(`[server] Server running on port ${PORT}`);
  await setupRoutes();
});