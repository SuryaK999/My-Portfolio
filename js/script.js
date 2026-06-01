document.addEventListener('DOMContentLoaded', () => {

    // Navbar Scroll Effect
    const header = document.querySelector('.header');
    const isHomePage = () => {
        const path = window.location.pathname.split('/').pop();
        return !path || path === '' || path === 'index.html';
    };

    const updateHeader = () => {
        if (window.scrollY > 50 || !isHomePage()) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };
    window.addEventListener('scroll', updateHeader);
    updateHeader(); // Initial check

    // Active Link Highlighting based on URL
    const navLinks = document.querySelectorAll('.nav-link');
    const currentPath = window.location.pathname;
    let currentFile = currentPath.split('/').pop();

    // Default to index.html if path is empty or /
    if (!currentFile || currentFile === '') {
        currentFile = 'index.html';
    }

    navLinks.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');
        if (href === currentFile) {
            link.classList.add('active');
        }
    });

    // Intersection Observer for Fly-in Animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const flyInObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                flyInObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.stat-card, .skill-icon-card, .project-card, .about-image, .about-content, .timeline-item').forEach(el => {
        flyInObserver.observe(el);
    });

    // Smooth scroll for internal anchors (if any)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                window.scrollTo({
                    top: targetElement.offsetTop - 40,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Skills Tab Switcher with Smooth Fade
    const tabBtns = document.querySelectorAll('.tab-btn');
    const skillsGrid = document.getElementById('skills-grid');
    const toolsGrid = document.getElementById('tools-grid');

    tabBtns.forEach((btn, index) => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Smooth fade transition
            if (index === 0) {
                toolsGrid.style.opacity = '0';
                toolsGrid.style.transform = 'translateY(10px)';
                setTimeout(() => {
                    toolsGrid.classList.add('hidden');
                    skillsGrid.classList.remove('hidden');
                    setTimeout(() => {
                        skillsGrid.style.opacity = '1';
                        skillsGrid.style.transform = 'translateY(0)';
                    }, 50);
                }, 200);
            } else {
                skillsGrid.style.opacity = '0';
                skillsGrid.style.transform = 'translateY(10px)';
                setTimeout(() => {
                    skillsGrid.classList.add('hidden');
                    toolsGrid.classList.remove('hidden');
                    setTimeout(() => {
                        toolsGrid.style.opacity = '1';
                        toolsGrid.style.transform = 'translateY(0)';
                    }, 50);
                }, 200);
            }
        });
    });

    // Projects Slider Navigation
    const slider = document.getElementById('projectsSlider');
    const prevBtn = document.querySelector('.slider-prev');
    const nextBtn = document.querySelector('.slider-next');
    const scrollAmount = 240; // Card width + gap

    if (prevBtn && nextBtn && slider) {
        prevBtn.addEventListener('click', () => {
            slider.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        });

        nextBtn.addEventListener('click', () => {
            slider.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        });
    }

    // Projects Filter Logic
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    if (filterBtns.length > 0 && projectCards.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Set active class
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const filterValue = btn.getAttribute('data-filter');

                projectCards.forEach(card => {
                    const category = card.getAttribute('data-category');
                    card.classList.remove('fade-in');

                    if (filterValue === 'all' || category === filterValue) {
                        card.classList.remove('hidden-project');
                        // Trigger reflow to restart animation
                        void card.offsetWidth;
                        card.classList.add('fade-in');
                    } else {
                        card.classList.add('hidden-project');
                    }
                });
            });
        });
    }

    // Back to Top functionality
    const backToTopBtn = document.getElementById('backToTop');
    const scrollIndicator = document.querySelector('.scroll-indicator');

    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Custom Toast Notification System
    window.showToast = function(message, type = 'success') {
        let container = document.getElementById('toast-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'toast-container';
            document.body.appendChild(container);
        }

        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;

        const icon = type === 'success' ? 'fa-circle-check' : 'fa-circle-exclamation';

        toast.innerHTML = `
            <i class="fas ${icon} toast-icon"></i>
            <div class="toast-content">
                <span class="toast-title">${type}</span>
                <span class="toast-message">${message}</span>
            </div>
            <button class="toast-close" aria-label="Close">&times;</button>
        `;

        container.appendChild(toast);

        // Force a reflow to trigger transition
        void toast.offsetWidth;
        toast.classList.add('show');

        const autoDismiss = setTimeout(() => {
            dismissToast(toast);
        }, 4000);

        toast.querySelector('.toast-close').addEventListener('click', () => {
            clearTimeout(autoDismiss);
            dismissToast(toast);
        });
    };

    function dismissToast(toast) {
        toast.classList.remove('show');
        toast.classList.add('hide');
        toast.addEventListener('transitionend', () => {
            toast.remove();
        });
    }

    // Form Submission Handling
    const contactForm = document.querySelector('form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const submitBtn = contactForm.querySelector('button');
            const originalText = submitBtn.innerText;
            submitBtn.innerText = 'SENDING...';
            submitBtn.disabled = true;

            const formData = new FormData(contactForm);
            
            // Check honeypot field (anti-spam bot detection)
            if (formData.get('_honey')) {
                setTimeout(() => {
                    showToast('Thank you! Your message has been received successfully.', 'success');
                    submitBtn.innerText = originalText;
                    submitBtn.disabled = false;
                    contactForm.reset();
                }, 1000);
                return;
            }

            const data = {};
            formData.forEach((value, key) => {
                data[key] = value;
            });

            fetch('https://formsubmit.co/ajax/suryak93813040@gmail.com', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(data)
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(res => {
                showToast('Thank you! Your message has been sent successfully.', 'success');
                contactForm.reset();
            })
            .catch(error => {
                console.error('Error submitting form:', error);
                showToast('Oops! Something went wrong. Please try again.', 'error');
            })
            .finally(() => {
                submitBtn.innerText = originalText;
                submitBtn.disabled = false;
            });
        });
    }

    // Matrix Rain Effect - Professional Grid-Perfect Version
    function initMatrix() {
        const canvas = document.getElementById('matrixCanvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        // Character set restricted to Katakana and Binary (0 & 1)
        const katakana = 'アァカサタナハマヤャラワガザダバパイィキシチヒミリヰギジヂビピウゥクスツヌフムユュルグズヅブプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン';
        const binary = '01';
        const characters = (katakana + binary).split('');

        const fontSize = 18;
        const colWidth = 24; // Fixed grid column width
        const rowHeight = 22; // Fixed grid row height

        let columns;
        let drops = [];

        function setup() {
            canvas.width = window.innerWidth;
            canvas.height = canvas.parentElement.offsetHeight;
            columns = Math.floor(canvas.width / colWidth);
            drops = [];
            for (let i = 0; i < columns; i++) {
                drops[i] = {
                    x: i * colWidth + (colWidth - fontSize) / 2,
                    y: Math.random() * -100, // Initial random offset
                    speed: 1, // Uniform speed for consistency
                    chars: [] // To store the history of this column
                };
            }
        }

        let lastTime = 0;
        const fps = 24; // Cinematic terminal frame rate
        const interval = 1000 / fps;

        function draw(timestamp) {
            const deltaTime = timestamp - lastTime;

            if (deltaTime > interval) {
                lastTime = timestamp - (deltaTime % interval);

                // Clear with deep black trail
                ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                ctx.font = `${fontSize}px monospace`;

                for (let i = 0; i < drops.length; i++) {
                    const drop = drops[i];

                    // Pick a random character
                    const text = characters[Math.floor(Math.random() * characters.length)];

                    // True Matrix Green
                    // Head of the rain is slightly brighter for "amazing" visuals
                    if (Math.random() > 0.98) {
                        ctx.fillStyle = '#b3ffd1';
                    } else {
                        ctx.fillStyle = '#00ff41';
                    }

                    // Render current character
                    ctx.fillText(text, drop.x, drop.y * rowHeight);

                    // Drop logic
                    if (drop.y * rowHeight > canvas.height && Math.random() > 0.975) {
                        drop.y = 0;
                    } else {
                        drop.y += drop.speed;
                    }

                    // Occasional column glitch/reset for realism
                    if (Math.random() > 0.99) {
                        drop.y += (Math.random() > 0.5 ? 1 : -1);
                    }
                }
            }
            requestAnimationFrame(draw);
        }

        setup();
        requestAnimationFrame(draw);

        window.addEventListener('resize', () => {
            setup();
        });
    }

    initMatrix();

});
