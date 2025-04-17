# AuraAi Chatbot

A beautiful space-themed AI chatbot that integrates with multiple AI models (X1, X2, X3) with a stunning user interface.

## Features

- Space-themed dark UI with glowing effects
- Mobile-friendly responsive design
- Multiple AI model selection (X1, X2, X3)
- Chat history with persistent storage
- Code highlighting for code blocks
- Beautiful animations and transitions

## Deployment on Render

This application is configured for easy deployment on Render.

### One-Click Deployment

1. Push this repository to GitHub, GitLab, or Bitbucket
2. Log in to [Render](https://render.com)
3. Click "New +" and select "Web Service"
4. Connect your repository
5. Render will automatically detect the configuration in `render.yaml`

### Manual Deployment

If you prefer to configure manually:

1. Create a new Web Service in Render
2. Connect to your repository
3. Use the following settings:
   - **Environment**: Node
   - **Build Command**: `npm run build`
   - **Start Command**: `node dist/server/production.js`
   - **Auto Deploy**: Yes (if desired)
   
4. Add the environment variables:
   - `NODE_ENV`: `production`
   - `PORT`: `10000` (or let Render set this automatically)

## Development

To run the application locally:

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

## Building for Production

```bash
# Build the application
npm run build

# Start the production server
NODE_ENV=production node dist/server/production.js
```