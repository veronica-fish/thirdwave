const { Client, Users } = require('node-appwrite');

module.exports = async function (req, res) {
    const client = new Client();
    client
        .setEndpoint(process.env.APPWRITE_FUNCTION_ENDPOINT)
        .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
        .setKey(process.env.APPWRITE_API_KEY);

    const users = new Users(client);

    try {
        // Karena data dikirim sebagai string dari frontend, kita perlu parse
        const payload = JSON.parse(req.body);
        
        if (!payload || !payload.email || !payload.password || !payload.name) {
            return res.json({ success: false, error: 'Data tidak lengkap.' });
        }

        const newUser = await users.create(
            'unique()', 
            payload.email, 
            undefined, 
            payload.password, 
            payload.name
        );
        
        res.json({ success: true, message: 'User created', userId: newUser.$id });
        
    } catch (error) {
        res.json({ success: false, error: error.message });
    }
};
