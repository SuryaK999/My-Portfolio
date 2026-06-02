document.addEventListener('DOMContentLoaded', () => {

    // Persistent Header Scroll Effect
    const header = document.querySelector('.header');
    const isHomePage = () => {
        const path = window.location.pathname.split('/').pop();
        return !path || path === '' || path === 'index.html';
    };

    const updateHeader = () => {
        if (!header) return;
        if (window.scrollY > 50 || !isHomePage()) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };
    window.addEventListener('scroll', updateHeader);
    updateHeader(); // Initial check

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

    function initFlyInObserver() {
        document.querySelectorAll('.stat-card, .skill-icon-card, .project-card, .about-image, .about-content, .timeline-item').forEach(el => {
            flyInObserver.observe(el);
        });
    }

    // Smooth scroll for internal anchors (using delegation for SPA compatibility)
    document.addEventListener('click', (e) => {
        const anchor = e.target.closest('a[href^="#"]');
        if (!anchor) return;
        const targetId = anchor.getAttribute('href');
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

    // Back to Top functionality
    function initBackToTop() {
        const backToTopBtn = document.getElementById('backToTop');
        if (backToTopBtn) {
            backToTopBtn.onclick = () => {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            };
        }
    }

    // Custom Toast Notification System (Global helper)
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

    // Skills Tab Switcher with Smooth Fade
    function initSkillsTab() {
        const tabBtns = document.querySelectorAll('.tab-btn');
        const skillsGrid = document.getElementById('skills-grid');
        const toolsGrid = document.getElementById('tools-grid');

        if (!skillsGrid || !toolsGrid || tabBtns.length === 0) return;

        // Reset grids to default skills view
        skillsGrid.classList.remove('hidden');
        skillsGrid.style.opacity = '1';
        skillsGrid.style.transform = 'translateY(0)';
        toolsGrid.classList.add('hidden');
        toolsGrid.style.opacity = '0';

        tabBtns.forEach((btn, index) => {
            // Keep first button active by default
            if (index === 0) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }

            btn.onclick = () => {
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
            };
        });
    }

    // Projects Slider Navigation
    function initProjectsSlider() {
        const slider = document.getElementById('projectsSlider');
        const prevBtn = document.querySelector('.slider-prev');
        const nextBtn = document.querySelector('.slider-next');
        const scrollAmount = 240; // Card width + gap

        if (prevBtn && nextBtn && slider) {
            prevBtn.onclick = () => {
                slider.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
            };

            nextBtn.onclick = () => {
                slider.scrollBy({ left: scrollAmount, behavior: 'smooth' });
            };
        }
    }

    // Projects Filter Logic
    function initProjectsFilter() {
        const filterBtns = document.querySelectorAll('.filter-btn');
        const projectCards = document.querySelectorAll('.project-card');

        if (filterBtns.length > 0 && projectCards.length > 0) {
            filterBtns.forEach(btn => {
                btn.onclick = () => {
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
                };
            });
        }
    }

    // Form Submission Handling
    function initContactForm() {
        const contactForm = document.querySelector('form');
        if (!contactForm) return;

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

    // GitHub Guestbook (Utterances integration)
    function initGuestbook() {
        const container = document.getElementById('utterances-container');
        if (!container) return;

        container.innerHTML = '';
        const script = document.createElement('script');
        script.src = 'https://utteranc.es/client.js';
        script.setAttribute('repo', 'SuryaK999/My-Portfolio');
        script.setAttribute('issue-term', 'pathname');
        script.setAttribute('theme', 'github-dark');
        script.setAttribute('crossorigin', 'anonymous');
        script.async = true;
        container.appendChild(script);
    }

    // Matrix Rain Effect - Professional Grid-Perfect Version
    let matrixAnimId = null;
    function initMatrix() {
        if (matrixAnimId) {
            cancelAnimationFrame(matrixAnimId);
            matrixAnimId = null;
        }

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
            if (!canvas.parentElement) return;
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
            matrixAnimId = requestAnimationFrame(draw);
        }

        setup();
        matrixAnimId = requestAnimationFrame(draw);

        // Self-cleaning resize handler
        const handleResize = () => {
            if (document.getElementById('matrixCanvas')) {
                setup();
            } else {
                window.removeEventListener('resize', handleResize);
            }
        };
        window.addEventListener('resize', handleResize);
    }

    // Draggable Terminal CLI System
    const BUBBLE_SIZE = 64;
    const BUBBLE_RADIUS = 32;
    let isTerminalMaximized = false;
    let terminalOriginalStyle = {};
    let isTypingTerminal = false;
    let hasDraggedDock = false; // Prevent clicks immediately after dragging bubble

    let autoHideTimeout = null;

    function scheduleAutoHide() {
        clearTimeout(autoHideTimeout);
        autoHideTimeout = setTimeout(() => {
            const bubble = document.getElementById('terminalBubble');
            if (bubble && !bubble.classList.contains('hidden')) {
                if (bubble.classList.contains('docked-left') || bubble.classList.contains('docked-right')) {
                    bubble.classList.add('auto-hidden');
                }
            }
        }, 3000);
    }

    function clearAutoHide() {
        clearTimeout(autoHideTimeout);
        const bubble = document.getElementById('terminalBubble');
        if (bubble) {
            bubble.classList.remove('auto-hidden');
        }
    }

    function saveTerminalState() {
        const overlay = document.getElementById('terminalOverlay');
        const bubble = document.getElementById('terminalBubble');
        const launcher = document.getElementById('terminalLauncher');
        if (!overlay || !bubble || !launcher) return;

        let state = 'closed';
        if (!overlay.classList.contains('hidden')) {
            state = 'open';
        } else if (!bubble.classList.contains('hidden')) {
            state = 'docked';
        }

        sessionStorage.setItem('terminal_state', state);
        sessionStorage.setItem('terminal_x', overlay.style.left || '');
        sessionStorage.setItem('terminal_y', overlay.style.top || '');
        sessionStorage.setItem('terminal_dock_side', bubble.classList.contains('docked-left') ? 'left' : 'right');
        sessionStorage.setItem('terminal_dock_y', bubble.style.top || '');
        sessionStorage.setItem('terminal_maximized', isTerminalMaximized ? 'true' : 'false');

        // Save pre-maximized styles
        sessionStorage.setItem('terminal_orig_top', terminalOriginalStyle.top || '');
        sessionStorage.setItem('terminal_orig_left', terminalOriginalStyle.left || '');
        sessionStorage.setItem('terminal_orig_width', terminalOriginalStyle.width || '');
        sessionStorage.setItem('terminal_orig_height', terminalOriginalStyle.height || '');
        sessionStorage.setItem('terminal_orig_bottom', terminalOriginalStyle.bottom || '');
        sessionStorage.setItem('terminal_orig_right', terminalOriginalStyle.right || '');
        sessionStorage.setItem('terminal_orig_radius', terminalOriginalStyle.borderRadius || '');
    }

    function restoreTerminalState() {
        const launcher = document.getElementById('terminalLauncher');
        const overlay = document.getElementById('terminalOverlay');
        const bubble = document.getElementById('terminalBubble');
        const body = document.getElementById('terminalBody');
        const input = document.getElementById('terminalInput');

        if (!overlay || !bubble || !launcher) return;

        const state = sessionStorage.getItem('terminal_state') || 'closed';
        const x = sessionStorage.getItem('terminal_x');
        const y = sessionStorage.getItem('terminal_y');
        const dockSide = sessionStorage.getItem('terminal_dock_side') || 'right';
        const dockY = sessionStorage.getItem('terminal_dock_y');
        const maxState = sessionStorage.getItem('terminal_maximized') === 'true';

        // Reset visibility
        launcher.classList.remove('hidden');
        overlay.classList.add('hidden');
        bubble.classList.add('hidden');

        // Restore layout coordinates
        if (x) overlay.style.left = x;
        if (y) overlay.style.top = y;
        overlay.style.bottom = 'auto';
        overlay.style.right = 'auto';

        if (state === 'open') {
            launcher.classList.add('hidden');
            overlay.classList.remove('hidden');
            if (maxState) {
                isTerminalMaximized = false;
                toggleTerminalMaximize(overlay, body);
            }
            if (input) input.focus();
        } else if (state === 'docked') {
            launcher.classList.add('hidden');
            bubble.classList.remove('hidden');
            bubble.classList.remove('docked-left', 'docked-right');
            bubble.classList.add(`docked-${dockSide}`);
            if (dockY) bubble.style.top = dockY;
            if (dockSide === 'left') {
                bubble.style.left = '0';
            } else {
                bubble.style.left = (window.innerWidth - BUBBLE_SIZE) + 'px';
            }
            scheduleAutoHide();
        } else {
            launcher.classList.remove('hidden');
            overlay.classList.add('hidden');
            bubble.classList.add('hidden');
        }
    }

    function initTerminal() {
        const launcher = document.getElementById('terminalLauncher');
        const overlay = document.getElementById('terminalOverlay');
        const bubble = document.getElementById('terminalBubble');
        const closeBtn = document.getElementById('terminalClose');
        const minBtn = document.getElementById('terminalMin');
        const maxBtn = document.getElementById('terminalMax');
        const input = document.getElementById('terminalInput');
        const body = document.getElementById('terminalBody');
        const header = document.getElementById('terminalHeader');

        if (!launcher || !overlay || !bubble) return;

        // Reset state
        isTypingTerminal = false;

        // Restore saved states from sessionStorage (if any)
        restoreTerminalState();

        // Toggle terminal open
        launcher.onclick = () => {
            overlay.classList.remove('hidden');
            launcher.classList.add('hidden');
            overlay.style.bottom = '100px';
            overlay.style.right = '30px';
            overlay.style.top = 'auto';
            overlay.style.left = 'auto';
            isTerminalMaximized = false;
            overlay.style.borderRadius = '12px';
            overlay.style.width = '480px';
            overlay.style.height = '350px';
            body.classList.remove('hidden');
            input.focus();
            saveTerminalState();
        };

        // Close terminal completely (launcher reset)
        const closeTerminal = () => {
            overlay.classList.add('hidden');
            bubble.classList.add('hidden');
            launcher.classList.remove('hidden');
            clearAutoHide();
            saveTerminalState();
        };

        // Minimize terminal into bubble (chat-head grow animation from click cursor)
        const minimizeTerminal = (x, y) => {
            const rect = overlay.getBoundingClientRect();
            
            // 1. Shrink and fade overlay to the click location
            overlay.style.transition = 'transform 0.4s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.3s ease';
            overlay.style.transformOrigin = `${x - rect.left}px ${y - rect.top}px`;
            overlay.style.transform = 'scale(0.05)';
            overlay.style.opacity = '0';

            // 2. Simultaneously display the bubble at click coordinate
            bubble.classList.remove('hidden', 'docked-left', 'docked-right', 'auto-hidden');
            bubble.style.transition = 'none';
            bubble.style.left = (x - BUBBLE_RADIUS) + 'px';
            bubble.style.top = (y - BUBBLE_RADIUS) + 'px';
            
            // Force reflow
            void bubble.offsetWidth;

            // 3. Animate snap sliding to closest side immediately
            const isLeft = x < window.innerWidth / 2;
            const side = isLeft ? 'left' : 'right';
            const targetY = Math.max(10, Math.min(y - BUBBLE_RADIUS, window.innerHeight - BUBBLE_SIZE - 10));

            bubble.style.transition = 'left 0.4s cubic-bezier(0.19, 1, 0.22, 1), top 0.4s cubic-bezier(0.19, 1, 0.22, 1)';
            bubble.style.top = targetY + 'px';
            if (side === 'left') {
                bubble.style.left = '0px';
            } else {
                bubble.style.left = (window.innerWidth - BUBBLE_SIZE) + 'px';
            }

            setTimeout(() => {
                // Complete minimize
                overlay.classList.add('hidden');
                overlay.style.transform = '';
                overlay.style.opacity = '';
                overlay.style.transformOrigin = '';
                overlay.style.transition = '';

                bubble.style.transition = '';
                bubble.classList.add(`docked-${side}`);
                bubble.classList.add('snap-bounce');

                setTimeout(() => {
                    bubble.classList.remove('snap-bounce');
                }, 500);

                saveTerminalState();
                scheduleAutoHide();
            }, 400);
        };

        const restoreTerminalFromBubble = () => {
            clearAutoHide();

            const bubbleRect = bubble.getBoundingClientRect();
            const side = bubble.classList.contains('docked-left') ? 'left' : 'right';

            // Hide bubble and setup expand
            bubble.classList.add('hidden');
            bubble.classList.remove('docked-left', 'docked-right', 'auto-hidden');

            overlay.style.transition = 'none';
            overlay.classList.remove('hidden');

            const overlayWidth = 480;
            const overlayHeight = 350;
            let targetLeft = 20;
            if (side === 'right') {
                targetLeft = window.innerWidth - overlayWidth - 20;
            }
            const targetTop = Math.max(10, Math.min(bubbleRect.top, window.innerHeight - overlayHeight - 10));

            overlay.style.left = targetLeft + 'px';
            overlay.style.top = targetTop + 'px';
            overlay.style.bottom = 'auto';
            overlay.style.right = 'auto';
            overlay.style.width = overlayWidth + 'px';
            overlay.style.height = overlayHeight + 'px';
            overlay.style.borderRadius = '12px';

            // Setup origin towards bubble center
            const originX = side === 'left' ? 0 : overlayWidth;
            const originY = bubbleRect.top - targetTop + BUBBLE_RADIUS;
            overlay.style.transformOrigin = `${originX}px ${originY}px`;
            overlay.style.transform = 'scale(0.05)';
            overlay.style.opacity = '0';

            // Force reflow
            void overlay.offsetWidth;

            // Expand animation
            overlay.style.transition = 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.3s ease';
            overlay.style.transform = 'scale(1)';
            overlay.style.opacity = '1';

            setTimeout(() => {
                overlay.style.transition = '';
                overlay.style.transformOrigin = '';
                overlay.style.transform = '';
                overlay.style.opacity = '';
                input.focus();
                saveTerminalState();
            }, 400);
        };

        const toggleMaximize = () => {
            toggleTerminalMaximize(overlay, body);
            saveTerminalState();
        };

        // Tap bubble to expand terminal
        bubble.onclick = (e) => {
            if (hasDraggedDock) {
                hasDraggedDock = false; // Drag event locked click
                return;
            }
            restoreTerminalFromBubble();
        };

        // Hover listeners for collapsed edge handles
        bubble.addEventListener('mouseenter', () => {
            clearAutoHide();
        });

        bubble.addEventListener('mouseleave', () => {
            scheduleAutoHide();
        });

        // Isolate dot controls from dragging mechanics by blocking bubbling events
        const preventBubbling = (e) => e.stopPropagation();
        ['mousedown', 'touchstart', 'click'].forEach(evt => {
            closeBtn.addEventListener(evt, preventBubbling);
            minBtn.addEventListener(evt, preventBubbling);
            maxBtn.addEventListener(evt, preventBubbling);
        });

        // Close, Minimize, Maximize dot button bindings
        closeBtn.onclick = (e) => {
            e.preventDefault();
            closeTerminal();
        };

        minBtn.onclick = (e) => {
            e.preventDefault();
            const clickX = e.clientX || window.innerWidth / 2;
            const clickY = e.clientY || window.innerHeight / 2;
            minimizeTerminal(clickX, clickY);
        };

        maxBtn.onclick = (e) => {
            e.preventDefault();
            toggleMaximize();
        };

        // Auto-focus terminal input on body clicks
        body.onclick = () => {
            if (!isTypingTerminal) {
                input.focus();
            }
        };

        // Setup Drag listeners
        makeTerminalDraggable(header, overlay);
        makeBubbleDraggable(bubble, overlay);

        // Input Submission
        input.onkeydown = async (e) => {
            if (e.key === 'Enter') {
                if (isTypingTerminal) return; // Prevent double trigger while typewriting
                const cmd = input.value.trim();
                input.value = '';

                // Print the prompt and typed command
                printTerminalLineInstant(`<span class="prompt">visitor@surya-portfolio:~$</span> ${escapeTerminalHTML(cmd)}`);

                if (cmd !== '') {
                    if (cmd.toLowerCase() === 'exit') {
                        closeTerminal();
                    } else {
                        await handleTerminalCommand(cmd.toLowerCase());
                    }
                } else {
                    printTerminalLineInstant('');
                }
            }
        };
    }

    function toggleTerminalMaximize(overlay, body) {
        if (!isTerminalMaximized) {
            terminalOriginalStyle = {
                top: overlay.style.top,
                left: overlay.style.left,
                width: overlay.style.width,
                height: overlay.style.height,
                bottom: overlay.style.bottom,
                right: overlay.style.right,
                borderRadius: overlay.style.borderRadius
            };
            overlay.style.top = '0';
            overlay.style.left = '0';
            overlay.style.width = '100vw';
            overlay.style.height = '100vh';
            overlay.style.bottom = 'auto';
            overlay.style.right = 'auto';
            overlay.style.borderRadius = '0';
            body.classList.remove('hidden');
            isTerminalMaximized = true;
        } else {
            // Restore from saved memory/sessionState values
            const origTop = terminalOriginalStyle.top || sessionStorage.getItem('terminal_orig_top') || '';
            const origLeft = terminalOriginalStyle.left || sessionStorage.getItem('terminal_orig_left') || '';
            const origWidth = terminalOriginalStyle.width || sessionStorage.getItem('terminal_orig_width') || '';
            const origHeight = terminalOriginalStyle.height || sessionStorage.getItem('terminal_orig_height') || '';
            const origBottom = terminalOriginalStyle.bottom || sessionStorage.getItem('terminal_orig_bottom') || '';
            const origRight = terminalOriginalStyle.right || sessionStorage.getItem('terminal_orig_right') || '';
            
            overlay.style.top = origTop;
            overlay.style.left = origLeft;
            overlay.style.width = origWidth || '480px';
            overlay.style.height = origHeight || '350px';
            overlay.style.bottom = origBottom;
            overlay.style.right = origRight;
            overlay.style.borderRadius = '12px';
            isTerminalMaximized = false;
        }
    }

    function makeTerminalDraggable(header, overlay) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        header.onmousedown = dragMouseDown;
        header.ontouchstart = dragTouchStart;

        function dragMouseDown(e) {
            if (isTerminalMaximized) return;
            if (e.target.classList.contains('dot')) return;
            e = e || window.event;
            e.preventDefault();
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
        }

        function dragTouchStart(e) {
            if (isTerminalMaximized) return;
            if (e.target.classList.contains('dot')) return;
            pos3 = e.touches[0].clientX;
            pos4 = e.touches[0].clientY;
            document.ontouchend = closeDragElement;
            document.ontouchmove = elementTouchDrag;
        }

        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;

            let newTop = overlay.offsetTop - pos2;
            let newLeft = overlay.offsetLeft - pos1;

            // Restrict dragging boundaries to keep the terminal window visible inside viewport
            const maxLeft = window.innerWidth - overlay.offsetWidth;
            const maxTop = window.innerHeight - overlay.offsetHeight;

            newLeft = Math.max(0, Math.min(newLeft, maxLeft));
            newTop = Math.max(0, Math.min(newTop, maxTop));

            overlay.style.top = newTop + "px";
            overlay.style.left = newLeft + "px";
            overlay.style.bottom = "auto";
            overlay.style.right = "auto";
        }

        function elementTouchDrag(e) {
            pos1 = pos3 - e.touches[0].clientX;
            pos2 = pos4 - e.touches[0].clientY;
            pos3 = e.touches[0].clientX;
            pos4 = e.touches[0].clientY;

            let newTop = overlay.offsetTop - pos2;
            let newLeft = overlay.offsetLeft - pos1;

            const maxLeft = window.innerWidth - overlay.offsetWidth;
            const maxTop = window.innerHeight - overlay.offsetHeight;

            newLeft = Math.max(0, Math.min(newLeft, maxLeft));
            newTop = Math.max(0, Math.min(newTop, maxTop));

            overlay.style.top = newTop + "px";
            overlay.style.left = newLeft + "px";
            overlay.style.bottom = "auto";
            overlay.style.right = "auto";
        }

        // Cleanup events and save coordinates
        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;
            document.ontouchend = null;
            document.ontouchmove = null;
            saveTerminalState();
        }
    }

    function makeBubbleDraggable(bubble, overlay) {
        let startX = 0, startY = 0;
        let startLeft = 0, startTop = 0;
        let isLockedToSide = false;
        let dockSide = 'right';

        bubble.onmousedown = dragMouseDown;
        bubble.ontouchstart = dragTouchStart;

        function dragMouseDown(e) {
            e = e || window.event;
            e.preventDefault();
            
            // Clear hover/auto-hide timers during drag
            clearAutoHide();
            
            // Get exact bounding rect to calculate offset and position without layout jumps
            const rect = bubble.getBoundingClientRect();
            bubble.style.left = rect.left + 'px';
            bubble.style.top = rect.top + 'px';
            
            // Determine if starting docked or free
            const wasDocked = bubble.classList.contains('docked-left') || bubble.classList.contains('docked-right');
            dockSide = rect.left + rect.width / 2 < window.innerWidth / 2 ? 'left' : 'right';
            isLockedToSide = wasDocked;
            
            bubble.classList.remove('docked-left', 'docked-right', 'auto-hidden');
            
            startX = e.clientX;
            startY = e.clientY;
            startLeft = rect.left;
            startTop = rect.top;
            hasDraggedDock = false;
            
            // Scale up slightly and disable transitions for instant feedback
            bubble.style.transition = 'none';
            bubble.style.transform = 'scale(1.1)';
            
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
        }

        function dragTouchStart(e) {
            clearAutoHide();
            
            const rect = bubble.getBoundingClientRect();
            bubble.style.left = rect.left + 'px';
            bubble.style.top = rect.top + 'px';
            
            const wasDocked = bubble.classList.contains('docked-left') || bubble.classList.contains('docked-right');
            dockSide = rect.left + rect.width / 2 < window.innerWidth / 2 ? 'left' : 'right';
            isLockedToSide = wasDocked;
            
            bubble.classList.remove('docked-left', 'docked-right', 'auto-hidden');
            
            const touch = e.touches[0];
            startX = touch.clientX;
            startY = touch.clientY;
            startLeft = rect.left;
            startTop = rect.top;
            hasDraggedDock = false;
            
            bubble.style.transition = 'none';
            bubble.style.transform = 'scale(1.1)';
            
            document.ontouchend = closeDragElement;
            document.ontouchmove = elementTouchDrag;
        }

        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();
            
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;

            if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
                hasDraggedDock = true;
            }

            // Lock behavior: if snapped to side, horizontal pull must exceed 35px to detach
            if (isLockedToSide) {
                if (dockSide === 'left') {
                    if (dx > 35) {
                        isLockedToSide = false;
                    }
                } else {
                    if (dx < -35) {
                        isLockedToSide = false;
                    }
                }
            }

            let newLeft;
            let newTop = startTop + dy;

            if (isLockedToSide) {
                newLeft = dockSide === 'left' ? 0 : (window.innerWidth - BUBBLE_SIZE);
            } else {
                newLeft = startLeft + dx;
            }

            // Boundaries
            const maxLeft = window.innerWidth - BUBBLE_SIZE;
            const maxTop = window.innerHeight - BUBBLE_SIZE;
            newLeft = Math.max(0, Math.min(newLeft, maxLeft));
            newTop = Math.max(10, Math.min(newTop, maxTop - 10)); // 10px spacing from screen top/bottom

            bubble.style.left = newLeft + 'px';
            bubble.style.top = newTop + 'px';
        }

        function elementTouchDrag(e) {
            const touch = e.touches[0];
            const dx = touch.clientX - startX;
            const dy = touch.clientY - startY;

            if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
                hasDraggedDock = true;
            }

            if (isLockedToSide) {
                if (dockSide === 'left') {
                    if (dx > 35) {
                        isLockedToSide = false;
                    }
                } else {
                    if (dx < -35) {
                        isLockedToSide = false;
                    }
                }
            }

            let newLeft;
            let newTop = startTop + dy;

            if (isLockedToSide) {
                newLeft = dockSide === 'left' ? 0 : (window.innerWidth - BUBBLE_SIZE);
            } else {
                newLeft = startLeft + dx;
            }

            const maxLeft = window.innerWidth - BUBBLE_SIZE;
            const maxTop = window.innerHeight - BUBBLE_SIZE;
            newLeft = Math.max(0, Math.min(newLeft, maxLeft));
            newTop = Math.max(10, Math.min(newTop, maxTop - 10));

            bubble.style.left = newLeft + 'px';
            bubble.style.top = newTop + 'px';
        }

        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;
            document.ontouchend = null;
            document.ontouchmove = null;

            // Reset scale transform
            bubble.style.transform = '';

            // Magnetic snap calculation
            const currentLeft = parseInt(bubble.style.left) || 0;
            const isLeft = (currentLeft + BUBBLE_RADIUS) < window.innerWidth / 2;
            const side = isLeft ? 'left' : 'right';
            const targetX = isLeft ? 0 : (window.innerWidth - BUBBLE_SIZE);
            const targetY = Math.max(10, Math.min(parseInt(bubble.style.top) || 0, window.innerHeight - BUBBLE_SIZE - 10));

            // Smooth slide snap transition using GPU friendly cubic bezier curve
            bubble.style.transition = 'left 0.4s cubic-bezier(0.19, 1, 0.22, 1), top 0.4s cubic-bezier(0.19, 1, 0.22, 1)';
            bubble.style.top = targetY + 'px';
            bubble.style.left = targetX + 'px';

            setTimeout(() => {
                bubble.style.transition = '';
                // Add docking classes and trigger snap-bounce physical animation
                bubble.classList.add(`docked-${side}`);
                bubble.classList.add('snap-bounce');
                
                // Remove snap-bounce class after animation finishes (500ms)
                setTimeout(() => {
                    bubble.classList.remove('snap-bounce');
                }, 500);

                // Save new state & start auto-hide timer
                saveTerminalState();
                scheduleAutoHide();
            }, 400);
        }
    }

    async function handleTerminalCommand(cmd) {
        isTypingTerminal = true;
        const input = document.getElementById('terminalInput');
        if (input) input.disabled = true;

        const clean = cmd.trim();
        if (clean === 'help') {
            await printTerminalLine('Available Commands:', true);
            await printTerminalLine('  about    - Learn about Surya Prakash');
            await printTerminalLine('  skills   - Display technical skills');
            await printTerminalLine('  projects - View portfolio projects');
            await printTerminalLine('  contact  - Display contact channels');
            await printTerminalLine('  clear    - Clear terminal logs');
            await printTerminalLine('  exit     - Close the terminal window');
        } else if (clean === 'about') {
            await printTerminalLine('Surya Prakash is a dedicated Computer Science student and expert developer in the making. Specialized in writing high-performance application architectures, scalable databases, and smooth responsive user experiences.');
        } else if (clean === 'skills') {
            await printTerminalLine('Technical Skillset:', true);
            await printTerminalLine('  Languages: Python, Java, JavaScript, Rust');
            await printTerminalLine('  Web Tech:  Svelte 5, Node.js, SQLite, HTML5, CSS3');
            await printTerminalLine('  Tools:     VS Code, Tauri, Electron, Git/GitHub, Vercel');
        } else if (clean === 'projects') {
            await printTerminalLine('Featured Projects:', true);
            await printTerminalLine('  * Realtime Study Room (Socket.io collaborative study hub)');
            await printTerminalLine('  * Tauri Focus App (Tray-utility timer app built in Rust & Svelte)');
            await printTerminalLine('  * Desktop Music Player (Electron-based music companion)');
            await printTerminalLine('  * Apple TV Web Clone (High-fidelity responsive front-end clone)');
        } else if (clean === 'contact') {
            await printTerminalLine('Contact Links:', true);
            // Links must render as clickable HTML instantly, rather than typewritten text
            printTerminalLineInstant('  Email:    <a href="mailto:suryak93813040@gmail.com" class="highlight">suryak93813040@gmail.com</a>');
            printTerminalLineInstant('  GitHub:   <a href="https://github.com/SuryaK999" target="_blank" class="highlight">github.com/SuryaK999</a>');
            printTerminalLineInstant('  LinkedIn: <a href="https://linkedin.com/in/suryaprakash" target="_blank" class="highlight">linkedin.com/in/suryaprakash</a>');
        } else if (clean === 'clear') {
            const output = document.getElementById('terminalOutput');
            if (output) output.innerHTML = '';
        } else if (clean === 'exit') {
            const overlay = document.getElementById('terminalOverlay');
            if (overlay) overlay.classList.add('hidden');
        } else {
            await printTerminalLine(`command not found: ${clean}. Type 'help' for a list of commands.`);
        }

        if (input) {
            input.disabled = false;
            input.focus();
        }
        isTypingTerminal = false;
    }

    function escapeTerminalHTML(str) {
        return str.replace(/[&<>'"]/g, 
            tag => ({
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                "'": '&#39;',
                '"': '&quot;'
            }[tag] || tag)
        );
    }

    // Typewriter print effect for CLI output lines (only for text strings)
    function printTerminalLine(htmlContent, isHighlight = false, speed = 12) {
        const output = document.getElementById('terminalOutput');
        if (!output) return Promise.resolve();

        const p = document.createElement('p');
        p.className = isHighlight ? 'system-msg highlight' : 'terminal-line';
        output.appendChild(p);

        return new Promise((resolve) => {
            let index = 0;
            const interval = setInterval(() => {
                if (index < htmlContent.length) {
                    p.textContent += htmlContent[index];
                    index++;
                    const body = document.getElementById('terminalBody');
                    if (body) body.scrollTop = body.scrollHeight;
                } else {
                    clearInterval(interval);
                    resolve();
                }
            }, speed);
        });
    }

    // Instant print fallback for HTML strings containing custom link tags
    function printTerminalLineInstant(htmlContent, isHighlight = false) {
        const output = document.getElementById('terminalOutput');
        if (!output) return;
        const p = document.createElement('p');
        p.className = isHighlight ? 'system-msg highlight' : 'terminal-line';
        p.innerHTML = htmlContent;
        output.appendChild(p);

        const body = document.getElementById('terminalBody');
        if (body) {
            body.scrollTop = body.scrollHeight;
        }
    }

    // Client-Side SPA Router System
    function initRouter() {
        // Intercept navigation links
        document.body.addEventListener('click', (e) => {
            const link = e.target.closest('a');
            if (!link) return;

            const href = link.getAttribute('href');
            if (!href) return;

            // Check if it's an external link, target blank, download, or asset
            if (
                link.target === '_blank' || 
                link.hasAttribute('download') || 
                href.startsWith('http://') || 
                href.startsWith('https://') && !href.startsWith(window.location.origin) ||
                href.startsWith('mailto:') || 
                href.startsWith('tel:') ||
                href.startsWith('#') ||
                href.endsWith('.pdf')
            ) {
                // Let browser handle it
                return;
            }

            e.preventDefault();

            // Prevent fetching/routing if user is clicking a link to the current active page
            const currentFilename = window.location.pathname.split('/').pop() || 'index.html';
            const targetFilename = href.split('/').pop() || 'index.html';
            if (currentFilename === targetFilename) {
                return;
            }

            navigateTo(href);
        });

        // Intercept browser back/forward buttons
        window.addEventListener('popstate', () => {
            navigateTo(window.location.pathname, false);
        });
    }

    function navigateTo(url, pushToHistory = true) {
        const progressBar = document.getElementById('page-progress-bar');
        const mainContent = document.querySelector('main');
        if (!mainContent) return;

        // Animate progress bar start
        if (progressBar) {
            progressBar.style.opacity = '1';
            progressBar.style.width = '30%';
        }

        // Fetch first in the background. We ONLY fade out content once the fetch succeeds.
        // This makes the transition feel incredibly fast and avoids showing a blank screen on slow lines.
        fetch(url)
            .then(response => {
                if (!response.ok) throw new Error('Could not fetch path');
                if (progressBar) progressBar.style.width = '70%';
                return response.text();
            })
            .then(html => {
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');

                const newMain = doc.querySelector('main');
                const newTitle = doc.querySelector('title');

                if (!newMain) throw new Error('Main element not found in path');

                // Fade out current main content (0.3s)
                mainContent.classList.remove('fade-in');
                mainContent.classList.add('fade-out');

                setTimeout(() => {
                    // Update browser history
                    if (pushToHistory) {
                        history.pushState(null, '', url);
                    }

                    // Update Title
                    if (newTitle) {
                        document.title = newTitle.innerText;
                    }

                    // Swap main content
                    mainContent.innerHTML = newMain.innerHTML;
                    
                    // Set styles of main container if needed
                    if (newMain.getAttribute('style')) {
                        mainContent.setAttribute('style', newMain.getAttribute('style'));
                    } else {
                        mainContent.removeAttribute('style');
                    }

                    // Reset scroll to top
                    window.scrollTo({ top: 0, behavior: 'instant' });

                    // Highlight navbar tab active state
                    updateActiveNavLink();

                    // Animate progress bar completion
                    if (progressBar) {
                        progressBar.style.width = '100%';
                        setTimeout(() => {
                            progressBar.style.opacity = '0';
                            setTimeout(() => {
                                progressBar.style.width = '0';
                            }, 300);
                        }, 300);
                    }

                    // Re-run JavaScript logic for newly injected DOM
                    reinitializePageScripts();

                    // Fade back in
                    mainContent.classList.remove('fade-out');
                    mainContent.classList.add('fade-in');
                }, 300);
            })
            .catch(error => {
                console.error('Navigation error:', error);
                // Fallback to regular browser load
                window.location.href = url;
            });
    }

    function updateActiveNavLink() {
        const navLinks = document.querySelectorAll('.nav-link');
        const path = window.location.pathname.split('/').pop() || 'index.html';

        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href === path) {
                link.classList.add('active');
            }
        });

        updateHeader();
    }

    function reinitializePageScripts() {
        // Clear matrix rain animation loops to prevent leaking memory
        if (matrixAnimId) {
            cancelAnimationFrame(matrixAnimId);
            matrixAnimId = null;
        }

        // Initialize animations on the new components
        initFlyInObserver();

        // Identify current file/page route
        const path = window.location.pathname.split('/').pop() || 'index.html';

        if (path === 'index.html' || path === '') {
            initMatrix();
            initTerminal();
        } else if (path === 'skills.html') {
            initSkillsTab();
        } else if (path === 'projects.html') {
            initProjectsSlider();
            initProjectsFilter();
        } else if (path === 'contact.html') {
            initContactForm();
            initGuestbook();
        }
    }

    // --- INITIAL BOOTSTRAP ---
    initBackToTop();
    initRouter();
    reinitializePageScripts();
});
