/* ==========================================================================
   ADMIN DASHBOARD SCRIPT & LIVE DATA MANAGEMENT
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // --------------------------------------------------
    // Default Sekar G Data Schema Template
    // --------------------------------------------------
    const defaultPortfolioData = {
        hero: {
            subtitle: "SEKAR G",
            title: "CREATIVE VIDEO EDITOR",
            tags: "Multimedia Specialist • AI Content Creator",
            description: "Results-driven creative professional with 3+ years of video editing experience and 4 years of logistics management, specializing in commercial videos, motion graphics, videography, photography, AI-assisted content creation, and digital storytelling.",
            aboutText: "I'm a multimedia creator passionate about transforming ideas into engaging visual experiences. My expertise spans video editing, motion graphics, photography, videography, and AI-powered content production. Alongside my creative background, my logistics management experience has strengthened my project coordination, leadership, and ability to deliver high-quality work under tight deadlines.",
            heroImg: "images/sekar_hero.jpg"
        },
        skills: {
            creative: ["Video Editing", "Motion Graphics", "Color Grading", "Storyboarding", "Videography", "Photography", "Commercial Ad Production", "AI Content Creation"],
            software: ["Adobe Premiere Pro", "Adobe After Effects", "Adobe Photoshop", "Adobe Illustrator", "DaVinci Resolve", "Blender (Intermediate)"],
            professional: ["Team Leadership", "Project Coordination", "Client Management", "Communication", "Problem Solving", "Time Management", "Cross-functional Collaboration"]
        },
        experience: [
            {
                title: "Freelance Video Editor",
                company: "Independent Creative Specialist",
                period: "2023 – Present",
                bullets: [
                    "Produced 100+ promotional and commercial videos for diverse client campaigns.",
                    "Created custom motion graphics and visual effects (VFX) tailored to brand identities.",
                    "Managed complete ad shoot production from pre-production planning to final delivery.",
                    "Optimized videos specifically for Instagram, YouTube, Facebook, and LinkedIn algorithms.",
                    "Integrated cutting-edge AI tools into the editing workflow to streamline turnarounds.",
                    "Significantly improved viewer engagement metrics and reduced overall production time."
                ]
            },
            {
                title: "Logistics Manager",
                company: "Essaar Transport",
                period: "2019 – 2023",
                bullets: [
                    "Managed fleet operations and transportation schedules across high-volume routes.",
                    "Led operational teams and coordinated cross-functional logistics workflows.",
                    "Improved on-time delivery performance through rigorous process optimization.",
                    "Streamlined operations to increase cost efficiency and resource utilization.",
                    "Maintained precise logistics documentation, compliance standards, and reporting."
                ]
            }
        ],
        projects: [
            {
                title: "Promotional Brand Video Campaign",
                description: "End-to-end production including concept development, videography, editing, and motion graphics to enhance brand visibility.",
                thumb: "images/cash_cow.jpg",
                videoUrl: "https://www.image2url.com/r2/default/videos/1784548788723-7c016908-e513-4f89-ad75-44e4d64e6591.mp4",
                tags: ["Videography", "Motion Graphics", "Branding"]
            },
            {
                title: "Corporate Commercial Production",
                description: "Complete commercial production workflow from storyboard to final delivery using Premiere Pro, After Effects, and DaVinci Resolve.",
                thumb: "images/reel.jpg",
                videoUrl: "https://www.image2url.com/r2/default/videos/1784549983984-1db76c15-c28a-44c3-9d0b-99824302991d.mp4",
                tags: ["Premiere Pro", "DaVinci Resolve", "Color Grading"]
            },
            {
                title: "Social Media Content Series",
                description: "Created optimized Instagram Reels and YouTube Shorts using AI-assisted production techniques for greater audience engagement.",
                thumb: "images/vlog.jpg",
                videoUrl: "https://www.image2url.com/r2/default/videos/1784550866798-55c7b65b-470b-41af-b0f1-8b17135f11e8.mp4",
                tags: ["AI Content", "Reels & Shorts", "Viral Growth"]
            }
        ],
        education: {
            edu1Title: "Bachelor of Business Administration (BBA)",
            edu1Institution: "Alagappa University",
            edu1Status: "In Progress",
            edu2Title: "Higher Secondary Education",
            edu2Institution: "Corporation Higher Secondary School, Rathinapuri, Coimbatore",
            edu2Status: "Completed",
            languages: ["Tamil (Native)", "English (Professional Working Proficiency)"]
        },
        contact: {
            phone: "7305527120",
            whatsapp: "917305527120",
            email: "sekarganesh2503@gmail.com",
            location: "Coimbatore, Tamil Nadu, India"
        }
    };

    // State Variables
    let currentPasscode = '';
    let currentData = JSON.parse(JSON.stringify(defaultPortfolioData));

    // Elements
    const authOverlay = document.getElementById('authOverlay');
    const authForm = document.getElementById('authForm');
    const adminPassword = document.getElementById('adminPassword');
    const togglePassword = document.getElementById('togglePassword');
    const authError = document.getElementById('authError');
    const adminPanel = document.getElementById('adminPanel');
    const saveAllBtn = document.getElementById('saveAllBtn');
    const lockDashboardBtn = document.getElementById('lockDashboardBtn');
    const adminAlert = document.getElementById('adminAlert');
    const alertText = document.getElementById('alertText');

    // --------------------------------------------------
    // Toggle Password Visibility
    // --------------------------------------------------
    if (togglePassword) {
        togglePassword.addEventListener('click', () => {
            const isPassword = adminPassword.type === 'password';
            adminPassword.type = isPassword ? 'text' : 'password';
            togglePassword.innerHTML = isPassword ? '<i class="fas fa-eye-slash"></i>' : '<i class="fas fa-eye"></i>';
        });
    }

    // --------------------------------------------------
    // Authentication Form Handler
    // --------------------------------------------------
    authForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const pwd = adminPassword.value.trim();

        if (!pwd) return;

        const storedEncryptedData = localStorage.getItem('sekar_portfolio_encrypted_data');

        if (storedEncryptedData) {
            // Decrypt existing encrypted payload
            const decrypted = await CryptoUtil.decryptData(storedEncryptedData, pwd);
            if (decrypted) {
                currentPasscode = pwd;
                currentData = decrypted;
                authError.style.display = 'none';
                unlockDashboard();
            } else {
                authError.style.display = 'block';
            }
        } else {
            // First time login: encrypt default portfolio data with entered passcode
            try {
                currentPasscode = pwd;
                currentData = JSON.parse(JSON.stringify(defaultPortfolioData));
                const encryptedPayload = await CryptoUtil.encryptData(currentData, pwd);
                localStorage.setItem('sekar_portfolio_encrypted_data', encryptedPayload);
                authError.style.display = 'none';
                unlockDashboard();
            } catch (err) {
                authError.textContent = "Error setting passcode encryption.";
                authError.style.display = 'block';
            }
        }
    });

    // Unlock Dashboard Panel
    function unlockDashboard() {
        authOverlay.style.display = 'none';
        adminPanel.style.display = 'flex';
        populateFormFromData();
    }

    // Lock Dashboard Panel
    if (lockDashboardBtn) {
        lockDashboardBtn.addEventListener('click', () => {
            currentPasscode = '';
            adminPassword.value = '';
            adminPanel.style.display = 'none';
            authOverlay.style.display = 'flex';
        });
    }

    // --------------------------------------------------
    // Tab Switching Logic
    // --------------------------------------------------
    const tabItems = document.querySelectorAll('.tab-item');
    const tabPanels = document.querySelectorAll('.tab-panel');

    tabItems.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetTab = tab.getAttribute('data-tab');

            tabItems.forEach(t => t.classList.remove('active'));
            tabPanels.forEach(p => p.classList.remove('active'));

            tab.classList.add('active');
            const targetPanel = document.getElementById(targetTab);
            if (targetPanel) targetPanel.classList.add('active');
        });
    });

    // --------------------------------------------------
    // Populate Form Controls with Data
    // --------------------------------------------------
    function populateFormFromData() {
        // Tab 1: Hero
        document.getElementById('inputHeroSubtitle').value = currentData.hero.subtitle || '';
        document.getElementById('inputHeroTitle').value = currentData.hero.title || '';
        document.getElementById('inputHeroTags').value = currentData.hero.tags || '';
        document.getElementById('inputHeroDescription').value = currentData.hero.description || '';
        document.getElementById('inputAboutText').value = currentData.hero.aboutText || '';
        document.getElementById('inputHeroImg').value = currentData.hero.heroImg || '';

        const heroDropContent = document.getElementById('heroDropContent');
        const heroPreviewBox = document.getElementById('heroPreviewBox');
        const heroPreviewImg = document.getElementById('heroPreviewImg');
        if (currentData.hero.heroImg && heroPreviewImg) {
            heroPreviewImg.src = currentData.hero.heroImg;
            if (heroDropContent) heroDropContent.style.display = 'none';
            if (heroPreviewBox) heroPreviewBox.style.display = 'flex';
        }

        // Tab 2: Skills
        document.getElementById('inputCreativeSkills').value = (currentData.skills.creative || []).join(', ');
        document.getElementById('inputSoftwareSkills').value = (currentData.skills.software || []).join(', ');
        document.getElementById('inputProfessionalSkills').value = (currentData.skills.professional || []).join(', ');

        // Tab 3: Experience List
        renderExperienceList();

        // Tab 4: Projects List
        renderProjectsList();

        // Tab 5: Education
        document.getElementById('inputEdu1Title').value = currentData.education.edu1Title || '';
        document.getElementById('inputEdu1Institution').value = currentData.education.edu1Institution || '';
        document.getElementById('inputEdu1Status').value = currentData.education.edu1Status || '';
        document.getElementById('inputEdu2Title').value = currentData.education.edu2Title || '';
        document.getElementById('inputEdu2Institution').value = currentData.education.edu2Institution || '';
        document.getElementById('inputEdu2Status').value = currentData.education.edu2Status || '';
        document.getElementById('inputLanguages').value = (currentData.education.languages || []).join(', ');

        // Tab 6: Contact
        document.getElementById('inputPhone').value = currentData.contact.phone || '';
        document.getElementById('inputWhatsApp').value = currentData.contact.whatsapp || '';
        document.getElementById('inputEmail').value = currentData.contact.email || '';
        document.getElementById('inputLocation').value = currentData.contact.location || '';
    }

    // --------------------------------------------------
    // Dynamic Work Experience List Manager
    // --------------------------------------------------
    const experienceList = document.getElementById('experienceList');
    const addExpBtn = document.getElementById('addExpBtn');

    function renderExperienceList() {
        if (!experienceList) return;
        experienceList.innerHTML = '';

        (currentData.experience || []).forEach((exp, idx) => {
            const card = document.createElement('div');
            card.className = 'item-card';
            card.innerHTML = `
                <div class="item-card-header">
                    <h3>Experience #${idx + 1}</h3>
                    <button type="button" class="btn-delete" data-exp-index="${idx}">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
                <div class="admin-form-grid">
                    <div class="form-group">
                        <label>Role / Job Title</label>
                        <input type="text" class="admin-input exp-title" value="${exp.title || ''}">
                    </div>
                    <div class="form-group">
                        <label>Company / Agency</label>
                        <input type="text" class="admin-input exp-company" value="${exp.company || ''}">
                    </div>
                    <div class="form-group full-width">
                        <label>Period / Dates</label>
                        <input type="text" class="admin-input exp-period" value="${exp.period || ''}">
                    </div>
                    <div class="form-group full-width">
                        <label>Bullet Achievements (One per line)</label>
                        <textarea class="admin-textarea exp-bullets" rows="4">${(exp.bullets || []).join('\n')}</textarea>
                    </div>
                </div>
            `;
            experienceList.appendChild(card);
        });

        // Add Delete Event Listeners
        experienceList.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = parseInt(e.currentTarget.getAttribute('data-exp-index'));
                currentData.experience.splice(index, 1);
                renderExperienceList();
            });
        });
    }

    if (addExpBtn) {
        addExpBtn.addEventListener('click', () => {
            currentData.experience.push({
                title: "New Role",
                company: "Company Name",
                period: "2024 – Present",
                bullets: ["Key achievement bullet point..."]
            });
            renderExperienceList();
        });
    }

    // --------------------------------------------------
    // Dynamic Featured Projects List Manager
    // --------------------------------------------------
    const projectsList = document.getElementById('projectsList');
    const addProjectBtn = document.getElementById('addProjectBtn');

    function renderProjectsList() {
        if (!projectsList) return;
        projectsList.innerHTML = '';

        (currentData.projects || []).forEach((proj, idx) => {
            const card = document.createElement('div');
            card.className = 'item-card';
            card.innerHTML = `
                <div class="item-card-header">
                    <h3>Project #${idx + 1}: ${proj.title || 'Untitled'}</h3>
                    <button type="button" class="btn-delete" data-proj-index="${idx}">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
                <div class="admin-form-grid">
                    <div class="form-group">
                        <label>Project Title</label>
                        <input type="text" class="admin-input proj-title" value="${proj.title || ''}">
                    </div>
                    <div class="form-group">
                        <label>Tags (Comma Separated)</label>
                        <input type="text" class="admin-input proj-tags" value="${(proj.tags || []).join(', ')}">
                    </div>
                    <div class="form-group full-width">
                        <label>Description</label>
                        <textarea class="admin-textarea proj-desc" rows="2">${proj.description || ''}</textarea>
                    </div>
                    <div class="form-group">
                        <label>Thumbnail Image Path / URL</label>
                        <input type="text" class="admin-input proj-thumb" value="${proj.thumb || ''}">
                    </div>
                    <div class="form-group">
                        <label>Sample Video MP4 URL</label>
                        <input type="text" class="admin-input proj-video" value="${proj.videoUrl || ''}">
                    </div>
                </div>
            `;
            projectsList.appendChild(card);
        });

        // Add Delete Event Listeners
        projectsList.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = parseInt(e.currentTarget.getAttribute('data-proj-index'));
                currentData.projects.splice(index, 1);
                renderProjectsList();
            });
        });
    }

    if (addProjectBtn) {
        addProjectBtn.addEventListener('click', () => {
            currentData.projects.push({
                title: "New Project Title",
                description: "Project overview description...",
                thumb: "images/cash_cow.jpg",
                videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
                tags: ["Editing", "Color Grading"]
            });
            renderProjectsList();
        });
    }

    // --------------------------------------------------
    // Collect Form Input Data into Data Schema Object
    // --------------------------------------------------
    function collectDataFromForm() {
        // Tab 1: Hero
        currentData.hero.subtitle = document.getElementById('inputHeroSubtitle').value.trim();
        currentData.hero.title = document.getElementById('inputHeroTitle').value.trim();
        currentData.hero.tags = document.getElementById('inputHeroTags').value.trim();
        currentData.hero.description = document.getElementById('inputHeroDescription').value.trim();
        currentData.hero.aboutText = document.getElementById('inputAboutText').value.trim();
        currentData.hero.heroImg = document.getElementById('inputHeroImg').value.trim();

        // Tab 2: Skills
        currentData.skills.creative = document.getElementById('inputCreativeSkills').value.split(',').map(s => s.trim()).filter(Boolean);
        currentData.skills.software = document.getElementById('inputSoftwareSkills').value.split(',').map(s => s.trim()).filter(Boolean);
        currentData.skills.professional = document.getElementById('inputProfessionalSkills').value.split(',').map(s => s.trim()).filter(Boolean);

        // Tab 3: Experience
        const expCards = experienceList.querySelectorAll('.item-card');
        currentData.experience = [];
        expCards.forEach(card => {
            currentData.experience.push({
                title: card.querySelector('.exp-title').value.trim(),
                company: card.querySelector('.exp-company').value.trim(),
                period: card.querySelector('.exp-period').value.trim(),
                bullets: card.querySelector('.exp-bullets').value.split('\n').map(b => b.trim()).filter(Boolean)
            });
        });

        // Tab 4: Projects
        const projCards = projectsList.querySelectorAll('.item-card');
        currentData.projects = [];
        projCards.forEach(card => {
            currentData.projects.push({
                title: card.querySelector('.proj-title').value.trim(),
                description: card.querySelector('.proj-desc').value.trim(),
                thumb: card.querySelector('.proj-thumb').value.trim(),
                videoUrl: card.querySelector('.proj-video').value.trim(),
                tags: card.querySelector('.proj-tags').value.split(',').map(t => t.trim()).filter(Boolean)
            });
        });

        // Tab 5: Education
        currentData.education.edu1Title = document.getElementById('inputEdu1Title').value.trim();
        currentData.education.edu1Institution = document.getElementById('inputEdu1Institution').value.trim();
        currentData.education.edu1Status = document.getElementById('inputEdu1Status').value.trim();
        currentData.education.edu2Title = document.getElementById('inputEdu2Title').value.trim();
        currentData.education.edu2Institution = document.getElementById('inputEdu2Institution').value.trim();
        currentData.education.edu2Status = document.getElementById('inputEdu2Status').value.trim();
        currentData.education.languages = document.getElementById('inputLanguages').value.split(',').map(l => l.trim()).filter(Boolean);

        // Tab 6: Contact
        currentData.contact.phone = document.getElementById('inputPhone').value.trim();
        currentData.contact.whatsapp = document.getElementById('inputWhatsApp').value.trim();
        currentData.contact.email = document.getElementById('inputEmail').value.trim();
        currentData.contact.location = document.getElementById('inputLocation').value.trim();
    }

    // --------------------------------------------------
    // Save & Encrypt Data to LocalStorage
    // --------------------------------------------------
    async function savePortfolioData() {
        try {
            collectDataFromForm();
            const encryptedPayload = await CryptoUtil.encryptData(currentData, currentPasscode);
            localStorage.setItem('sekar_portfolio_encrypted_data', encryptedPayload);
            localStorage.setItem('sekar_portfolio_live_data', JSON.stringify(currentData));
            showAlert("All portfolio information updated & encrypted live!");
        } catch (err) {
            showAlert("Failed to save data. Encryption error.", true);
        }
    }

    if (saveAllBtn) {
        saveAllBtn.addEventListener('click', savePortfolioData);
    }

    // Toast Alert Helper
    function showAlert(msg, isError = false) {
        if (!adminAlert || !alertText) return;
        alertText.textContent = msg;
        adminAlert.style.borderColor = isError ? '#ff0055' : '#00ff87';
        adminAlert.style.color = isError ? '#ff0055' : '#00ff87';
        adminAlert.classList.add('show');
        setTimeout(() => {
            adminAlert.classList.remove('show');
        }, 4000);
    }

    // --------------------------------------------------
    // Security: Change Passcode
    // --------------------------------------------------
    const changePasswordBtn = document.getElementById('changePasswordBtn');
    if (changePasswordBtn) {
        changePasswordBtn.addEventListener('click', async () => {
            const newPwd = document.getElementById('newPasscode').value.trim();
            const confirmPwd = document.getElementById('confirmPasscode').value.trim();

            if (!newPwd || newPwd !== confirmPwd) {
                showAlert("Passcodes do not match or are empty.", true);
                return;
            }

            try {
                currentPasscode = newPwd;
                collectDataFromForm();
                const encryptedPayload = await CryptoUtil.encryptData(currentData, currentPasscode);
                localStorage.setItem('sekar_portfolio_encrypted_data', encryptedPayload);
                document.getElementById('newPasscode').value = '';
                document.getElementById('confirmPasscode').value = '';
                showAlert("Passcode updated and data re-encrypted!");
            } catch (err) {
                showAlert("Failed to re-encrypt data with new passcode.", true);
            }
        });
    }

    // --------------------------------------------------
    // Backup: Export Encrypted JSON
    // --------------------------------------------------
    const exportBackupBtn = document.getElementById('exportBackupBtn');
    if (exportBackupBtn) {
        exportBackupBtn.addEventListener('click', () => {
            const storedPayload = localStorage.getItem('sekar_portfolio_encrypted_data');
            if (!storedPayload) {
                showAlert("No encrypted data found to export.", true);
                return;
            }

            const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({
                encryptedData: storedPayload,
                timestamp: new Date().toISOString()
            }));
            const downloadAnchor = document.createElement('a');
            downloadAnchor.setAttribute("href", dataStr);
            downloadAnchor.setAttribute("download", "sekar_portfolio_backup.json");
            document.body.appendChild(downloadAnchor);
            downloadAnchor.click();
            downloadAnchor.remove();
            showAlert("Encrypted backup exported successfully!");
        });
    }

    // --------------------------------------------------
    // Export Global Data Config (sekar_portfolio_data.json) for Hosting Sync
    // --------------------------------------------------
    const exportGlobalJsonBtn = document.getElementById('exportGlobalJsonBtn');
    if (exportGlobalJsonBtn) {
        exportGlobalJsonBtn.addEventListener('click', () => {
            gatherDataFromForm();
            const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(currentData, null, 2));
            const downloadAnchor = document.createElement('a');
            downloadAnchor.setAttribute("href", dataStr);
            downloadAnchor.setAttribute("download", "sekar_portfolio_data.json");
            document.body.appendChild(downloadAnchor);
            downloadAnchor.click();
            downloadAnchor.remove();
            showAlert("Exported global config (sekar_portfolio_data.json)! Upload/commit this file to your hosting provider so all devices see your update.");
        });
    }

    // --------------------------------------------------
    // Backup: Import Encrypted JSON
    // --------------------------------------------------
    const importBackupInput = document.getElementById('importBackupInput');
    if (importBackupInput) {
        importBackupInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = async (event) => {
                try {
                    const parsed = JSON.parse(event.target.result);
                    if (parsed && parsed.encryptedData) {
                        localStorage.setItem('sekar_portfolio_encrypted_data', parsed.encryptedData);
                        showAlert("Backup imported! Please unlock with the passcode associated with the backup file.");
                        setTimeout(() => {
                            location.reload();
                        }, 1500);
                    } else {
                        showAlert("Invalid backup JSON format.", true);
                    }
                } catch (err) {
                    showAlert("Failed to parse backup JSON.", true);
                }
            };
            reader.readAsText(file);
        });
    }

    // --------------------------------------------------
    // Reset to Default Template
    // --------------------------------------------------
    const resetDefaultBtn = document.getElementById('resetDefaultBtn');
    if (resetDefaultBtn) {
        resetDefaultBtn.addEventListener('click', async () => {
            if (confirm("Are you sure you want to reset all data back to original defaults? This will overwrite existing custom changes.")) {
                currentData = JSON.parse(JSON.stringify(defaultPortfolioData));
                const encryptedPayload = await CryptoUtil.encryptData(currentData, currentPasscode);
                localStorage.setItem('sekar_portfolio_encrypted_data', encryptedPayload);
                populateFormFromData();
                showAlert("Data reset to defaults and encrypted.");
            }
        });
    }

    // --------------------------------------------------
    // Drag & Drop Hero Profile Photo Handler
    // --------------------------------------------------
    const heroDragDropZone = document.getElementById('heroDragDropZone');
    const heroFileInput = document.getElementById('heroFileInput');
    const inputHeroImg = document.getElementById('inputHeroImg');

    if (heroDragDropZone && heroFileInput) {
        // Prevent browser default window file opening on drop
        window.addEventListener('dragover', (e) => e.preventDefault(), false);
        window.addEventListener('drop', (e) => e.preventDefault(), false);

        heroDragDropZone.addEventListener('click', (e) => {
            if (e.target !== heroFileInput) {
                heroFileInput.click();
            }
        });

        ['dragenter', 'dragover'].forEach(eventName => {
            heroDragDropZone.addEventListener(eventName, (e) => {
                e.preventDefault();
                e.stopPropagation();
                heroDragDropZone.classList.add('drag-over');
            }, false);
        });

        ['dragleave', 'drop'].forEach(eventName => {
            heroDragDropZone.addEventListener(eventName, (e) => {
                e.preventDefault();
                e.stopPropagation();
                heroDragDropZone.classList.remove('drag-over');
            }, false);
        });

        heroDragDropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const dt = e.dataTransfer;
            const files = dt ? dt.files : null;
            if (files && files.length > 0) {
                handleHeroFileUpload(files[0]);
            }
        });

        heroFileInput.addEventListener('change', (e) => {
            if (e.target.files && e.target.files.length > 0) {
                handleHeroFileUpload(e.target.files[0]);
            }
        });

        function handleHeroFileUpload(file) {
            if (!file || !file.type.startsWith('image/')) {
                alert('Please select or drop a valid image file (PNG, JPG, WEBP).');
                return;
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                const base64Data = e.target.result;
                if (inputHeroImg) inputHeroImg.value = base64Data;
                const heroDropContent = document.getElementById('heroDropContent');
                const heroPreviewBox = document.getElementById('heroPreviewBox');
                const heroPreviewImg = document.getElementById('heroPreviewImg');
                if (heroPreviewImg) heroPreviewImg.src = base64Data;
                if (heroDropContent) heroDropContent.style.display = 'none';
                if (heroPreviewBox) heroPreviewBox.style.display = 'flex';
                if (currentData && currentData.hero) {
                    currentData.hero.heroImg = base64Data;
                }
            };
            reader.readAsDataURL(file);
        }
    }
});
