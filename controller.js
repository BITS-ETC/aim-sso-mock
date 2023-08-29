const crypto = require('crypto');

// List of fake usernames for demonstration
const fakeUsernames = [
    'johnston_k',
    'hudson_b',
    'baumbach_c',
    'mann_t',
    'jaskolski_c',
    'orn_r',
    'barton_j',
    'kuphal_r',
    'berge_c',
    'kassulke_c',
];

module.exports = {
    /**
     * Handle the /sso route to get a token and redirect
     * @param {e.Request} req - Express request object
     * @param {e.Response} res - Express response object
     * @return {any}
     */
    getTokenAndRedirect(req, res) {
        const redirect_uri = req.query.redirect_uri;
        const user = req.query.user;

        // Check if required query parameters are provided
        if (!redirect_uri || !user) {
            return res.status(422).send('redirect_uri and user required. Allowed users: ' + fakeUsernames.join(', '));
        }

        // Generate an MD5 hash of the user
        const hash = crypto.createHash('md5').update(user).digest('hex');

        // Redirect to the specified URL with the token
        return res.redirect(redirect_uri + '?t=' + hash);
    },

    /**
     * Verify the provided token
     * @param {e.Request} req - Express request object
     * @param {e.Response} res - Express response object
     * @return {any}
     */
    verifyToken(req, res) {
        const token = req.params.token;

        // Check if token is provided
        if (!token) {
            return res.status(422).send('Token required');
        }

        // Find the corresponding user for the given token
        const user = fakeUsernames.find((item) => {
            const hash = crypto.createHash('md5').update(item).digest('hex');

            return hash === token;
        });

        // Respond with user if found, otherwise return an error response
        if (user) {
            return res.send(user);
        } else {
            return res.status(503).send('Token verification failed');
        }
    },
};
