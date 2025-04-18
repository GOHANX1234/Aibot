import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import { Server } from 'http';
import { registerRoutes } from './routes';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  
  // Register API routes
  await registerRoutes(app);

  // Serve static files from the frontend build directory with caching
  app.use(express.static(path.join(__dirname, '../public'), {
    etag: true,
    lastModified: true,
    setHeaders: (res, path) => {
      // Set cache control for different file types
      if (path.endsWith('.html')) {
        // HTML files - no cache
        res.setHeader('Cache-Control', 'no-cache');
      } else if (path.match(/\.(js|css|svg|png|jpg|jpeg|gif|ico)$/)) {
        // Static assets - cache for 1 week
        res.setHeader('Cache-Control', 'public, max-age=604800');
      }
    }
  }));
  
  // For any other request, send the index.html
  app.get('*', (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
  });

  // Error handling middleware
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    console.error('Server error:', err);
    res.status(500).json({ 
      error: 'Internal Server Error',
      message: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  });

  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 5000;
  const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
  });
  
  return server;
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});