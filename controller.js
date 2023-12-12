const crypto = require('crypto');

// List of fake usernames for demonstration
const fakeUsers = [
    {
        samaccountname: 'johnston_k',
        ldap_groups: ['admins'],
        ldap_info: {
            "name": "Егоров Евгений",
            "position": "dev",
            "samaccountname": "johnston_k",
            "department": "admins",
        }
    },
    {
        samaccountname: 'hudson_b',
        ldap_groups: ['team_1'],
        ldap_info: {
            "name": "Белов Борис",
            "position": "ba",
            "samaccountname": "hudson_b",
            "department": "team_1",
        }
    },
    {
        samaccountname: 'baumbach_c',
        ldap_groups: ['team_2'],
        ldap_info: {
            "name": "Александров Александр",
            "position": "designer",
            "samaccountname": "baumbach_c",
            "department": "team_2",
        }
    },
    {
        samaccountname: 'mann_t',
        ldap_groups: ['team_3'],
        ldap_info: {
            "name": "Тимофеев Тимур",
            "position": "dev",
            "samaccountname": "mann_t",
            "department": "team_3",
        }
    },
    {
        samaccountname: 'jaskolski_c',
        ldap_groups: ['team_1'],
        ldap_info: {
            "name": "Чернов Чеслав",
            "position": "dev",
            "samaccountname": "jaskolski_c",
            "department": "team_1",
        }
    },
    {
        samaccountname: 'orn_r',
        ldap_groups: ['team_2'],
        ldap_info: {
            "name": "Романов Роман",
            "position": "qa",
            "samaccountname": "orn_r",
            "department": "team_2",
        }
    },
    {
        samaccountname: 'barton_j',
        ldap_groups: ['team_3'],
        ldap_info: {
            "name": "Дмитриев Дмитрий",
            "position": "manager",
            "samaccountname": "barton_j",
            "department": "team_3",
        }
    },
    {
        samaccountname: 'kuphal_r',
        ldap_groups: ['team_1'],
        ldap_info: {
            "name": "Русланов Руслан",
            "position": "ba",
            "samaccountname": "kuphal_r",
            "department": "team_1",
        }
    },
    {
        samaccountname: 'berge_c',
        ldap_groups: ['team_2'],
        ldap_info: {
            "name": "Степанов Степан",
            "position": "dev",
            "samaccountname": "berge_c",
            "department": "team_2",
        }
    },
    {
        samaccountname: 'kassulke_c',
        ldap_groups: ['team_3'],
        ldap_info: {
            "name": "Константинов Константин",
            "position": "dev",
            "samaccountname": "kassulke_c",
            "department": "team_3",
        }
    },
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
            const fakeUsernames = fakeUsers.map((item) => item.samaccountname);

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
        const user = fakeUsers.find((item) => {
            const hash = crypto.createHash('md5').update(item.samaccountname).digest('hex');

            return hash === token;
        });

        // Respond with user if found, otherwise return an error response
        if (user) {
            return res.send(user);
        } else {
            return res.status(503).send('Token verification failed');
        }
    },

    employeeLdap(req, res) {
        const username = req.params.username;

        // Check if username is provided
        if (!username) {
            return res.status(422).send('Username required');
        }

        const user = fakeUsers.find((item) => item.samaccountname === username);

        // Respond with user if found, otherwise return an error response
        if (user) {
            return res.send(user.ldap_info);
        } else {
            return res.status(503).send('User not found');
        }
    }
};
