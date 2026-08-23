/**
 * NEXUS — EXPERIMENTAL GAMING DIGITAL IDENTITY
 * script.js — Modular Vanilla JS Architecture & Canvas Engine
 */

document.addEventListener('DOMContentLoaded', () => {
    init();
});

const state = {
    mouse: { x: window.innerWidth / 2, y: window.innerHeight / 2, tx: window.innerWidth / 2, ty: window.innerHeight / 2, active: false },
    cursor: { x: window.innerWidth / 2, y: window.innerHeight / 2, currentX: window.innerWidth / 2, currentY: window.innerHeight / 2 },
    halo: { x: window.innerWidth / 2, y: window.innerHeight / 2, currentX: window.innerWidth / 2, currentY: window.innerHeight / 2 },
    preview: { x: window.innerWidth / 2, y: window.innerHeight / 2, currentX: window.innerWidth / 2, currentY: window.innerHeight / 2, active: false, name: '' },
    identityTilt: { x: 0, y: 0, tx: 0, ty: 0 },
    focusMode: false,
    reducedMotion: false,
    overdrive: false,
    avatarClicks: 0,
    avatarClickTimer: null,
    atmosphereState: 'CALM',
    links: [
        { id: "01", name: "Discord", subtitle: "Community", url: "https://discord.gg/mnqhgHgUmB", brand: "discord" },
        { id: "02", name: "YouTube", subtitle: "Gaming Content", url: "https://www.youtube.com/@imuhab", brand: "youtube" },
        { id: "03", name: "TikTok", subtitle: "Short Form", url: "https://www.tiktok.com/@imuhab", brand: "tiktok" },
        { id: "04", name: "Instagram", subtitle: "Social", url: "https://www.instagram.com/imuhab.mohamed", brand: "instagram" },
        { id: "05", name: "Kick", subtitle: "Live Streaming", url: "https://kick.com/imohab", brand: "kick" }
    ]
};

function init() {
    setupReducedMotion();
    setupOpeningSequence();
    renderProfile();
    renderLinks();
    setupClock();
    setupParticles();
    setupLighting();
    setupParallax();
    setupCursor();
    setupMagneticLinks();
    setupLinkPreview();
    setupCommandPalette();
    setupFocusMode();
    setupEasterEggs();
    setupVisibilityOptimization();
    setupKickLiveChecker();
}

/* 1. OPENING SEQUENCE */
function setupOpeningSequence() {
    if (state.reducedMotion) {
        document.getElementById('intro-curtain').style.display = 'none';
        document.getElementById('nexus-app').classList.add('revealed');
        return;
    }

    const curtain = document.getElementById('intro-curtain');
    setTimeout(() => {
        curtain.classList.add('fade-out');
        document.getElementById('nexus-app').classList.add('revealed');
        setTimeout(() => {
            curtain.remove();
        }, 800);
    }, 400);
}

/* 2. RENDER PROFILE METADATA */
function renderProfile() {}

/* 3. RENDER LINKS DYNAMICALLY & BIND REAL URLS */
function renderLinks() {
    const container = document.getElementById('nav-nodes-container');
    if (!container) return;
    
    const nodes = container.querySelectorAll('.nav-node');
    nodes.forEach((node, index) => {
        const linkData = state.links[index];
        if (linkData) {
            node.setAttribute('href', linkData.url);
            node.setAttribute('data-brand', linkData.brand);
            node.setAttribute('target', '_blank');
            node.setAttribute('rel', 'noopener noreferrer');
        }
    });
}

function triggerNodeAction(name) {
    const targetLink = state.links.find(l => l.name.toLowerCase() === name.toLowerCase());
    if (targetLink) {
        window.open(targetLink.url, '_blank');
    }
}

/* 4. LIVE CLOCK */
function setupClock() {
    const clockEl = document.getElementById('live-clock');
    if (!clockEl) return;

    setInterval(() => {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        clockEl.innerText = `${hours}:${minutes}:${seconds}`;
    }, 1000);
}

