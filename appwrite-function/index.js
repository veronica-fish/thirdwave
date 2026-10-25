const { Client, Users } = require('node-appwrite');

module.exports = async function (req, res) {
    const client = new Client();
    client
        .setEndpoint(process.env.APPWRITE_FUNCTION_ENDPOINT)
        .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
        .setKey(process.env.APPWRITE_API_KEY);

    const users = new Users(client);

    try {
        // 1. Tampilkan data yang masuk ke log (untuk memastikan data tidak kosong)
        console.log("Data masuk:", req.bodyJson);
        console.log("Data string:", req.body);

        // 2. Ambil data (mendukung format objek maupun string)
        let data = req.bodyJson;
        if (!data && req.body) {
            data = JSON.parse(req.body);
        }

        if (!data || !data.email) {
            return res.json({ success: false, error: 'Data email tidak diterima oleh server.' });
        }

        // 3. Buat User
        const newUser = await users.create(
            'unique()', 
            data.email, 
            undefined, 
            data.password, 
            data.name
        );
        
        res.json({ success: true, message: 'User created', userId: newUser.$id });
        
    } catch (error) {
        console.error("Error Detail:", error);
        res.json({ success: false, error: error.message });
    }
};
