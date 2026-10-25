const { Client, Users } = require('node-appwrite');

module.exports = async function (req, res) {
    const client = new Client();
    client
        .setEndpoint(process.env.APPWRITE_FUNCTION_ENDPOINT)
        .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
        .setKey(process.env.APPWRITE_API_KEY);

    const users = new Users(client);

    try {
        const payload = JSON.parse(req.payload);
        await users.create(
            'unique()',
            payload.email,
            undefined,
            payload.password,
            payload.name
        );
        res.json({ success: true, message: 'User created' });
    } catch (error) {
        res.json({ success: false, error: error.message });
    }
};