/* 5. GENERATIVE CANVAS PARTICLES & ATMOSPHERE */
function setupParticles() {
    const canvas = document.getElementById('nexus-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width, height;
    let particles = [];
    let particleCount = window.innerWidth < 768 ? 15 : 55;

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    class Particle {
        constructor() {
            this.reset();
        }
        reset() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.z = Math.random() * 3 + 0.5;
            this.vx = (Math.random() - 0.5) * 0.2;
            this.vy = (Math.random() - 0.5) * 0.2 - 0.05;
            this.radius = this.z * 0.7;
            this.alpha = Math.random() * 0.4 + 0.1;
        }
        update() {
            const speedFactor = state.overdrive ? 4 : 1;
            this.x += this.vx * speedFactor;
            this.y += this.vy * speedFactor;

            const dx = state.mouse.x - this.x;
            const dy = state.mouse.y - this.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 150) {
                const force = (150 - dist) / 150;
                this.x -= (dx / dist) * force * 0.8;
                this.y -= (dy / dist) * force * 0.8;
            }

            if (this.x < 0 || this.x > width || this.y < 0 || this.y > height) {
                this.reset();
            }
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            const currentAlpha = state.overdrive ? this.alpha * 2 : this.alpha;
            ctx.fillStyle = `rgba(182, 255, 0, ${currentAlpha})`;
            ctx.fill();
        }
    }

    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);
        drawGrid(ctx, width, height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animate);
    }
    animate();
}

function drawGrid(ctx, width, height) {
    if (window.innerWidth < 768 || state.reducedMotion) return;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.015)';
    ctx.lineWidth = 1;

    const vanishingX = width * 0.5 + (state.mouse.x - width * 0.5) * 0.05;
    const vanishingY = height * 0.5 + (state.mouse.y - height * 0.5) * 0.05;

    ctx.beginPath();
    ctx.moveTo(0, height);
    ctx.lineTo(vanishingX, vanishingY);
    ctx.lineTo(width, height);
    ctx.stroke();
}

/* 6. SPATIAL LIGHTING & MOUSE TRACKING */
function setupLighting() {
    window.addEventListener('mousemove', (e) => {
        state.mouse.tx = e.clientX;
        state.mouse.ty = e.clientY;
        state.mouse.active = true;
    });

    window.addEventListener('touchmove', (e) => {
        if (e.touches.length > 0) {
            state.mouse.tx = e.touches[0].clientX;
            state.mouse.ty = e.touches[0].clientY;
            state.mouse.active = true;
        }
    }, { passive: true });
}

/* 7. PARALLAX & IDENTITY TILT */
function setupParallax() {
    const identityObj = document.getElementById('identity-object');
    
    function loop() {
        state.mouse.x += (state.mouse.tx - state.mouse.x) * 0.12;
        state.mouse.y += (state.mouse.ty - state.mouse.y) * 0.12;

        if (identityObj && window.innerWidth > 1024 && !state.reducedMotion) {
            const centerX = window.innerWidth * 0.3;
            const centerY = window.innerHeight * 0.5;
            const dx = (state.mouse.x - centerX) / centerX;
            const dy = (state.mouse.y - centerY) / centerY;

            state.identityTilt.tx = dx * 6;
            state.identityTilt.ty = -dy * 6;

            state.identityTilt.x += (state.identityTilt.tx - state.identityTilt.x) * 0.1;
            state.identityTilt.y += (state.identityTilt.ty - state.identityTilt.y) * 0.1;

            identityObj.style.transform = `perspective(1000px) rotateY(${state.identityTilt.x}deg) rotateX(${state.identityTilt.y}deg)`;
        }

        requestAnimationFrame(loop);
    }
    loop();
}

