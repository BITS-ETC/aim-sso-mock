// Import the required modules
const express = require('express');
const { getTokenAndRedirect, verifyToken, employeeLdap } = require('./controller');

// Load environment variables from .env file
require('dotenv').config({ path: `${__dirname}/.env` });

// Check if PORT environment variable is set
if (!process.env.PORT) {
    throw new Error('.env file not found or corrupted');
}

// Create an Express app
const app = express();

app.use(require('cors')({
    origin: '*',
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
    allowedHeaders: 'Authorization,Accept,Accept-Language,Content-Language,Content-Type,Access-Control-Allow-Origin',
    exposedHeaders: 'Authorization',
    methods: 'GET,POST,HEAD,OPTIONS',
}));

// Define routes and corresponding controller functions
app.get('/sso/verify/:token', verifyToken);
app.get('/sso', getTokenAndRedirect);
app.get('/api/employeeLdap/:username', employeeLdap);

// Start the server on the specified port
app.listen(process.env.PORT, () => {
    console.log(`Example app listening on port ${process.env.PORT}`);
});
