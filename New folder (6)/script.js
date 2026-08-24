/**
 * NEXUS — EXPERIMENTAL GAMING DIGITAL IDENTITY
 * script.js — Modular Vanilla JS Architecture & Canvas Engine
 */

document.addEventListener('DOMContentLoaded', () => {
    init();
    initThemeSwitcher();
});

const state = {
    mouse: { x: window.innerWidth / 2, y: window.innerHeight / 2, tx: window.innerWidth / 2, ty: window.innerHeight / 2, active: false },
    cursor: { x: window.innerWidth / 2, y: window.innerHeight / 2, currentX: window.innerWidth / 2, currentY: window.innerHeight / 2 },
    halo: { x: window.innerWidth / 2, y: window.innerHeight / 2, currentX: window.innerWidth / 2, currentY: window.innerHeight / 2 },
    links: [
        { id: "01", name: "Discord", subtitle: "COMMUNITY", url: "https://discord.gg/mnqhgHgUmB", brand: "discord", handle: "MOHAB // COMMUNITY", avatar: "assets/avatar.jpg" },
        { id: "02", name: "YouTube", subtitle: "GAMING CONTENT", url: "https://www.youtube.com/@imuhab", brand: "youtube", handle: "@imuhab", avatar: "assets/avatar.jpg" },
        { id: "03", name: "TikTok", subtitle: "SHORT FORM", url: "https://www.tiktok.com/@imuhab", brand: "tiktok", handle: "@imuhab", avatar: "assets/mohab.jpg" },
        { id: "04", name: "Instagram", subtitle: "SOCIAL", url: "https://www.instagram.com/imuhab.mohamed", brand: "instagram", handle: "@imuhab.mohamed", avatar: "assets/mohab.jpg" },
        { id: "05", name: "Kick", subtitle: "LIVE STREAMING", url: "https://kick.com/imohab", brand: "kick", handle: "@imuhab", avatar: "assets/avatar.jpg" },
        { id: "06", name: "WHATSAPP CHANNEL", subtitle: "UPDATES & NEWS", url: "https://whatsapp.com/channel/0029VbDZYFdKQuJTEADDqc2w", brand: "whatsapp", handle: "WHATSAPP // BROADCAST", avatar: "assets/avatar.jpg" },
        { id: "07", name: "Donation", subtitle: "SUPPORT THE STREAM", url: "https://botrix.live/k/imohab/tip", brand: "donation", handle: "SUPPORT", avatar: "assets/avatar.jpg" }
    ]
};

async function init() {
    setupOpeningSequence();
    renderLinks();
    setupClock();
    setupParticles();
    setupLighting();
    setupCursor();
    setupMagneticLinks();
    setupPlatformCardPreview();
}

/* 1. OPENING SEQUENCE */
function setupOpeningSequence() {
    const curtain = document.getElementById('intro-curtain');
    setTimeout(() => {
        if (curtain) {
            curtain.classList.add('fade-out');
            setTimeout(() => curtain.remove(), 800);
        }
        const app = document.getElementById('nexus-app');
        if (app) app.classList.add('revealed');
    }, 400);
}

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

/* LIVE CLOCK */
function setupClock() {
    const clockEl = document.getElementById('live-clock');
    if (!clockEl) return;

    setInterval(() => {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        if (clockEl) clockEl.innerText = `${hours}:${minutes}:${seconds}`;
    }, 1000);
}