/* 8. MAGNETIC CURSOR SYSTEM */
function setupCursor() {
    if (window.innerWidth <= 1024 || state.reducedMotion) return;

    const core = document.getElementById('cursor-core');
    const halo = document.getElementById('cursor-halo');
    const ring = document.getElementById('cursor-interaction-ring');

    function renderCursor() {
        state.cursor.currentX += (state.mouse.x - state.cursor.currentX) * 0.2;
        state.cursor.currentY += (state.mouse.y - state.cursor.currentY) * 0.2;

        state.halo.currentX += (state.mouse.x - state.halo.currentX) * 0.1;
        state.halo.currentY += (state.mouse.y - state.halo.currentY) * 0.1;

        if (core) core.style.transform = `translate(${state.cursor.currentX}px, ${state.cursor.currentY}px) translate(-50%, -50%)`;
        if (halo) halo.style.transform = `translate(${state.halo.currentX}px, ${state.halo.currentY}px) translate(-50%, -50%)`;
        if (ring) ring.style.transform = `translate(${state.halo.currentX}px, ${state.halo.currentY}px) translate(-50%, -50%)`;

        requestAnimationFrame(renderCursor);
    }
    renderCursor();
}

/* 9. MAGNETIC LINKS PHYSICS */
function setupMagneticLinks() {
    if (window.innerWidth <= 1024) return;

    const nodes = document.querySelectorAll('.nav-node');
    nodes.forEach(node => {
        node.addEventListener('mousemove', (e) => {
            const rect = node.getBoundingClientRect();
            const hx = rect.left + rect.width / 2;
            const hy = rect.top + rect.height / 2;
            const dx = e.clientX - hx;
            const dy = e.clientY - hy;

            node.style.transform = `translate(${dx * 0.15}px, ${dy * 0.15}px) rotate(${dx * 0.002}deg)`;
        });

        node.addEventListener('mouseleave', () => {
            node.style.transform = `translate(0px, 0px) rotate(0deg)`;
        });
    });
}

/* 10. LINK PREVIEW SYSTEM WITH BRAND THEME */
function setupLinkPreview() {
    if (window.innerWidth <= 1024) return;

    const previewBox = document.getElementById('link-preview-box');
    const targetNameEl = document.getElementById('preview-target-name');
    const nodes = document.querySelectorAll('.nav-node');

    nodes.forEach(node => {
        node.addEventListener('mouseenter', () => {
            const name = node.getAttribute('data-name');
            const linkObj = state.links.find(l => l.name.toLowerCase() === name.toLowerCase());
            const brand = linkObj ? linkObj.brand : 'discord';
            
            if (targetNameEl) targetNameEl.innerText = name.toUpperCase();
            if (previewBox) {
                previewBox.setAttribute('data-active-brand', brand);
                previewBox.classList.add('visible');
            }
            state.preview.active = true;
            state.preview.name = name;
        });

        node.addEventListener('mouseleave', () => {
            if (previewBox) {
                previewBox.classList.remove('visible');
                previewBox.removeAttribute('data-active-brand');
            }
            state.preview.active = false;
        });
    });

    window.addEventListener('mousemove', (e) => {
        if (state.preview.active && previewBox) {
            state.preview.x += (e.clientX - state.preview.x) * 0.15;
            state.preview.y += (e.clientY - state.preview.y) * 0.15;
            previewBox.style.left = `${state.preview.x}px`;
            previewBox.style.top = `${state.preview.y}px`;
        }
    });
}

