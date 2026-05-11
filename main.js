document.addEventListener('DOMContentLoaded', () => {
    // Fetch GitHub releases
    async function loadGitHubReleases() {
        try {
            const response = await fetch('https://api.github.com/repos/surminus-client/Surminus/releases', {
                headers: {
                    'Accept': 'application/vnd.github.v3+json'
                }
            });
            
            if (!response.ok) throw new Error('Failed to fetch releases');
            
            const releases = await response.json();
            const container = document.getElementById('release-container');
            
            if (releases.length === 0) {
                container.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--md-sys-color-on-surface-variant);">No releases found.</p>';
                return;
            }
            
            container.innerHTML = releases.slice(0, 6).map((release, index) => {
                const isLatest = index === 0;
                const date = new Date(release.published_at).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'short', 
                    day: 'numeric' 
                });
                
                // Get first 200 characters of description
                let description = release.body || 'No description provided';
                if (description.length > 200) {
                    description = description.substring(0, 200) + '...';
                }
                description = description.replace(/\n/g, ' ').trim();
                
                // Find the main download link (usually the first asset or repo link)
                const downloadUrl = release.zipball_url;
                const viewUrl = release.html_url;
                
                return `
                    <div class="release-card">
                        ${isLatest ? '<div class="release-tag latest"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display: inline-block; margin-right: 4px;"><circle cx="12" cy="12" r="1"></circle><path d="M12 1v6m0 6v6"></path><path d="M4.22 4.22l4.24 4.24M15.54 15.54l4.24 4.24"></path><path d="M1 12h6m6 0h6"></path><path d="M4.22 19.78l4.24-4.24M15.54 8.46l4.24-4.24"></path></svg> Latest</div>' : '<div class="release-tag">Release</div>'}
                        <div class="release-version">${release.tag_name}</div>
                        <div class="release-date">${date}</div>
                        <div class="release-description">${escapeHtml(description)}</div>
                        <div class="release-download">
                            ${isLatest ? `<a href="${downloadUrl}" class="download-btn primary" title="Download this release">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                    <polyline points="7 10 12 15 17 10"></polyline>
                                    <line x1="12" y1="15" x2="12" y2="3"></line>
                                </svg> Download
                            </a>` : ''}
                            <a href="${viewUrl}" class="download-btn ${isLatest ? 'secondary' : 'primary'}" target="_blank" title="View on GitHub">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 405 3.3-1.23 3.3-1.23c.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.59-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
                                </svg> View
                            </a>
                        </div>
                    </div>
                `;
            }).join('');
            
        } catch (error) {
            console.error('Error loading releases:', error);
            const container = document.getElementById('release-container');
            container.innerHTML = `
                <div style="grid-column: 1/-1; text-align: center; color: var(--md-sys-color-on-surface-variant); padding: 40px;">
                    <p>Unable to load releases. Please visit <a href="https://github.com/surminus-client/Surminus/releases" target="_blank" style="color: var(--md-sys-color-primary); text-decoration: underline;">GitHub releases</a> directly.</p>
                </div>
            `;
        }
    }
    
    // Utility function to escape HTML
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    // Load releases on page load
    loadGitHubReleases();
    // Scroll reveals with intersection observer
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Unobserve after activation to keep performance high
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all reveal elements
    const revealElements = document.querySelectorAll('.reveal, .reveal-text');
    revealElements.forEach((el, index) => {
        // Add staggered delay to elements that are close together (like grid cards)
        if (el.classList.contains('card')) {
            const gridIndex = Array.from(el.parentNode.children).indexOf(el);
            el.style.transitionDelay = `${gridIndex * 0.1}s`;
        }
        observer.observe(el);
    });

    // Mouse movement tracking for card and feature-side glow effect
    const interactiveElements = document.querySelectorAll('.card, .feature-side');
    interactiveElements.forEach(el => {
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / el.clientWidth) * 100;
            const y = ((e.clientY - rect.top) / el.clientHeight) * 100;
            el.style.setProperty('--mouse-x', `${x}%`);
            el.style.setProperty('--mouse-y', `${y}%`);
        });
    });

    // 3D Tilt effect for all images
    const imageFrames = document.querySelectorAll('.image-frame');
    imageFrames.forEach(imageFrame => {
        imageFrame.addEventListener('mousemove', (e) => {
            const rect = imageFrame.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (centerY - y) / 10; // Adjust sensitivity
            const rotateY = (x - centerX) / 10;

            imageFrame.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
        });

        imageFrame.addEventListener('mouseleave', () => {
            imageFrame.style.transform = 'rotateX(0deg) rotateY(0deg) scale(1)';
        });
    });

    // Smooth scroll for anchors
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
                history.pushState(null, '', this.getAttribute('href'));
            }
        });
    });

    // Theme toggle
    const themeToggle = document.getElementById('theme-toggle');
    const icon = themeToggle.querySelector('i');
    let isDark = localStorage.getItem('theme') === 'dark';

    if (isDark) {
        document.body.classList.add('dark');
        icon.setAttribute('data-lucide', 'sun');
    } else {
        icon.setAttribute('data-lucide', 'moon');
    }
    lucide.createIcons();

    themeToggle.addEventListener('click', () => {
        isDark = !isDark;
        document.body.classList.toggle('dark', isDark);
        icon.setAttribute('data-lucide', isDark ? 'sun' : 'moon');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        lucide.createIcons();
        updateNavStyle();
    });

    // Navbar scroll effect
    const nav = document.querySelector('nav');
    const updateNavStyle = () => {
        const isDarkMode = document.body.classList.contains('dark');
        const baseBg = isDarkMode ? 'rgba(10, 10, 10, 0.92)' : 'rgba(250, 250, 250, 0.8)';
        const scrolledBg = isDarkMode ? 'rgba(10, 10, 10, 0.95)' : 'rgba(250, 250, 250, 0.95)';
        const borderColor = isDarkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(217, 122, 143, 0.15)';
        const borderColorBase = isDarkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(217, 122, 143, 0.1)';

        if (window.scrollY > 50) {
            nav.style.height = '70px';
            nav.style.backgroundColor = scrolledBg;
            nav.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.1)';
            nav.style.borderBottomColor = borderColor;
        } else {
            nav.style.height = '80px';
            nav.style.backgroundColor = baseBg;
            nav.style.boxShadow = 'none';
            nav.style.borderBottomColor = borderColorBase;
        }
    };

    window.addEventListener('scroll', updateNavStyle);
    updateNavStyle();

    // Button interaction enhancement
    const buttons = document.querySelectorAll('.m3-button');
    buttons.forEach(button => {
        // Magnetic lift effect
        button.addEventListener('mousemove', (e) => {
            const rect = button.getBoundingClientRect();
            const x = (e.clientX - rect.left - rect.width / 2) * 0.2;
            const y = (e.clientY - rect.top - rect.height / 2) * 0.2;
            button.style.transform = `translate(${x}px, ${y}px) translateY(-2px) scale(1.02)`;
        });

        button.addEventListener('mouseleave', () => {
            button.style.transform = '';
        });

        // Ripple effect for M3 buttons
        button.addEventListener('mousedown', function (e) {
            const ripple = document.createElement('span');
            ripple.classList.add('ripple');
            this.appendChild(ripple);

            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height) * 2;
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;

            ripple.style.width = ripple.style.height = `${size}px`;
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;

            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });

    // Add ripple CSS dynamically
    const style = document.createElement('style');
    style.textContent = `
        .ripple {
            position: absolute;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple-animation 0.6s ease-out;
            pointer-events: none;
        }
        @keyframes ripple-animation {
            to {
                transform: scale(1.5);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
});
