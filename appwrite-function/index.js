const { Client, Users } = require('node-appwrite');

module.exports = async function (req, res) {
    const client = new Client();
    client
        .setEndpoint(process.env.APPWRITE_FUNCTION_ENDPOINT)
        .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
        .setKey(process.env.APPWRITE_API_KEY);

    const users = new Users(client);

    try {
        let payload;

        // 1. Coba baca dari req.bodyJson (cara Appwrite terbaru)
        if (req.bodyJson && typeof req.bodyJson === 'object') {
            payload = req.bodyJson;
        } 
        // 2. Jika gagal, coba baca dari req.body (jika dikirim sebagai string)
        else if (req.body && typeof req.body === 'string') {
            try {
                payload = JSON.parse(req.body);
            } catch (e) {
                return res.json({ success: false, error: 'Format JSON tidak valid: ' + e.message });
            }
        } 
        // 3. Jika tidak ada data sama sekali
        else {
            return res.json({ success: false, error: 'Data tidak diterima oleh server (body kosong).' });
        }

        // Validasi data
        if (!payload.email || !payload.password || !payload.name) {
            return res.json({ success: false, error: 'Data tidak lengkap (email, password, name wajib ada).' });
        }

        // Membuat user baru
        const newUser = await users.create(
            'unique()', 
            payload.email, 
            undefined, 
            payload.password, 
            payload.name
        );
        
        res.json({ success: true, message: 'User created successfully', userId: newUser.$id });
        
    } catch (error) {
        console.error("Error Detail:", error);
        res.json({ success: false, error: error.message });
    }
};
