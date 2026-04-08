document.addEventListener('DOMContentLoaded', () => {
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
    function easeInOutQuad(t) {
        return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    }

    function smoothScrollTo(targetY, duration = 650) {
        const startY = window.pageYOffset;
        const distance = targetY - startY;
        let startTime = null;

        function animation(currentTime) {
            if (!startTime) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const progress = Math.min(timeElapsed / duration, 1);
            const easedProgress = easeInOutQuad(progress);
            window.scrollTo(0, startY + distance * easedProgress);
            if (timeElapsed < duration) {
                requestAnimationFrame(animation);
            }
        }

        requestAnimationFrame(animation);
    }

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const elementPosition = target.getBoundingClientRect().top + window.pageYOffset;
                smoothScrollTo(elementPosition, 700);
                history.pushState(null, '', this.getAttribute('href'));
            }
        });
    });

    // Navbar scroll effect
    const nav = document.querySelector('nav');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.style.height = '70px';
            nav.style.backgroundColor = 'rgba(250, 250, 250, 0.95)';
            nav.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.1)';
            nav.style.borderBottomColor = 'rgba(217, 122, 143, 0.15)';
        } else {
            nav.style.height = '80px';
            nav.style.backgroundColor = 'rgba(250, 250, 250, 0.8)';
            nav.style.boxShadow = 'none';
            nav.style.borderBottomColor = 'rgba(217, 122, 143, 0.1)';
        }
    });

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
