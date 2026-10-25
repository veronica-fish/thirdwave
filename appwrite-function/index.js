const { Client, Users } = require('node-appwrite');

module.exports = async function (req, res) {
    const client = new Client();
    client
        .setEndpoint(process.env.APPWRITE_FUNCTION_ENDPOINT)
        .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
        .setKey(process.env.APPWRITE_API_KEY);

    const users = new Users(client);

    try {
        // PERBAIKAN: Menggunakan req.bodyJson, bukan JSON.parse(req.payload)
        // Fallback ke {} jika body kosong agar tidak error
        const payload = req.bodyJson || {};
        
        // Validasi sederhana untuk memastikan data ada
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
        
        // Mengembalikan respons sukses
        res.json({ success: true, message: 'User created successfully', userId: newUser.$id });
        
    } catch (error) {
        // Mengembalikan respons error jika gagal
        res.json({ success: false, error: error.message });
    }
};
