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
  
  // Create an emergency server to display the error
  try {
    const emergencyApp = express();
    emergencyApp.get('*', (_req, res) => {
      res.status(500).send(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>AuraAi - Service Error</title>
            <style>
              body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif;
                background: #0F1729;
                color: white;
                display: flex;
                align-items: center;
                justify-content: center;
                height: 100vh;
                margin: 0;
                padding: 20px;
              }
              .error-container {
                max-width: 500px;
                text-align: center;
                padding: 30px;
                border-radius: 8px;
                background: rgba(255, 255, 255, 0.05);
                backdrop-filter: blur(10px);
                border: 1px solid rgba(255, 255, 255, 0.1);
              }
              h1 {
                color: #EC4899;
                margin-bottom: 20px;
              }
              p {
                line-height: 1.6;
                margin-bottom: 20px;
              }
              .glowing {
                text-shadow: 0 0 10px #EC4899, 0 0 20px #EC4899, 0 0 30px #EC4899;
              }
            </style>
          </head>
          <body>
            <div class="error-container">
              <h1 class="glowing">AuraAi Service Error</h1>
              <p>We're currently experiencing technical difficulties. Our team has been notified and is working to resolve the issue.</p>
              <p>Please try again later.</p>
            </div>
          </body>
        </html>
      `);
    });
    
    const PORT = process.env.PORT || 10000;
    emergencyApp.listen(PORT, () => {
      console.log(`Emergency server running on port ${PORT}`);
    });
  } catch (emergencyError) {
    console.error('Even emergency server failed:', emergencyError);
    process.exit(1);
  }
}