/* 2. GENERATIVE CANVAS PARTICLES */
function setupParticles() {
    const canvas = document.getElementById('nexus-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width, height;
    let particles = [];
    let particleCount = window.innerWidth < 768 ? 25 : 75;

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
            this.vx = (Math.random() - 0.5) * 0.4;
            this.vy = (Math.random() - 0.5) * 0.4;
            this.radius = this.z * 0.8;
            this.alpha = Math.random() * 0.6 + 0.3;
        }
        update() {
            this.x += this.vx;
            this.y += this.vy;

            const dx = state.mouse.x - this.x;
            const dy = state.mouse.y - this.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 180) {
                const force = (180 - dist) / 180;
                this.x -= (dx / dist) * force * 1.2;
                this.y -= (dy / dist) * force * 1.2;
            }

            if (this.x < 0 || this.x > width || this.y < 0 || this.y > height) {
                this.reset();
            }
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 0, 0, ${this.alpha})`;
            ctx.shadowColor = '#FF0000';
            ctx.shadowBlur = 6;
            ctx.fill();
            ctx.shadowBlur = 0;
        }
    }

    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);
        state.mouse.x += (state.mouse.tx - state.mouse.x) * 0.1;
        state.mouse.y += (state.mouse.ty - state.mouse.y) * 0.1;
        particles.forEach(p => { p.update(); p.draw(); });
        requestAnimationFrame(animate);
    }
    animate();
}

/* LIGHTING & MOUSE TRACKING */
function setupLighting() {
    window.addEventListener('mousemove', (e) => {
        state.mouse.tx = e.clientX;
        state.mouse.ty = e.clientY;
        state.mouse.active = true;
    });

    window.addEventListener('touchmove', (e) => {
        if (e.touches.length > 0) {
            state.mouse.tx = e.touches.clientX;
            state.mouse.ty = e.touches.clientY;
            state.mouse.active = true;
        }
    }, { passive: true });
}

/* CUSTOM CURSOR SYSTEM */
function setupCursor() {
    if (window.innerWidth <= 1024) return;

    const core = document.getElementById('cursor-core');
    const halo = document.getElementById('cursor-halo');

    function renderCursor() {
        state.cursor.currentX += (state.mouse.tx - state.cursor.currentX) * 0.25;
        state.cursor.currentY += (state.mouse.ty - state.cursor.currentY) * 0.25;

        state.halo.currentX += (state.mouse.tx - state.halo.currentX) * 0.12;
        state.halo.currentY += (state.mouse.ty - state.halo.currentY) * 0.12;

        if (core) core.style.transform = `translate(${state.cursor.currentX}px, ${state.cursor.currentY}px) translate(-50%, -50%)`;
        if (halo) halo.style.transform = `translate(${state.halo.currentX}px, ${state.halo.currentY}px) translate(-50%, -50%)`;

        requestAnimationFrame(renderCursor);
    }
    renderCursor();
}

/* MAGNETIC LINKS PHYSICS */
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

            node.style.transform = `translate(${dx * 0.15}px, ${dy * 0.15}px)`;
        });

        node.addEventListener('mouseleave', () => {
            node.style.transform = `translate(0px, 0px)`;
        });
    });
}

/* INTERACTIVE PLATFORM CARD PREVIEW */
function setupPlatformCardPreview() {
    if (window.innerWidth <= 1024) return;

    const container = document.getElementById('nav-nodes-container');
    const card = document.getElementById('holo-preview-card');
    const nameEl = document.getElementById('card-platform-name');
    const handleEl = document.getElementById('card-platform-handle');
    const avatarEl = document.getElementById('card-platform-avatar');
    const nodes = document.querySelectorAll('.nav-node');

    nodes.forEach((node, index) => {
        const linkData = state.links[index];

        node.addEventListener('mouseenter', () => {
            if (container) container.classList.add('has-hover');

            if (linkData && card) {
                nameEl.innerText = linkData.name.toUpperCase();
                handleEl.innerHTML = linkData.subtitle;
                avatarEl.src = linkData.avatar;

                card.setAttribute('data-active-brand', linkData.brand);

                const rect = node.getBoundingClientRect();
                card.style.left = `${rect.left - 300}px`;
                card.style.top = `${rect.top - 15}px`;
                card.classList.add('visible');
            }
        });

        node.addEventListener('mouseleave', () => {
            if (container) container.classList.remove('has-hover');
            if (card) {
                card.classList.remove('visible');
                card.removeAttribute('data-active-brand');
            }
        });
    });
}

/* THEME SWITCHER (DARK / LIGHT MODE) */
function initThemeSwitcher() {
    const themeBtn = document.getElementById('theme-toggle-btn');
    const htmlEl = document.documentElement;
    const btnText = themeBtn ? themeBtn.querySelector('.btn-glitch-text') : null;

    const savedTheme = localStorage.getItem('nexus_theme') || 'dark';
    if (savedTheme === 'light') {
        htmlEl.setAttribute('data-theme', 'light');
        if (btnText) btnText.innerText = 'MODE: DARK';
    } else {
        htmlEl.removeAttribute('data-theme');
        if (btnText) btnText.innerText = 'MODE: LIGHT';
    }

    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            if (htmlEl.getAttribute('data-theme') === 'light') {
                htmlEl.removeAttribute('data-theme');
                localStorage.setItem('nexus_theme', 'dark');
                if (btnText) btnText.innerText = 'MODE: LIGHT';
            } else {
                htmlEl.setAttribute('data-theme', 'light');
                localStorage.setItem('nexus_theme', 'light');
                if (btnText) btnText.innerText = 'MODE: DARK';
            }
        });
    }
}

/* KICK LIVE CHECKER */
window.addEventListener('load', () => {
    setTimeout(checkKickStatus, 300);
});

async function checkKickStatus() {
    const holoWidget = document.getElementById('hologram-live-widget');
    const holoTitle = document.getElementById('holo-stream-title');
    const holoDot = document.getElementById('holo-dot');
    const holoScreenFrame = document.getElementById('holo-screen-frame');
    const holoFooterText = document.getElementById('holo-footer-text');
    const viewersBadge = document.getElementById('holo-viewers-badge');
    const viewerCountEl = document.getElementById('viewer-count');
    
    const topStatusDot = document.getElementById('top-status-dot');
    const topStatusText = document.getElementById('top-status-text');
    const kickNode = document.querySelector('.nav-node[data-brand="kick"]');
    const kickTitle = kickNode ? kickNode.querySelector('.node-title') : null;
    
    if (!holoWidget) return;
    
    holoWidget.onclick = () => {
        window.open('https://kick.com/imohab', '_blank');
    };

    try {
        const response = await fetch('/api/check-live');
        if (response.ok) {
            const data = await response.json();
            
            if (data.isLive === true) {
                if (kickTitle) {
                    kickTitle.innerHTML = 'KICK <span class="live-glow-text" style="font-size: 0.6rem; background: rgba(83,252,24,0.15); padding: 2px 6px; border-radius: 4px; vertical-align: middle; margin-left: 8px;">● LIVE NOW</span>';
                }

                state.links[4].subtitle = '<span class="live-glow-text">● LIVE NOW - JOIN STREAM</span>';

                if (holoDot) holoDot.classList.add('is-live');
                if (holoTitle) {
                    holoTitle.classList.add('is-live');
                    holoTitle.innerText = data.title ? data.title.toUpperCase() : 'KICK LIVE STREAM';
                }
                if (holoFooterText) holoFooterText.innerText = 'CLICK TO JOIN STREAM';

                if (viewersBadge && viewerCountEl && data.viewers > 0) {
                    viewerCountEl.innerText = data.viewers;
                    viewersBadge.style.display = 'flex';
                } else if (viewersBadge) {
                    viewersBadge.style.display = 'none';
                }

                if (topStatusDot) topStatusDot.classList.add('is-live');
                if (topStatusText) {
                    topStatusText.innerText = 'LIVE NOW';
                    topStatusText.style.color = '#108035';
                    topStatusText.style.textShadow = '0 0 8px rgba(16, 128, 53, 0.4)';
                }

                if (holoScreenFrame && !holoScreenFrame.querySelector('iframe')) {
                    holoScreenFrame.innerHTML = '<iframe src="https://player.kick.com/imohab?muted=true" frameborder="0" scrolling="no" allowfullscreen></iframe>';
                }
            } else {
                if (kickTitle) {
                    kickTitle.innerText = 'KICK';
                }
                state.links[4].subtitle = "LIVE STREAMING";

                if (holoDot) holoDot.classList.remove('is-live');
                if (holoTitle) {
                    holoTitle.classList.remove('is-live');
                    holoTitle.innerText = 'OFFLINE / STANDBY';
                }
                if (holoFooterText) holoFooterText.innerText = 'STANDBY MODE';

                if (viewersBadge) viewersBadge.style.display = 'none';

                if (topStatusDot) topStatusDot.classList.remove('is-live');
                if (topStatusText) {
                    topStatusText.innerText = 'OFFLINE';
                    topStatusText.style.color = '#FF0000';
                    topStatusText.style.textShadow = '0 0 8px rgba(255, 0, 0, 0.3)';
                }

                const iframe = holoScreenFrame?.querySelector('iframe');
                if (iframe) {
                    holoScreenFrame.innerHTML = `
                        <div class="offline-placeholder" id="offline-placeholder">
                            <span>STREAM OFFLINE</span>
                            <p>CLICK TO VISIT CHANNEL</p>
                        </div>
                    `;
                }
            }
        }
    } catch (error) {
        if (viewersBadge) viewersBadge.style.display = 'none';
    }
}

setInterval(checkKickStatus, 30000);