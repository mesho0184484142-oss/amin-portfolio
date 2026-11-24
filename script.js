/* ==========================================================================
   أمين رجب | رواد البرمجيات
   60fps 3D Spatial Constellation Engine, Spring Physics, Case-Study Modal
   & Smart Project Configurator (Zero-Dependency ES6)
   ========================================================================== */

(() => {
    'use strict';

    /* ----------------------------------------------------------------------
       0. Capabilities & Math Helpers
       ---------------------------------------------------------------------- */
    const REDUCED_MOTION_QUERY = window.matchMedia('(prefers-reduced-motion: reduce)');
    const FINE_POINTER_QUERY = window.matchMedia('(hover: hover) and (pointer: fine)');
    const DESKTOP_STAGE_QUERY = window.matchMedia('(min-width: 993px) and (hover: hover) and (pointer: fine)');

    const prefersReducedMotion = () => REDUCED_MOTION_QUERY.matches;
    const isFinePointer = () => FINE_POINTER_QUERY.matches;
    const isDesktopStage = () => DESKTOP_STAGE_QUERY.matches;

    const lerp = (start, end, factor) => start + (end - start) * factor;
    const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

    // Shared normalized pointer & scroll state for 3D spatial backdrop
    const spatialState = {
        pointerX: 0,
        pointerY: 0,
        scrollY: 0
    };

    /* ----------------------------------------------------------------------
       1. Instant Non-Blocking Preloader (Zero Artificial LCP Delay)
       ---------------------------------------------------------------------- */
    function initPreloader() {
        const preloader = document.getElementById('preloader');
        if (!preloader) return;

        let dismissed = false;

        const dismiss = () => {
            if (dismissed) return;
            dismissed = true;
            preloader.classList.add('preloader-hidden');
            window.setTimeout(() => {
                preloader.style.display = 'none';
            }, 560);
        };

        // Dismiss right after DOM settles (180ms) rather than blocking on window.load
        if (document.readyState === 'loading') {
            document.addEventListener(
                'DOMContentLoaded',
                () => {
                    window.requestAnimationFrame(() => {
                        window.setTimeout(dismiss, 180);
                    });
                },
                { once: true }
            );
        } else {
            window.requestAnimationFrame(() => {
                window.setTimeout(dismiss, 160);
            });
        }

        // Hard failsafe: never allow preloader to block rendering
        window.setTimeout(dismiss, 1200);
    }

    /* ----------------------------------------------------------------------
       2. Interactive 3D Spatial Constellation Engine (#spatial-canvas)
       ---------------------------------------------------------------------- */
    function initSpatialCanvas() {
        const canvas = document.getElementById('spatial-canvas');
        if (!canvas) return;

        const ctx = canvas.getContext('2d', { alpha: true });
        if (!ctx) return;

        const FOV = 520;
        const Z_MIN = 110;
        const Z_MAX = 960;

        let width = window.innerWidth;
        let height = window.innerHeight;
        let dpr = Math.min(window.devicePixelRatio || 1, 2);
        let particles = [];
        let rafId = null;
        let camX = 0;
        let camY = 0;
        let camScroll = 0;
        let resizeTimer = null;

        const PALETTE = [
            { r: 212, g: 175, b: 55 },  // Royal Gold
            { r: 248, g: 228, b: 155 }, // Champagne Gold
            { r: 0, g: 229, b: 255 },   // Neon Cyan
            { r: 226, g: 232, b: 240 }  // Soft Starlight
        ];

        function pickColor(index) {
            const mod = index % 10;
            if (mod < 3) return PALETTE[0];
            if (mod < 5) return PALETTE[1];
            if (mod < 8) return PALETTE[2];
            return PALETTE[3];
        }

        function getTargetCount(w) {
            if (w < 480) return 32;
            if (w < 992) return 52;
            return 82;
        }

        function createParticles() {
            const count = getTargetCount(width);
            const spreadX = Math.max(width * 0.82, 520);
            const spreadY = Math.max(height * 0.85, 520);

            particles = Array.from({ length: count }, (_, i) => ({
                x: (Math.random() - 0.5) * spreadX * 2,
                y: (Math.random() - 0.5) * spreadY * 2,
                z: Z_MIN + Math.random() * (Z_MAX - Z_MIN),
                vx: (Math.random() - 0.5) * 0.24,
                vy: (Math.random() - 0.5) * 0.2,
                vz: -(0.18 + Math.random() * 0.34),
                radius: 1.15 + Math.random() * 1.85,
                color: pickColor(i),
                sx: 0,
                sy: 0,
                scale: 1,
                alpha: 0
            }));
        }

        function resizeCanvas() {
            width = window.innerWidth;
            height = window.innerHeight;
            dpr = Math.min(window.devicePixelRatio || 1, 2);

            canvas.width = Math.floor(width * dpr);
            canvas.height = Math.floor(height * dpr);
            canvas.style.width = `${width}px`;
            canvas.style.height = `${height}px`;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

            createParticles();
            if (prefersReducedMotion()) {
                renderFrame(false);
            }
        }

        function renderFrame(animate) {
            ctx.clearRect(0, 0, width, height);

            // Smooth 3D camera parallax from pointer + scroll depth
            const targetCamX = spatialState.pointerX * 42;
            const targetCamY = spatialState.pointerY * 28;
            const targetScroll = spatialState.scrollY * 0.085;

            if (animate) {
                camX = lerp(camX, targetCamX, 0.055);
                camY = lerp(camY, targetCamY, 0.055);
                camScroll = lerp(camScroll, targetScroll, 0.08);
            }

            const halfW = width * 0.5;
            const halfH = height * 0.5;
            const spreadX = Math.max(width * 0.85, 540);
            const spreadY = Math.max(height * 0.88, 540);
            const maxLinkDist = width < 768 ? 115 : 148;
            const maxLinkDistSq = maxLinkDist * maxLinkDist;

            // Project particles from 3D world space into 2D viewport
            for (let i = 0; i < particles.length; i += 1) {
                const p = particles[i];

                if (animate) {
                    p.x += p.vx;
                    p.y += p.vy;
                    p.z += p.vz;

                    if (p.z < Z_MIN) {
                        p.z = Z_MAX;
                        p.x = (Math.random() - 0.5) * spreadX * 2;
                        p.y = (Math.random() - 0.5) * spreadY * 2;
                    }
                    if (p.x > spreadX) p.x = -spreadX;
                    else if (p.x < -spreadX) p.x = spreadX;
                    if (p.y > spreadY) p.y = -spreadY;
                    else if (p.y < -spreadY) p.y = spreadY;
                }

                const depthRatio = 1 - (p.z - Z_MIN) / (Z_MAX - Z_MIN);
                const scale = FOV / (FOV + p.z);
                const wrappedY = ((p.y - camScroll + spreadY) % (spreadY * 2) + spreadY * 2) % (spreadY * 2) - spreadY;

                p.scale = scale;
                p.sx = halfW + (p.x - camX) * scale;
                p.sy = halfH + (wrappedY - camY) * scale;
                p.alpha = clamp(depthRatio * 0.88, 0.08, 0.9);
            }

            // Draw depth-faded constellation filaments
            ctx.lineWidth = 0.85;
            for (let i = 0; i < particles.length; i += 1) {
                const a = particles[i];
                if (a.sx < -40 || a.sx > width + 40 || a.sy < -40 || a.sy > height + 40) continue;

                for (let j = i + 1; j < particles.length; j += 1) {
                    const b = particles[j];
                    const dx = a.sx - b.sx;
                    const dy = a.sy - b.sy;
                    const distSq = dx * dx + dy * dy;

                    if (distSq < maxLinkDistSq) {
                        const proximity = 1 - Math.sqrt(distSq) / maxLinkDist;
                        const depthAvg = (a.alpha + b.alpha) * 0.5;
                        const lineAlpha = proximity * depthAvg * 0.22;

                        if (lineAlpha > 0.015) {
                            const useCyan = a.color.b > 200 || b.color.b > 200;
                            ctx.strokeStyle = useCyan
                                ? `rgba(0, 229, 255, ${lineAlpha.toFixed(3)})`
                                : `rgba(212, 175, 55, ${lineAlpha.toFixed(3)})`;
                            ctx.beginPath();
                            ctx.moveTo(a.sx, a.sy);
                            ctx.lineTo(b.sx, b.sy);
                            ctx.stroke();
                        }
                    }
                }
            }

            // Draw projected 3D star/constellation nodes
            for (let i = 0; i < particles.length; i += 1) {
                const p = particles[i];
                if (p.sx < -20 || p.sx > width + 20 || p.sy < -20 || p.sy > height + 20) continue;

                const r = Math.max(0.7, p.radius * p.scale * 1.45);
                const { r: cr, g: cg, b: cb } = p.color;

                // Soft outer halo for closer nodes
                if (p.alpha > 0.42) {
                    ctx.fillStyle = `rgba(${cr}, ${cg}, ${cb}, ${(p.alpha * 0.16).toFixed(3)})`;
                    ctx.beginPath();
                    ctx.arc(p.sx, p.sy, r * 3.1, 0, Math.PI * 2);
                    ctx.fill();
                }

                // Crisp glowing node core
                ctx.fillStyle = `rgba(${cr}, ${cg}, ${cb}, ${p.alpha.toFixed(3)})`;
                ctx.beginPath();
                ctx.arc(p.sx, p.sy, r, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        function tick() {
            if (document.hidden || prefersReducedMotion()) {
                rafId = null;
                return;
            }
            renderFrame(true);
            rafId = window.requestAnimationFrame(tick);
        }

        function startLoop() {
            if (prefersReducedMotion()) {
                renderFrame(false);
                return;
            }
            if (rafId === null && !document.hidden) {
                rafId = window.requestAnimationFrame(tick);
            }
        }

        function stopLoop() {
            if (rafId !== null) {
                window.cancelAnimationFrame(rafId);
                rafId = null;
            }
        }

        resizeCanvas();
        startLoop();

        if (isFinePointer()) {
            window.addEventListener(
                'pointermove',
                (e) => {
                    spatialState.pointerX = (e.clientX / Math.max(width, 1) - 0.5) * 2;
                    spatialState.pointerY = (e.clientY / Math.max(height, 1) - 0.5) * 2;
                },
                { passive: true }
            );
        }

        window.addEventListener(
            'resize',
            () => {
                window.clearTimeout(resizeTimer);
                resizeTimer = window.setTimeout(resizeCanvas, 160);
            },
            { passive: true }
        );

        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                stopLoop();
            } else {
                startLoop();
            }
        });
    }

    /* ----------------------------------------------------------------------
       3. Zero-Layout-Thrashing Scroll Pipeline, Spy & Accessible Nav
       ---------------------------------------------------------------------- */
    function initScrollAndNavigation() {
        const navbar = document.getElementById('navbar');
        const scrollProgress = document.getElementById('scroll-progress');
        const menuToggle = document.getElementById('menu-toggle');
        const navLinks = document.getElementById('nav-links');
        const navItems = Array.from(document.querySelectorAll('.nav-item'));
        const sections = Array.from(document.querySelectorAll('section[id]'));

        // Enable GPU scaleX scroll bar mode immediately
        if (scrollProgress) {
            scrollProgress.classList.add('is-gpu-progress');
            scrollProgress.style.setProperty('--scroll-scale', '0');
        }

        // Single passive scroll listener gated by rAF
        let scrollRafPending = false;

        const updateScrollState = () => {
            scrollRafPending = false;
            const scrollTop = window.scrollY || document.documentElement.scrollTop || 0;
            spatialState.scrollY = scrollTop;

            if (navbar) {
                navbar.classList.toggle('scrolled', scrollTop > 36);
            }

            if (scrollProgress) {
                const maxScroll = Math.max(
                    1,
                    document.documentElement.scrollHeight - document.documentElement.clientHeight
                );
                const scale = clamp(scrollTop / maxScroll, 0, 1);
                scrollProgress.style.setProperty('--scroll-scale', scale.toFixed(4));
            }
        };

        const onScroll = () => {
            if (!scrollRafPending) {
                scrollRafPending = true;
                window.requestAnimationFrame(updateScrollState);
            }
        };

        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', onScroll, { passive: true });
        updateScrollState();

        // IntersectionObserver Nav Spy (Zero offsetTop reads on scroll)
        if (sections.length > 0 && navItems.length > 0 && 'IntersectionObserver' in window) {
            const navMap = new Map();
            navItems.forEach((link) => {
                const hash = link.getAttribute('href');
                if (hash && hash.startsWith('#')) {
                    navMap.set(hash.slice(1), link);
                }
            });

            const setActiveNav = (id) => {
                const target = navMap.get(id);
                if (!target) return;
                navItems.forEach((item) => {
                    const isCurrent = item === target;
                    item.classList.toggle('active', isCurrent);
                    if (isCurrent) {
                        item.setAttribute('aria-current', 'page');
                    } else {
                        item.removeAttribute('aria-current');
                    }
                });
            };

            const spyObserver = new IntersectionObserver(
                (entries) => {
                    let bestEntry = null;
                    for (const entry of entries) {
                        if (entry.isIntersecting) {
                            if (!bestEntry || entry.intersectionRatio > bestEntry.intersectionRatio) {
                                bestEntry = entry;
                            }
                        }
                    }
                    if (bestEntry && bestEntry.target.id) {
                        setActiveNav(bestEntry.target.id);
                    }
                },
                {
                    rootMargin: '-28% 0px -54% 0px',
                    threshold: [0, 0.25, 0.5]
                }
            );

            sections.forEach((section) => spyObserver.observe(section));
        }

        // Accessible Mobile Navigation Drawer
        if (menuToggle && navLinks) {
            const setMenuOpen = (isOpen, restoreFocus = false) => {
                navLinks.classList.toggle('active', isOpen);
                menuToggle.classList.toggle('active', isOpen);
                menuToggle.setAttribute('aria-expanded', String(isOpen));
                if (!isOpen && restoreFocus) {
                    menuToggle.focus({ preventScroll: true });
                }
            };

            menuToggle.addEventListener('click', (e) => {
                e.stopPropagation();
                const willOpen = !navLinks.classList.contains('active');
                setMenuOpen(willOpen);
            });

            navItems.forEach((item) => {
                item.addEventListener('click', () => setMenuOpen(false));
            });

            document.addEventListener('click', (e) => {
                if (
                    navLinks.classList.contains('active') &&
                    navbar &&
                    !navbar.contains(e.target)
                ) {
                    setMenuOpen(false);
                }
            });

            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && navLinks.classList.contains('active')) {
                    setMenuOpen(false, true);
                }
            });

            window.addEventListener(
                'resize',
                () => {
                    if (window.innerWidth > 768 && navLinks.classList.contains('active')) {
                        setMenuOpen(false);
                    }
                },
                { passive: true }
            );
        }
    }

    /* ----------------------------------------------------------------------
       4. Scroll Reveal Animations & Smooth Eased Stat Counters
       ---------------------------------------------------------------------- */
    function initRevealAndCounters() {
        const revealSelectors = [
            '.hero-text > *',
            '.hero-3d-stage',
            '.tech-item',
            '.section-header',
            '.bento-card',
            '.agency-showcase',
            '.stat-box',
            '.portfolio-filters',
            '.portfolio-card',
            '.smart-concierge-box',
            '.channel-card'
        ];

        const revealElements = Array.from(document.querySelectorAll(revealSelectors.join(', ')));

        if (!prefersReducedMotion() && 'IntersectionObserver' in window && revealElements.length > 0) {
            revealElements.forEach((el, index) => {
                el.classList.add('reveal-item');
                const delay = (index % 4) * 0.065;
                el.style.transitionDelay = `${delay}s`;
            });

            const revealObserver = new IntersectionObserver(
                (entries, observer) => {
                    entries.forEach((entry) => {
                        if (!entry.isIntersecting) return;
                        const target = entry.target;
                        target.classList.add('revealed');
                        window.setTimeout(() => {
                            target.style.transitionDelay = '0s';
                        }, 760);
                        observer.unobserve(target);
                    });
                },
                { threshold: 0.1, rootMargin: '0px 0px -32px 0px' }
            );

            revealElements.forEach((el) => revealObserver.observe(el));
        }

        // Smooth rAF easeOutExpo Stat Counters
        const statsSection = document.querySelector('.stats-section');
        const counters = Array.from(document.querySelectorAll('.counter'));

        if (!statsSection || counters.length === 0) return;

        const animateCounters = () => {
            if (prefersReducedMotion()) {
                counters.forEach((counter) => {
                    counter.textContent = counter.dataset.target || '0';
                });
                return;
            }

            const duration = 1250;
            const startTime = performance.now();
            const targets = counters.map((el) => Number(el.dataset.target) || 0);

            const step = (now) => {
                const progress = clamp((now - startTime) / duration, 0, 1);
                const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);

                counters.forEach((counter, idx) => {
                    counter.textContent = String(Math.round(targets[idx] * eased));
                });

                if (progress < 1) {
                    window.requestAnimationFrame(step);
                }
            };

            window.requestAnimationFrame(step);
        };

        if ('IntersectionObserver' in window) {
            const statsObserver = new IntersectionObserver(
                (entries, observer) => {
                    for (const entry of entries) {
                        if (entry.isIntersecting) {
                            animateCounters();
                            observer.unobserve(entry.target);
                            break;
                        }
                    }
                },
                { threshold: 0.35 }
            );
            statsObserver.observe(statsSection);
        } else {
            animateCounters();
        }
    }

    /* ----------------------------------------------------------------------
       5. 3D Hero Orbital Parallax, GPU Cursor Glow, Card Tilt & Magnetics
       ---------------------------------------------------------------------- */
    function initSpatialPhysics() {
        if (!isFinePointer() || prefersReducedMotion()) return;

        // 5A. GPU Cursor Glow (Demand-Driven rAF Loop — Zero Idle CPU)
        const cursorGlow = document.getElementById('cursor-glow');
        if (cursorGlow) {
            let targetX = -999;
            let targetY = -999;
            let currentX = -999;
            let currentY = -999;
            let glowRaf = null;
            let visible = false;

            const animateGlow = () => {
                currentX = lerp(currentX, targetX, 0.16);
                currentY = lerp(currentY, targetY, 0.16);

                cursorGlow.style.setProperty('--cursor-x', `${currentX.toFixed(1)}px`);
                cursorGlow.style.setProperty('--cursor-y', `${currentY.toFixed(1)}px`);

                if (Math.abs(targetX - currentX) > 0.25 || Math.abs(targetY - currentY) > 0.25) {
                    glowRaf = window.requestAnimationFrame(animateGlow);
                } else {
                    glowRaf = null;
                }
            };

            window.addEventListener(
                'pointermove',
                (e) => {
                    if (!visible) {
                        currentX = e.clientX;
                        currentY = e.clientY;
                        cursorGlow.style.opacity = '1';
                        visible = true;
                    }
                    targetX = e.clientX;
                    targetY = e.clientY;
                    if (glowRaf === null) {
                        glowRaf = window.requestAnimationFrame(animateGlow);
                    }
                },
                { passive: true }
            );

            document.addEventListener('pointerleave', () => {
                visible = false;
                cursorGlow.style.opacity = '0';
            });
        }

        // 5B. Multi-Plane 3D Hero Command Center Parallax (Backplates, Monolith Glare & VisionOS HUDs)
        const heroSection = document.getElementById('hero');
        const heroStage = document.querySelector('.hero-3d-stage') || document.querySelector('.profile-showcase');
        const holoFrame = heroStage ? heroStage.querySelector('.holo-frame') : null;
        const compassHalo = heroStage ? heroStage.querySelector('.compass-halo') : null;
        const backplates = heroStage ? Array.from(heroStage.querySelectorAll('.arch-backplate')) : [];
        const hudBadges = heroStage ? Array.from(heroStage.querySelectorAll('.hud-badge[data-depth]')) : [];

        if (heroSection && heroStage) {
            let heroRect = null;
            let targetNx = 0;
            let targetNy = 0;
            let currentNx = 0;
            let currentNy = 0;
            let heroActive = false;
            let heroRaf = null;

            const resetHeroPlanes = () => {
                heroStage.classList.remove('is-tilting');
                heroStage.style.transform = '';

                if (compassHalo) {
                    compassHalo.style.transform = '';
                }

                backplates.forEach((panel) => {
                    panel.style.transform = '';
                });

                if (holoFrame) {
                    holoFrame.style.animation = '';
                    holoFrame.style.transform = '';
                    holoFrame.style.removeProperty('--hero-glare-x');
                    holoFrame.style.removeProperty('--hero-glare-y');
                }

                hudBadges.forEach((badge) => {
                    badge.style.animation = '';
                    badge.style.transform = '';
                });

                currentNx = 0;
                currentNy = 0;
                targetNx = 0;
                targetNy = 0;
            };

            const updateHeroStage = () => {
                currentNx = lerp(currentNx, targetNx, 0.11);
                currentNy = lerp(currentNy, targetNy, 0.11);

                const settled =
                    !heroActive &&
                    Math.abs(currentNx) < 0.004 &&
                    Math.abs(currentNy) < 0.004;

                if (settled || !isDesktopStage()) {
                    resetHeroPlanes();
                    heroRaf = null;
                    return;
                }

                // Master 3D Stage Tilt
                const rx = -currentNy * 8.5;
                const ry = currentNx * 11;
                heroStage.style.transform = `perspective(1200px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg)`;

                // Plane 1: Deep Compass Halo & Architectural Back-Panels (Inverse Depth Shift)
                if (compassHalo) {
                    const cx = -currentNx * 15;
                    const cy = -currentNy * 12;
                    compassHalo.style.transform = `translate3d(${cx.toFixed(1)}px, ${cy.toFixed(1)}px, -85px)`;
                }

                backplates.forEach((panel) => {
                    const isCode = panel.classList.contains('backplate-code');
                    const baseZ = Number(panel.dataset.depth) || (isCode ? -38 : -24);
                    const baseRot = isCode ? -6 : 5;
                    const factorX = isCode ? -19 : -16;
                    const factorY = isCode ? -14 : -12;
                    const px = currentNx * factorX;
                    const py = currentNy * factorY;
                    const rot = baseRot + (isCode ? -currentNx * 2.4 : currentNx * 2.4);
                    panel.style.transform = `translate3d(${px.toFixed(1)}px, ${py.toFixed(1)}px, ${baseZ}px) rotateZ(${rot.toFixed(2)}deg)`;
                });

                // Plane 2: Holographic Portrait Monolith + Dynamic Specular Glare
                if (holoFrame) {
                    const mx = currentNx * 7.5;
                    const my = currentNy * 5.5;
                    const glareX = clamp(50 + currentNx * 38, 12, 88);
                    const glareY = clamp(32 + currentNy * 36, 8, 86);
                    holoFrame.style.animation = 'none';
                    holoFrame.style.transform = `translate3d(${mx.toFixed(1)}px, ${my.toFixed(1)}px, 28px)`;
                    holoFrame.style.setProperty('--hero-glare-x', `${glareX.toFixed(1)}%`);
                    holoFrame.style.setProperty('--hero-glare-y', `${glareY.toFixed(1)}%`);
                }

                // Plane 3: Foreground VisionOS 3D Glass HUD Widgets (Amplified Parallax)
                hudBadges.forEach((badge) => {
                    const depth = Number(badge.dataset.depth) || 45;
                    const shiftX = currentNx * (depth * 0.34);
                    const shiftY = currentNy * (depth * 0.24);
                    badge.style.animation = 'none';
                    badge.style.transform = `translate3d(${shiftX.toFixed(1)}px, ${shiftY.toFixed(1)}px, ${depth}px)`;
                });

                heroRaf = window.requestAnimationFrame(updateHeroStage);
            };

            heroSection.addEventListener(
                'pointerenter',
                () => {
                    if (!isDesktopStage()) return;
                    heroRect = heroSection.getBoundingClientRect();
                    heroActive = true;
                    heroStage.classList.add('is-tilting');
                },
                { passive: true }
            );

            heroSection.addEventListener(
                'pointermove',
                (e) => {
                    if (!isDesktopStage()) return;
                    if (!heroRect) heroRect = heroSection.getBoundingClientRect();

                    targetNx = clamp(((e.clientX - heroRect.left) / Math.max(heroRect.width, 1) - 0.5) * 2, -1, 1);
                    targetNy = clamp(((e.clientY - heroRect.top) / Math.max(heroRect.height, 1) - 0.5) * 2, -1, 1);

                    heroActive = true;
                    heroStage.classList.add('is-tilting');

                    if (heroRaf === null) {
                        heroRaf = window.requestAnimationFrame(updateHeroStage);
                    }
                },
                { passive: true }
            );

            heroSection.addEventListener('pointerleave', () => {
                heroActive = false;
                heroRect = null;
                targetNx = 0;
                targetNy = 0;
                if (heroRaf === null) {
                    if (Math.abs(currentNx) > 0.004 || Math.abs(currentNy) > 0.004) {
                        heroRaf = window.requestAnimationFrame(updateHeroStage);
                    } else {
                        resetHeroPlanes();
                    }
                }
            });

            window.addEventListener(
                'scroll',
                () => {
                    heroRect = null;
                },
                { passive: true }
            );

            window.addEventListener(
                'resize',
                () => {
                    heroRect = null;
                    if (!isDesktopStage()) {
                        if (heroRaf !== null) {
                            window.cancelAnimationFrame(heroRaf);
                            heroRaf = null;
                        }
                        heroActive = false;
                        resetHeroPlanes();
                    }
                },
                { passive: true }
            );
        }

        // 5C. Zero-Lag Bento & Portfolio Card 3D Tilt + Cached Bounding Rects
        const tiltCards = Array.from(document.querySelectorAll('.bento-card, .portfolio-card'));
        const cardRectCache = new WeakMap();

        const invalidateCardRects = () => {
            tiltCards.forEach((card) => cardRectCache.delete(card));
        };

        window.addEventListener('scroll', invalidateCardRects, { passive: true });
        window.addEventListener('resize', invalidateCardRects, { passive: true });

        tiltCards.forEach((card) => {
            let pendingRaf = null;
            let pointerX = 0;
            let pointerY = 0;

            const applyTilt = () => {
                pendingRaf = null;
                const rect = cardRectCache.get(card);
                if (!rect || rect.width === 0 || rect.height === 0) return;

                const localX = pointerX - rect.left;
                const localY = pointerY - rect.top;

                card.style.setProperty('--x', `${localX.toFixed(1)}px`);
                card.style.setProperty('--y', `${localY.toFixed(1)}px`);

                const normX = clamp((localX / rect.width - 0.5) * 2, -1, 1);
                const normY = clamp((localY / rect.height - 0.5) * 2, -1, 1);
                const rotateX = (-normY * 5.2).toFixed(2);
                const rotateY = (normX * 5.2).toFixed(2);

                card.style.transform = `perspective(1000px) translateY(-8px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            };

            card.addEventListener(
                'pointerenter',
                () => {
                    if (!isDesktopStage()) return;
                    cardRectCache.set(card, card.getBoundingClientRect());
                    card.classList.add('is-tilting');
                },
                { passive: true }
            );

            card.addEventListener(
                'pointermove',
                (e) => {
                    if (!isDesktopStage()) return;
                    if (!cardRectCache.has(card)) {
                        cardRectCache.set(card, card.getBoundingClientRect());
                    }
                    pointerX = e.clientX;
                    pointerY = e.clientY;
                    if (pendingRaf === null) {
                        pendingRaf = window.requestAnimationFrame(applyTilt);
                    }
                },
                { passive: true }
            );

            card.addEventListener('pointerleave', () => {
                if (pendingRaf !== null) {
                    window.cancelAnimationFrame(pendingRaf);
                    pendingRaf = null;
                }
                cardRectCache.delete(card);
                card.classList.remove('is-tilting');
                card.style.transform = '';
            });
        });

        // 5D. Subtle Magnetic Pull on Primary CTAs
        const magneticButtons = Array.from(
            document.querySelectorAll('.btn-royal-gold, .btn-royal-blue, .btn-gold-sm, #concierge-whatsapp-btn')
        );
        const btnRectCache = new WeakMap();

        const invalidateBtnRects = () => {
            magneticButtons.forEach((btn) => btnRectCache.delete(btn));
        };

        window.addEventListener('scroll', invalidateBtnRects, { passive: true });
        window.addEventListener('resize', invalidateBtnRects, { passive: true });

        magneticButtons.forEach((btn) => {
            let btnRaf = null;
            let px = 0;
            let py = 0;

            const applyMagnetic = () => {
                btnRaf = null;
                const rect = btnRectCache.get(btn);
                if (!rect) return;
                const dx = (px - (rect.left + rect.width * 0.5)) * 0.14;
                const dy = (py - (rect.top + rect.height * 0.5)) * 0.18;
                btn.style.transform = `translate3d(${dx.toFixed(1)}px, ${(dy - 2).toFixed(1)}px, 0)`;
            };

            btn.addEventListener(
                'pointerenter',
                () => {
                    if (!isDesktopStage()) return;
                    btnRectCache.set(btn, btn.getBoundingClientRect());
                },
                { passive: true }
            );

            btn.addEventListener(
                'pointermove',
                (e) => {
                    if (!isDesktopStage()) return;
                    if (!btnRectCache.has(btn)) {
                        btnRectCache.set(btn, btn.getBoundingClientRect());
                    }
                    px = e.clientX;
                    py = e.clientY;
                    if (btnRaf === null) {
                        btnRaf = window.requestAnimationFrame(applyMagnetic);
                    }
                },
                { passive: true }
            );

            btn.addEventListener('pointerleave', () => {
                if (btnRaf !== null) {
                    window.cancelAnimationFrame(btnRaf);
                    btnRaf = null;
                }
                btnRectCache.delete(btn);
                btn.style.transform = '';
            });
        });
    }

    /* ----------------------------------------------------------------------
       6. Race-Condition-Free Portfolio Filtering (.filter-btn)
       ---------------------------------------------------------------------- */
    function initPortfolioFilters() {
        const portfolioGrid = document.querySelector('.portfolio-grid');
        const filterBtns = Array.from(document.querySelectorAll('.filter-btn'));
        const portfolioCards = Array.from(document.querySelectorAll('.portfolio-card'));
        if (filterBtns.length === 0 || portfolioCards.length === 0) return;

        let filterToken = 0;

        // Initialize ARIA states & grid filtered mode cleanly
        const initialActive = filterBtns.find((btn) => btn.classList.contains('active'));
        if (portfolioGrid) {
            const initialFilter = initialActive?.dataset.filter || 'all';
            portfolioGrid.classList.toggle('is-filtered', initialFilter !== 'all');
        }

        filterBtns.forEach((btn) => {
            const isActive = btn.classList.contains('active');
            btn.setAttribute('aria-pressed', String(isActive));
            btn.setAttribute('aria-selected', String(isActive));
        });

        filterBtns.forEach((btn) => {
            btn.addEventListener('click', () => {
                const selectedFilter = btn.dataset.filter || 'all';
                filterToken += 1;
                const currentToken = filterToken;

                if (portfolioGrid) {
                    portfolioGrid.classList.toggle('is-filtered', selectedFilter !== 'all');
                }

                filterBtns.forEach((other) => {
                    const isCurrent = other === btn;
                    other.classList.toggle('active', isCurrent);
                    other.setAttribute('aria-pressed', String(isCurrent));
                    other.setAttribute('aria-selected', String(isCurrent));
                });

                portfolioCards.forEach((card) => {
                    const matches = selectedFilter === 'all' || card.dataset.category === selectedFilter;

                    if (matches) {
                        const wasHidden = card.classList.contains('is-hidden');
                        card.classList.remove('is-hidden');
                        card.classList.add('revealed');
                        card.style.transitionDelay = '0s';
                        card.style.display = '';

                        if (wasHidden && !prefersReducedMotion()) {
                            card.style.opacity = '0';
                            card.style.transform = 'translateY(14px) scale(0.98)';
                            window.requestAnimationFrame(() => {
                                if (currentToken !== filterToken) return;
                                card.style.opacity = '1';
                                card.style.transform = '';
                                window.setTimeout(() => {
                                    if (currentToken === filterToken) {
                                        card.style.opacity = '';
                                    }
                                }, 320);
                            });
                        } else {
                            card.style.opacity = '';
                            card.style.transform = '';
                        }
                    } else if (prefersReducedMotion()) {
                        card.classList.add('is-hidden');
                        card.style.opacity = '';
                        card.style.transform = '';
                    } else {
                        card.style.opacity = '0';
                        card.style.transform = 'translateY(14px) scale(0.98)';
                        window.setTimeout(() => {
                            if (currentToken !== filterToken) return;
                            card.classList.add('is-hidden');
                            card.style.opacity = '';
                            card.style.transform = '';
                        }, 220);
                    }
                });
            });
        });
    }

    /* ----------------------------------------------------------------------
       7. Rich 3D Case-Study Modal (#project-modal)
       ---------------------------------------------------------------------- */
    function initProjectModal() {
        const modal = document.getElementById('project-modal');
        const portfolioCards = Array.from(document.querySelectorAll('.portfolio-card'));
        if (!modal || portfolioCards.length === 0) return;

        const closeBtn = modal.querySelector('.close-modal');
        const imageContainer = modal.querySelector('.modal-image-container');
        const modalImg = document.getElementById('modal-img');
        const modalCategory = document.getElementById('modal-category');
        const modalPlatform = document.getElementById('modal-platform');
        const modalTitle = document.getElementById('modal-title');
        const modalDesc = document.getElementById('modal-desc');
        const modalHighlights = document.getElementById('modal-highlights');
        const modalTags = document.getElementById('modal-tags');
        const modalLink = document.getElementById('modal-link');

        let lastTriggerEl = null;

        const openModalFromCard = (card) => {
            lastTriggerEl = card;

            const title = card.querySelector('.card-title')?.textContent?.trim() || '';
            const desc = card.querySelector('.card-excerpt')?.textContent?.trim() || '';
            const categoryText = card.querySelector('.floating-category')?.textContent?.trim() || '';
            const cardImg = card.querySelector('img');
            const href = card.getAttribute('href') || '#portfolio';
            const category = card.dataset.category || '';
            const platformBadge = card.dataset.platformBadge || '';
            const ctaLabel =
                card.dataset.ctaLabel ||
                (category === 'web' ? 'افتح الموقع اللايف' : 'حمّل التطبيق من Google Play');

            const highlights = (card.dataset.highlights || '')
                .split('|')
                .map((item) => item.trim())
                .filter(Boolean);

            const techItems = (card.dataset.tech || '')
                .split(',')
                .map((item) => item.trim())
                .filter(Boolean);

            // Media preview & light-logo studio pedestal parity
            if (modalImg && cardImg) {
                modalImg.src = cardImg.currentSrc || cardImg.getAttribute('src') || '';
                modalImg.alt = cardImg.alt || title;
            }
            if (imageContainer) {
                const isLightLogo = Boolean(card.querySelector('.screen-light-logo'));
                imageContainer.classList.toggle('is-light-logo', isLightLogo);
            }

            // Safely clear legacy #modal-tag bridge & populate #modal-category
            if (modalCategory) {
                modalCategory.textContent = categoryText;
            }

            if (modalPlatform) {
                modalPlatform.textContent = platformBadge;
            }

            if (modalTitle) {
                modalTitle.textContent = title;
            }

            if (modalDesc) {
                modalDesc.textContent = desc;
            }

            // Populate tailored case-study highlights safely
            if (modalHighlights) {
                const fragment = document.createDocumentFragment();
                highlights.forEach((point) => {
                    const li = document.createElement('li');
                    li.textContent = point;
                    fragment.appendChild(li);
                });
                modalHighlights.replaceChildren(fragment);
            }

            // Replace legacy #modal-tech-tags bridge cleanly with per-project tech pills
            if (modalTags) {
                const fragment = document.createDocumentFragment();
                techItems.forEach((tech) => {
                    const span = document.createElement('span');
                    span.textContent = tech;
                    fragment.appendChild(span);
                });
                modalTags.replaceChildren(fragment);
            }

            // Update external CTA link with verified href & appropriate icon
            if (modalLink) {
                modalLink.setAttribute('href', href);
                modalLink.setAttribute('rel', 'noopener noreferrer');

                const labelSpan = document.createElement('span');
                labelSpan.textContent = ctaLabel;

                const icon = document.createElement('i');
                icon.setAttribute('aria-hidden', 'true');
                icon.className = href.includes('play.google.com')
                    ? 'fa-brands fa-google-play'
                    : 'fa-solid fa-up-right-from-square';

                modalLink.replaceChildren(labelSpan, icon);
            }

            modal.classList.add('active');
            modal.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';

            if (closeBtn) {
                window.requestAnimationFrame(() => {
                    closeBtn.focus({ preventScroll: true });
                });
            }
        };

        const closeModal = () => {
            if (!modal.classList.contains('active')) return;
            modal.classList.remove('active');
            modal.setAttribute('aria-hidden', 'true');
            // Restore empty string so CSS overflow-x: clip remains intact
            document.body.style.overflow = '';

            if (lastTriggerEl && typeof lastTriggerEl.focus === 'function') {
                lastTriggerEl.focus({ preventScroll: true });
            }
            lastTriggerEl = null;
        };

        portfolioCards.forEach((card) => {
            card.addEventListener('click', (e) => {
                // Allow Ctrl/Cmd/Shift/Middle-click to open external URL directly in new tab
                if (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1) return;
                e.preventDefault();
                openModalFromCard(card);
            });
        });

        if (closeBtn) {
            closeBtn.addEventListener('click', closeModal);
        }

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                closeModal();
            }
        });
    }

    /* ----------------------------------------------------------------------
       8. Smart Project Configurator ("مستشار المشاريع الذكي" — 30 Seconds)
       ---------------------------------------------------------------------- */
    function initSmartConcierge() {
        const conciergeBox = document.getElementById('smart-concierge');
        if (!conciergeBox) return;

        const typeChips = Array.from(conciergeBox.querySelectorAll('.concierge-chip[data-group="type"]'));
        const priorityChips = Array.from(conciergeBox.querySelectorAll('.concierge-chip[data-group="priority"]'));
        const summaryEl = document.getElementById('concierge-summary');
        const whatsappBtn = document.getElementById('concierge-whatsapp-btn');

        if (typeChips.length === 0 || !whatsappBtn) return;

        const whatsappNumber = (whatsappBtn.dataset.whatsapp || '201201076502').replace(/\D/g, '');

        const getRecommendation = (projectType, priorities) => {
            const hasOffline = priorities.some(
                (p) => p.includes('من غير نت') || p.includes('أوفلاين') || p.includes('Offline')
            );

            switch (projectType) {
                case 'موقع طبي / عيادة':
                    return 'موقع عيادة د. عمرو الكيكي (واجهة طبية واضحة وحجز مباشر عالواتساب)';
                case 'سيستم سنتر أو منصة تعليمية':
                    return hasOffline
                        ? 'سيستم Nova Academy (موبايل + ويندوز أوفلاين) ومنصة د. أحمد رزق'
                        : 'منصة د. أحمد رزق وسيستم Nova Academy لإدارة السناتر';
                case 'سيستم حسابات وكاشير':
                    return 'Nova Academy ERP و Market Control (كاشير وحسابات ومخازن أوفلاين 100%)';
                case 'موقع شركة وهوية رقمية':
                    return 'موقع شركة Arkestra للمقاولات (واجهة فخمة وسريعة على الموبايل)';
                case 'تطبيق موبايل + كمبيوتر':
                default:
                    return 'سيستم Nova Academy (موبايل + ويندوز أوفلاين 100%)';
            }
        };

        const setChipState = (chip, selected) => {
            chip.classList.toggle('is-selected', selected);
            chip.classList.toggle('active', selected);
            chip.setAttribute('aria-pressed', String(selected));
        };

        const syncConciergeOutput = () => {
            const activeTypeChip =
                typeChips.find((c) => c.getAttribute('aria-pressed') === 'true') || typeChips[0];
            const selectedType = activeTypeChip ? activeTypeChip.dataset.value || '' : '';

            const selectedPriorities = priorityChips
                .filter((c) => c.getAttribute('aria-pressed') === 'true')
                .map((c) => c.dataset.value || '')
                .filter(Boolean);

            const recommendation = getRecommendation(selectedType, selectedPriorities);

            // Render live concise Egyptian summary + smart portfolio recommendation
            if (summaryEl) {
                const fragment = document.createDocumentFragment();

                const intro = document.createTextNode('اختيار ممتاز! أنسب نموذج قريب لطلبك في شغلنا هو ');
                const recStrong = document.createElement('strong');
                recStrong.textContent = recommendation;
                const outro = document.createTextNode(' — دوس تحت وابعتلي التفاصيل عالواتساب ونبدأ فوراً.');

                fragment.appendChild(intro);
                fragment.appendChild(recStrong);
                fragment.appendChild(outro);

                if (selectedPriorities.length > 0) {
                    const br = document.createElement('br');
                    const prioText = document.createTextNode(`المميزات اللي اخترتها (${selectedPriorities.length}): ${selectedPriorities.join(' • ')}`);
                    fragment.appendChild(br);
                    fragment.appendChild(prioText);
                }

                summaryEl.replaceChildren(fragment);
            }

            // Compose natural Egyptian client WhatsApp message
            const prioritiesText =
                selectedPriorities.length > 0
                    ? selectedPriorities.join(' + ')
                    : 'هنرتب أهم التفاصيل والمميزات مع بعض';

            const message = [
                'السلام عليكم يا باشمهندس، كنت حابب أتفاهم معاك في تنفيذ مشروع جديد:',
                `• نوع المشروع: ${selectedType}`,
                `• أهم المميزات المطلوبة: ${prioritiesText}`,
                'يا ريت تقولي التفاصيل والتكلفة المبدئية.'
            ].join('\n');

            whatsappBtn.setAttribute(
                'href',
                `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`
            );
        };

        // Single-select project type chips
        typeChips.forEach((chip) => {
            chip.addEventListener('click', () => {
                typeChips.forEach((other) => setChipState(other, other === chip));
                syncConciergeOutput();
            });
        });

        // Multi-select priority chips
        priorityChips.forEach((chip) => {
            chip.addEventListener('click', () => {
                const nextState = chip.getAttribute('aria-pressed') !== 'true';
                setChipState(chip, nextState);
                syncConciergeOutput();
            });
        });

        // Initial synchronization on load
        syncConciergeOutput();
    }

    /* ----------------------------------------------------------------------
       9. Upgraded Arabic Role Typewriter (.dynamic-role)
       ---------------------------------------------------------------------- */
    function initTypewriter() {
        const typedSpan = document.querySelector('.dynamic-role .typed-text');
        if (!typedSpan) return;

        const roles = [
            'تطبيقات أندرويد وبرامج ويندوز',
            'سيستم شغال 100% أوفلاين من غير عطل',
            'برامج حسابات وكاشير وإدارة سناتر',
            'مواقع ومنصات ويب تخطف عين العميل'
        ];

        if (prefersReducedMotion()) {
            typedSpan.textContent = roles[0];
            return;
        }

        const TYPING_MS = 62;
        const ERASING_MS = 32;
        const PAUSE_MS = 2100;
        const NEXT_MS = 380;

        let roleIndex = 0;
        let charIndex = 0;
        let isErasing = false;
        let timerId = null;

        const step = () => {
            if (document.hidden) {
                timerId = window.setTimeout(step, 500);
                return;
            }

            const currentRole = roles[roleIndex];

            if (!isErasing) {
                charIndex += 1;
                typedSpan.textContent = currentRole.slice(0, charIndex);

                if (charIndex >= currentRole.length) {
                    isErasing = true;
                    timerId = window.setTimeout(step, PAUSE_MS);
                } else {
                    timerId = window.setTimeout(step, TYPING_MS);
                }
            } else {
                charIndex -= 1;
                typedSpan.textContent = currentRole.slice(0, charIndex);

                if (charIndex <= 0) {
                    isErasing = false;
                    roleIndex = (roleIndex + 1) % roles.length;
                    timerId = window.setTimeout(step, NEXT_MS);
                } else {
                    timerId = window.setTimeout(step, ERASING_MS);
                }
            }
        };

        timerId = window.setTimeout(step, 450);

        window.addEventListener(
            'pagehide',
            () => {
                if (timerId !== null) window.clearTimeout(timerId);
            },
            { once: true }
        );
    }

    /* ----------------------------------------------------------------------
       10. Agency Facebook Deep-Link & PWA Installation / Service Worker
       ---------------------------------------------------------------------- */
    function initAgencyAndPWA() {
        const agencyLink = document.getElementById('agency-link');
        if (agencyLink) {
            agencyLink.addEventListener('click', (e) => {
                e.preventDefault();

                const pageId = '61590389177742';
                const webUrl = `https://www.facebook.com/profile.php?id=${pageId}`;
                const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

                if (isMobile) {
                    const fallbackTimer = window.setTimeout(() => {
                        if (!document.hidden) {
                            window.open(webUrl, '_blank', 'noopener,noreferrer');
                        }
                    }, 550);

                    const clearOnHide = () => {
                        if (document.hidden) {
                            window.clearTimeout(fallbackTimer);
                        }
                    };
                    document.addEventListener('visibilitychange', clearOnHide, { once: true });
                    window.location.href = `fb://profile/${pageId}`;
                } else {
                    window.open(webUrl, '_blank', 'noopener,noreferrer');
                }
            });
        }

        // Service Worker Registration
        if ('serviceWorker' in navigator) {
            const registerSW = () => {
                navigator.serviceWorker.register('./sw.js').catch(() => {
                    // Graceful silent fallback when offline or unsupported scope
                });
            };
            if (document.readyState === 'complete') {
                registerSW();
            } else {
                window.addEventListener('load', registerSW, { once: true });
            }
        }

        // PWA Install Prompt Handling
        let deferredPrompt = null;
        const installBtn = document.getElementById('install-btn');

        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            deferredPrompt = e;
            if (installBtn) {
                installBtn.style.display = 'inline-flex';
            }
        });

        window.addEventListener('appinstalled', () => {
            deferredPrompt = null;
            if (installBtn) {
                installBtn.style.display = 'none';
            }
        });

        if (installBtn) {
            installBtn.addEventListener('click', async () => {
                if (!deferredPrompt) return;
                deferredPrompt.prompt();
                try {
                    const choice = await deferredPrompt.userChoice;
                    if (choice && choice.outcome === 'accepted') {
                        installBtn.style.display = 'none';
                    }
                } catch {
                    // Ignore dismissed prompt errors
                } finally {
                    deferredPrompt = null;
                }
            });
        }
    }

    /* ----------------------------------------------------------------------
       Bootstrap
       ---------------------------------------------------------------------- */
    initPreloader();

    const boot = () => {
        initSpatialCanvas();
        initScrollAndNavigation();
        initRevealAndCounters();
        initSpatialPhysics();
        initPortfolioFilters();
        initProjectModal();
        initSmartConcierge();
        initTypewriter();
        initAgencyAndPWA();
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', boot, { once: true });
    } else {
        boot();
    }
})();
