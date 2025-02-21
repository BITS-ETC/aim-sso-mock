const crypto = require('crypto');

// List of fake usernames for demonstration
const fakeUsers = [
    {
        'id': 101,
        'name': 'Ivanov Alex',
        'position': 'Back-end Dev',
        'samaccountname': 'ivanov_a',
        'department': 'WebSolutions',
        'ldapGroups': [
            {'id': 30, 'name': 'group_websolutions', 'pivot': {'user_id': 101, 'ldap_group_id': 30}},
            {'id': 19, 'name': 'VPN', 'pivot': {'user_id': 101, 'ldap_group_id': 19}},
            {'id': 119, 'name': 'group_commonresourcepool', 'pivot': {'user_id': 101, 'ldap_group_id': 119}},
        ],
    },
    {
        'id': 102,
        'name': 'Petrov Dmitry',
        'position': 'Front-end Dev',
        'samaccountname': 'petrov_d',
        'department': 'WebSolutions',
        'ldapGroups': [
            {'id': 30, 'name': 'group_websolutions', 'pivot': {'user_id': 102, 'ldap_group_id': 30}},
            {'id': 20, 'name': 'SP_Portal-Home-Users', 'pivot': {'user_id': 102, 'ldap_group_id': 20}},
            {'id': 119, 'name': 'group_commonresourcepool', 'pivot': {'user_id': 102, 'ldap_group_id': 119}},
        ],
    },
    {
        'id': 201,
        'name': 'Sidorov Nikolay',
        'position': 'PHP Dev',
        'samaccountname': 'sidorov_n',
        'department': 'CloudTech',
        'ldapGroups': [
            {'id': 31, 'name': 'group_cloudtech', 'pivot': {'user_id': 201, 'ldap_group_id': 31}},
            {'id': 19, 'name': 'VPN', 'pivot': {'user_id': 201, 'ldap_group_id': 19}},
            {'id': 119, 'name': 'group_commonresourcepool', 'pivot': {'user_id': 201, 'ldap_group_id': 119}},
        ],
    },
    {
        'id': 202,
        'name': 'Fedorov Maxim',
        'position': 'DevOps Engineer',
        'samaccountname': 'fedorov_v',
        'department': 'CloudTech',
        'ldapGroups': [
            {'id': 31, 'name': 'group_cloudtech', 'pivot': {'user_id': 202, 'ldap_group_id': 31}},
            {'id': 49, 'name': 'Shared-02_remote-access', 'pivot': {'user_id': 202, 'ldap_group_id': 49}},
            {'id': 119, 'name': 'group_commonresourcepool', 'pivot': {'user_id': 202, 'ldap_group_id': 119}},
        ],
    },
    {
        'id': 301,
        'name': 'Kuznetsov Andrei',
        'position': 'Software Tester',
        'samaccountname': 'kuznetsov_a',
        'department': 'QAGroup',
        'ldapGroups': [
            {'id': 32, 'name': 'group_qagroup', 'pivot': {'user_id': 301, 'ldap_group_id': 32}},
            {'id': 19, 'name': 'VPN', 'pivot': {'user_id': 301, 'ldap_group_id': 19}},
            {'id': 20, 'name': 'SP_Portal-Home-Users', 'pivot': {'user_id': 301, 'ldap_group_id': 20}},
            {'id': 119, 'name': 'group_commonresourcepool', 'pivot': {'user_id': 301, 'ldap_group_id': 119}},
        ],
    },
    {
        'id': 302,
        'name': 'Adminov Admin',
        'position': 'RM',
        'samaccountname': 'adminov_a',
        'department': 'CloudTech',
        'ldapGroups': [
            {'id': 32, 'name': 'group_qagroup', 'pivot': {'user_id': 302, 'ldap_group_id': 32}},
            {'id': 19, 'name': 'VPN', 'pivot': {'user_id': 302, 'ldap_group_id': 19}},
            {'id': 119, 'name': 'group_commonresourcepool', 'pivot': {'user_id': 302, 'ldap_group_id': 119}},
            {'id': 122, 'name': 'group_resourcemanagers', 'pivot': {'user_id': 302, 'ldap_group_id': 122}},
        ],
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
            const userData = {
                samaccountname: user.samaccountname,
                ldapGroups: user.ldapGroups.map((item) => item.name)
            };

            return res.send(userData);
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
            return res.send(user);
        } else {
            return res.status(503).send('User not found');
        }
    },
};
