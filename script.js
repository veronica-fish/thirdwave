document.addEventListener("DOMContentLoaded", function() {
    
    // ==========================================
    // 0. CUSTOM ALERT SYSTEM (PENGGANTI ALERT BAWAAN)
    // ==========================================
    window.showAlert = function(message, type = 'error') {
        if (!document.getElementById('custom-alert-overlay')) {
            const alertHTML = `
                <div id="custom-alert-overlay">
                    <div class="custom-alert-box">
                        <div class="alert-icon" id="alertIcon">
                            <i class="fa-solid fa-circle-exclamation"></i>
                        </div>
                        <div class="alert-title" id="alertTitle">Peringatan</div>
                        <div class="alert-message" id="alertMessage"></div>
                        <div class="alert-actions">
                            <button class="btn-alert-ok" id="alertOkBtn">Mengerti</button>
                        </div>
                    </div>
                </div>
            `;
            document.body.insertAdjacentHTML('beforeend', alertHTML);
            
            document.getElementById('alertOkBtn').addEventListener('click', function() {
                document.getElementById('custom-alert-overlay').classList.remove('show');
            });
        }
        
        const overlay = document.getElementById('custom-alert-overlay');
        const icon = document.getElementById('alertIcon');
        const title = document.getElementById('alertTitle');
        const msg = document.getElementById('alertMessage');
        
        msg.textContent = message;
        
        if (type === 'success') {
            icon.className = 'alert-icon success';
            icon.innerHTML = '<i class="fa-solid fa-check"></i>';
            title.textContent = 'Berhasil';
        } else if (type === 'info') {
            icon.className = 'alert-icon success';
            icon.innerHTML = '<i class="fa-solid fa-circle-info"></i>';
            title.textContent = 'Informasi';
        } else {
            icon.className = 'alert-icon';
            icon.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i>';
            title.textContent = 'Peringatan';
        }
        
        overlay.classList.add('show');
    };
    
    // Timpa alert bawaan browser
    window.alert = function(message) {
        window.showAlert(message, 'error');
    };
    
    // ==========================================
    // 1. EFEK LOADING (JEDA 2 DETIK)
    // ==========================================
    const loadingOverlay = document.createElement('div');
    loadingOverlay.id = 'loading-overlay';
    loadingOverlay.innerHTML = `
        <div class="spinner"></div>
        <div class="loading-text">Memuat halaman...</div>
    `;
    document.body.appendChild(loadingOverlay);
    
    setTimeout(() => {
        loadingOverlay.classList.add('hidden');
        setTimeout(() => loadingOverlay.remove(), 500);
    }, 2000);
    
    // ==========================================
    // 2. KONFIGURASI APPWRITE & DEKLARASI ELEMEN
    // ==========================================
    const client = new Appwrite.Client();
    client
        .setEndpoint('https://fra.cloud.appwrite.io/v1')
        .setProject('6adce24f00120ccc01ce');
    const account = new Appwrite.Account(client);
    
    const headerUsername = document.getElementById('headerUsername');
    const headerEmail = document.getElementById('headerEmail');
    const userAvatar = document.getElementById('userAvatar');
    const welcomeText = document.querySelector('.page-title p strong');
    
    // ==========================================
    // 3. CEK SESI LOGIN (PROTEKSI AKTIF)
    // ==========================================
    async function checkAuth() {
        try {
            const user = await account.get();
            const displayName = user.name || user.email.split('@')[0];
            
            if (headerUsername) headerUsername.textContent = displayName;
            if (headerEmail) headerEmail.textContent = user.email;
            if (userAvatar) userAvatar.textContent = displayName.charAt(0).toUpperCase();
            if (welcomeText) welcomeText.textContent = displayName;
            
        } catch (error) {
            console.log("Belum login, mengalihkan ke halaman login...");
            window.location.href = 'login.html';
        }
    }
    checkAuth();
    
    // ==========================================
    // 4. LOGIKA DROPDOWN PROFIL (BUKA/TUTUP)
    // ==========================================
    const profileTrigger = document.getElementById('profileTrigger');
    const profileDropdown = document.getElementById('profileDropdown');
    
    if (profileTrigger && profileDropdown) {
        profileTrigger.addEventListener('click', function(e) {
            e.stopPropagation();
            profileDropdown.classList.toggle('show');
            this.classList.toggle('active');
        });
        
        document.addEventListener('click', function(e) {
            if (!profileDropdown.contains(e.target) && !profileTrigger.contains(e.target)) {
                profileDropdown.classList.remove('show');
                profileTrigger.classList.remove('active');
            }
        });
    }
    
    // ==========================================
    // 5. LOGIKA LOGOUT (SIGN OUT)
    // ==========================================
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async function(e) {
            e.preventDefault();
            // Menggunakan confirm bawaan untuk logout (bisa juga diganti custom)
            if (confirm('Apakah Anda yakin ingin keluar?')) {
                try {
                    await account.deleteSession('current');
                    window.location.href = 'login.html';
                } catch (error) {
                    window.location.href = 'login.html';
                }
            }
        });
    }
    
    // ==========================================
    // 6. LOGIKA TAB SETTINGS (BERDASARKAN URL)
    // ==========================================
    const tabs = document.querySelectorAll('.settings-tab');
    const tabContents = document.querySelectorAll('.tab-content');
    
    if (tabs.length > 0) {
        const urlParams = new URLSearchParams(window.location.search);
        const tabParam = urlParams.get('tab');
        
        if (tabParam === 'security') {
            document.querySelector('[data-target="security-tab"]').click();
        } else {
            document.querySelector('[data-target="profile-tab"]').click();
        }
        
        tabs.forEach(tab => {
            tab.addEventListener('click', function(e) {
                e.preventDefault();
                tabs.forEach(t => t.classList.remove('active'));
                tabContents.forEach(c => c.classList.remove('active'));
                this.classList.add('active');
                const targetId = this.getAttribute('data-target');
                if (document.getElementById(targetId)) {
                    document.getElementById(targetId).classList.add('active');
                }
            });
        });
    }
    
    // ==========================================
    // 7. LOGIKA MENU MOBILE & SIDEBAR
    // ==========================================
    setTimeout(() => {
        const menuToggle = document.getElementById('menuToggle');
        const sidebar = document.getElementById('sidebar');
        const closeMenu = document.getElementById('closeMenu');
        const sidebarOverlay = document.getElementById('sidebarOverlay');
        
        if (menuToggle && sidebar && closeMenu && sidebarOverlay) {
            menuToggle.addEventListener('click', function() {
                sidebar.classList.add('active');
                sidebarOverlay.classList.add('active');
            });
            
            closeMenu.addEventListener('click', function() {
                sidebar.classList.remove('active');
                sidebarOverlay.classList.remove('active');
            });
            
            sidebarOverlay.addEventListener('click', function() {
                sidebar.classList.remove('active');
                sidebarOverlay.classList.remove('active');
            });
        }
        
        const path = window.location.pathname;
        let page = path.split("/").pop().split(".")[0];
        if (page === '' || page === 'index') page = 'index';
        
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('data-page') === page) {
                item.classList.add('active');
            }
        });
    }, 100);
});