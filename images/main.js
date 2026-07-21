document.addEventListener('DOMContentLoaded', () => {
    // ==========================================
    // 0. DYNAMIC LIVE DATA HYDRATION
    // ==========================================
    // Fetch global portfolio data config file (sekar_portfolio_data.json) for cross-device sync
    fetch(`./sekar_portfolio_data.json?v=${Date.now()}`)
        .then(res => {
            if (res.ok) return res.json();
            throw new Error('No remote JSON file');
        })
        .then(remoteData => {
            if (remoteData) {
                hydrateDOMWithLiveData(remoteData);
                localStorage.setItem('sekar_portfolio_live_data', JSON.stringify(remoteData));
            }
        })
        .catch(() => {
            // Fallback to localStorage if offline
            let liveDataRaw = localStorage.getItem('sekar_portfolio_live_data');
            if (liveDataRaw && liveDataRaw.includes('sekarsmarth444@gmail.com')) {
                liveDataRaw = liveDataRaw.replaceAll('sekarsmarth444@gmail.com', 'sekarganesh2503@gmail.com');
                localStorage.setItem('sekar_portfolio_live_data', liveDataRaw);
            }
            if (liveDataRaw) {
                try {
                    const data = JSON.parse(liveDataRaw);
                    hydrateDOMWithLiveData(data);
                } catch (e) {
                    console.error('Failed to parse live portfolio data:', e);
                }
            }
        });

    function hydrateDOMWithLiveData(data) {
        if (!data) return;

        // Hero & Bio
        if (data.hero) {
            const subtitleEl = document.querySelector('.hero-subtitle');
            if (subtitleEl && data.hero.subtitle) subtitleEl.textContent = data.hero.subtitle;

            const titleEl = document.querySelector('.hero-title');
            if (titleEl && data.hero.title) titleEl.innerHTML = data.hero.title.replace('\n', '<br>');

            const tagsEl = document.querySelector('.hero-tags');
            if (tagsEl && data.hero.tags) {
                const parts = data.hero.tags.split('•').map(t => `<span>${t.trim()}</span>`);
                tagsEl.innerHTML = parts.join(' • ');
            }

            const descEl = document.querySelector('.hero-description');
            if (descEl && data.hero.description) descEl.textContent = data.hero.description;

            const aboutEl = document.querySelector('.about-text');
            if (aboutEl && data.hero.aboutText) aboutEl.textContent = data.hero.aboutText;

            const heroImgEl = document.querySelector('.hero-img');
            if (heroImgEl && data.hero.heroImg) heroImgEl.src = data.hero.heroImg;
        }

        // Skills
        if (data.skills) {
            const skillCards = document.querySelectorAll('.skill-card');

            if (skillCards[0] && data.skills.creative) {
                const tagsList = skillCards[0].querySelector('.skill-tags');
                if (tagsList) tagsList.innerHTML = data.skills.creative.map(s => `<li>${s}</li>`).join('');
            }

            if (skillCards[1] && data.skills.software) {
                const tagsList = skillCards[1].querySelector('.skill-tags');
                if (tagsList) tagsList.innerHTML = data.skills.software.map(s => `<li>${s}</li>`).join('');
            }

            if (skillCards[2] && data.skills.professional) {
                const tagsList = skillCards[2].querySelector('.skill-tags');
                if (tagsList) tagsList.innerHTML = data.skills.professional.map(s => `<li>${s}</li>`).join('');
            }
        }

        // Experience Timeline
        if (data.experience && data.experience.length > 0) {
            const timeline = document.querySelector('.timeline');
            if (timeline) {
                timeline.innerHTML = data.experience.map(exp => `
                    <div class="timeline-item">
                        <div class="timeline-dot"></div>
                        <div class="timeline-content">
                            <div class="experience-header">
                                <div>
                                    <h3 class="role-title">${exp.title || ''}</h3>
                                    <span class="company-name">${exp.company || ''}</span>
                                </div>
                                <span class="experience-date"><i class="far fa-calendar-alt"></i> ${exp.period || ''}</span>
                            </div>
                            <ul class="experience-bullets">
                                ${(exp.bullets || []).map(b => `<li>${b}</li>`).join('')}
                            </ul>
                        </div>
                    </div>
                `).join('');
            }
        }

        // Projects
        if (data.projects && data.projects.length > 0) {
            const grid = document.querySelector('#portfolio .portfolio-grid');
            if (grid) {
                grid.innerHTML = data.projects.map(proj => `
                    <div class="portfolio-card" data-video="${proj.videoUrl || ''}" data-title="${proj.title || ''}">
                        <div class="card-thumbnail">
                            <img src="${proj.thumb || 'images/cash_cow.jpg'}" alt="${proj.title || 'Project'}">
                            <div class="play-overlay">
                                <div class="play-btn">
                                    <i class="fas fa-play"></i>
                                </div>
                            </div>
                        </div>
                        <div class="card-body">
                            <h3 class="card-title">${proj.title || ''}</h3>
                            <p class="card-desc">${proj.description || ''}</p>
                            <div class="project-tags">
                                ${(proj.tags || []).map(t => `<span>${t}</span>`).join('')}
                            </div>
                        </div>
                    </div>
                `).join('');
                bindPortfolioCardListeners();
            }
        }

        // Education & Languages
        if (data.education) {
            const eduCards = document.querySelectorAll('.education-card');
            if (eduCards[0]) {
                if (data.education.edu1Title) eduCards[0].querySelector('h3').textContent = data.education.edu1Title;
                if (data.education.edu1Institution) eduCards[0].querySelector('.edu-institution').textContent = data.education.edu1Institution;
                if (data.education.edu1Status) eduCards[0].querySelector('.edu-status').textContent = data.education.edu1Status;
            }
            if (eduCards[1]) {
                if (data.education.edu2Title) eduCards[1].querySelector('h3').textContent = data.education.edu2Title;
                if (data.education.edu2Institution) eduCards[1].querySelector('.edu-institution').textContent = data.education.edu2Institution;
                if (data.education.edu2Status) eduCards[1].querySelector('.edu-status').textContent = data.education.edu2Status;
            }
            if (data.education.languages) {
                const langBox = document.querySelector('.languages-box');
                if (langBox) {
                    langBox.innerHTML = `
                        <span class="lang-title"><i class="fas fa-globe"></i> Languages:</span>
                        ${data.education.languages.map(l => `<span class="lang-pill">${l}</span>`).join('')}
                    `;
                }
            }
        }

        // Contact & WhatsApp
        if (data.contact) {
            const waNum = data.contact.whatsapp || '917305527120';
            const phoneNum = data.contact.phone || '7305527120';
            let emailAddr = data.contact.email || 'sekarganesh2503@gmail.com';
            if (emailAddr.includes('sekarsmarth444')) emailAddr = 'sekarganesh2503@gmail.com';
            const locationStr = data.contact.location || 'Coimbatore, Tamil Nadu, India';

            // Update WhatsApp CTA Links
            document.querySelectorAll('a[href*="wa.me"]').forEach(link => {
                link.href = `https://wa.me/${waNum}?text=Hi%20Sekar,%20I%20saw%20your%20portfolio%20and%20want%20to%20connect!`;
            });

            // Update Header & Footer Phone/Email links
            document.querySelectorAll('a[href*="tel:"]').forEach(link => {
                link.href = `tel:${phoneNum}`;
                if (link.textContent.trim() && !link.querySelector('i')) link.textContent = phoneNum;
            });

            document.querySelectorAll('a[href*="mailto:"]').forEach(link => {
                link.href = `mailto:${emailAddr}`;
                if (link.textContent.trim() && !link.querySelector('i')) link.textContent = emailAddr;
            });
        }
    }

    // ==========================================
    // 1. MOBILE NAVIGATION MENU TOGGLE
    // ==========================================
    const mobileToggle = document.getElementById('mobileToggle');
    const mainNav = document.getElementById('mainNav');
    const navLinks = document.querySelectorAll('.nav-link');

    if (mobileToggle && mainNav) {
        mobileToggle.addEventListener('click', () => {
            mainNav.classList.toggle('open');
            const icon = mobileToggle.querySelector('i');
            if (mainNav.classList.contains('open')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });

        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                mainNav.classList.remove('open');
                const icon = mobileToggle.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            });
        });
    }

    // ==========================================
    // 2. VIDEO MODAL PLAYER
    // ==========================================
    const videoModal = document.getElementById('videoModal');
    const closeModal = document.getElementById('closeModal');
    const modalVideoPlayer = document.getElementById('modalVideoPlayer');
    const modalVideoTitle = document.getElementById('modalVideoTitle');

    function bindPortfolioCardListeners() {
        const portfolioCards = document.querySelectorAll('.portfolio-card');
        portfolioCards.forEach(card => {
            card.removeEventListener('click', openCardModal);
            card.addEventListener('click', openCardModal);
        });
    }

    function openCardModal(e) {
        const card = e.currentTarget;
        const videoUrl = card.getAttribute('data-video');
        const videoTitle = card.getAttribute('data-title');

        if (videoUrl && modalVideoPlayer) {
            modalVideoPlayer.src = videoUrl;
            modalVideoTitle.textContent = videoTitle || 'Video Edit Preview';
            videoModal.classList.add('active');
            modalVideoPlayer.play().catch(err => console.log('Autoplay prevented:', err));
        }
    }

    bindPortfolioCardListeners();

    const hideModal = () => {
        if (videoModal && modalVideoPlayer) {
            videoModal.classList.remove('active');
            modalVideoPlayer.pause();
            modalVideoPlayer.currentTime = 0;
            modalVideoPlayer.src = '';
        }
    };

    if (closeModal) {
        closeModal.addEventListener('click', hideModal);
    }

    if (videoModal) {
        videoModal.addEventListener('click', (e) => {
            if (e.target === videoModal) {
                hideModal();
            }
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && videoModal && videoModal.classList.contains('active')) {
            hideModal();
        }
        // Admin Shortcut: Ctrl + Shift + A
        if (e.ctrlKey && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
            window.location.href = 'admin.html';
        }
    });

    // ==========================================
    // 3. CONSULTATION FORM & WHATSAPP INTEGRATION
    // ==========================================
    const consultForm = document.getElementById('consultForm');
    const formToast = document.getElementById('formToast');

    if (consultForm) {
        consultForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const nameInput = document.getElementById('userName');
            const interestInput = document.getElementById('userInterest');

            const name = nameInput ? nameInput.value.trim() : '';
            const interest = interestInput ? interestInput.value.trim() : '';

            if (name && interest) {
                if (formToast) {
                    formToast.classList.add('show');
                }

                // Retrieve live WhatsApp number if available
                let phoneNumber = '917305527120';
                if (liveDataRaw) {
                    try {
                        const parsed = JSON.parse(liveDataRaw);
                        if (parsed.contact && parsed.contact.whatsapp) phoneNumber = parsed.contact.whatsapp;
                    } catch(err){}
                }

                const messageText = `Hi Sekar! My name is ${name}. I am interested in: ${interest}`;
                const waUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(messageText)}`;

                setTimeout(() => {
                    window.open(waUrl, '_blank');
                    if (formToast) {
                        formToast.classList.remove('show');
                    }
                    consultForm.reset();
                }, 1000);
            }
        });
    }

    // ==========================================
    // 4. ACTIVE SECTION NAVIGATION HIGHLIGHT
    // ==========================================
    const sections = document.querySelectorAll('section[id]');

    const scrollActive = () => {
        const scrollY = window.pageYOffset;

        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 120;
            const sectionId = current.getAttribute('id');
            const navLink = document.querySelector(`.nav-list a[href*=${sectionId}]`);

            if (navLink) {
                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    navLink.classList.add('active');
                } else {
                    navLink.classList.remove('active');
                }
            }
        });
    };

    window.addEventListener('scroll', scrollActive);
});
