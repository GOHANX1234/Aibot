// Production server entry point
try {
  // Import the production module
  require('./dist/server/production.js');
} catch (error) {
  console.error('Failed to start production server:', error);
  process.exit(1);
}