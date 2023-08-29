// Import the required modules
const express = require('express');
const { getTokenAndRedirect, verifyToken } = require('./controller');

// Load environment variables from .env file
require('dotenv').config({ path: `${__dirname}/.env` });

// Check if PORT environment variable is set
if (!process.env.PORT) {
    throw new Error('.env file not found or corrupted');
}

// Create an Express app
const app = express();

// Define routes and corresponding controller functions
app.get('/sso/verify/:token', verifyToken);
app.get('/sso', getTokenAndRedirect);

// Start the server on the specified port
app.listen(process.env.PORT, () => {
    console.log(`Example app listening on port ${process.env.PORT}`);
});