/* 11. COMMAND SYSTEM (CTRL + K) */
function setupCommandPalette() {
    const backdrop = document.getElementById('command-palette-backdrop');
    const input = document.getElementById('command-input');
    const items = document.querySelectorAll('.command-item');

    function togglePalette(open) {
        if (!backdrop) return;
        if (open) {
            backdrop.classList.add('active');
            if (input) { input.value = ''; input.focus(); }
        } else {
            backdrop.classList.remove('active');
        }
    }

    window.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
            e.preventDefault();
            togglePalette(!backdrop.classList.contains('active'));
        } else if (e.key === 'Escape') {
            togglePalette(false);
            if (state.focusMode) toggleFocusMode(false);
        } else if (e.key.toLowerCase() === 'f' && document.activeElement !== input) {
            toggleFocusMode(!state.focusMode);
        }
    });

    if (backdrop) {
        backdrop.addEventListener('click', (e) => {
            if (e.target === backdrop) togglePalette(false);
        });
    }

    if (input) {
        input.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();
            items.forEach(item => {
                const label = item.querySelector('.cmd-label').innerText.toLowerCase();
                const desc = item.querySelector('.cmd-desc').innerText.toLowerCase();
                item.style.display = (label.includes(query) || desc.includes(query)) ? 'flex' : 'none';
            });
        });
    }

    items.forEach(item => {
        item.addEventListener('click', () => {
            executeCommand(item.getAttribute('data-action'));
            togglePalette(false);
        });
    });
}

function executeCommand(action) {
    if (action === 'focus') {
        toggleFocusMode(!state.focusMode);
    } else if (action === 'reduce-fx') {
        state.reducedMotion = !state.reducedMotion;
    } else {
        triggerNodeAction(action);
    }
}

/* 12. FOCUS MODE */
function toggleFocusMode(enable) {
    state.focusMode = enable;
    document.body.classList.toggle('focus-mode', enable);
}

/* 13. SECRET INTERACTION (EASTER EGG) */
function setupEasterEggs() {
    const avatar = document.getElementById('avatar-container');
    if (!avatar) return;

    avatar.addEventListener('click', () => {
        state.avatarClicks++;
        clearTimeout(state.avatarClickTimer);

        if (state.avatarClicks >= 5) {
            triggerOverdrive();
            state.avatarClicks = 0;
        } else {
            state.avatarClickTimer = setTimeout(() => { state.avatarClicks = 0; }, 1000);
        }
    });
}

function triggerOverdrive() {
    if (state.overdrive) return;
    state.overdrive = true;
    const root = document.documentElement;
    root.style.setProperty('--accent', '#FFFFFF');
    root.style.setProperty('--accent-glow', 'rgba(255, 255, 255, 0.3)');

    setTimeout(() => {
        root.style.setProperty('--accent', '#B6FF00');
        root.style.setProperty('--accent-glow', 'rgba(182, 255, 0, 0.15)');
        state.overdrive = false;
    }, 3000);
}

/* 14. REDUCED MOTION */
function setupReducedMotion() {
    state.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/* 15. VISIBILITY OPTIMIZATION */
function setupVisibilityOptimization() {}

/* 16. KICK LIVE CHECKER (FIXED UI BINDING) */
function setupKickLiveChecker() {
    const kickNode = document.querySelector('.nav-node[data-brand="kick"]');
    if (!kickNode) return;

    const subtitleEl = kickNode.querySelector('.node-subtitle');
    
    async function checkKickStatus() {
        try {
            const response = await fetch('/api/check-live');
            if (response.ok) {
                const data = await response.json();
                
                if (data.isLive === true) {
                    if (subtitleEl) {
                        subtitleEl.innerHTML = '<span style="color: #53FC18; font-weight: bold; text-shadow: 0 0 10px rgba(83,252,24,0.5);">● LIVE NOW — WATCH STREAM</span>';
                    }
                    kickNode.style.borderLeft = '2px solid #53FC18';
                    kickNode.style.paddingLeft = '10px';
                } else {
                    if (subtitleEl) {
                        subtitleEl.innerText = 'LIVE STREAMING';
                    }
                    kickNode.style.borderLeft = 'none';
                }
            }
        } catch (error) {
            console.log("Live check error:", error);
        }
    }

    checkKickStatus();
    setInterval(checkKickStatus, 30000);
}