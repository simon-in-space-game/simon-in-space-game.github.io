// Respect the user's motion preference.
const prefersReducedMotion =
    window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Generate random stars
function generateStars() {
    const starsContainer = document.getElementById('stars');
    if (!starsContainer) return;

    let starCount = window.innerWidth > 1024 ? 120 : 60;
    if (prefersReducedMotion) starCount = Math.round(starCount / 3);

    const frag = document.createDocumentFragment();
    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.className = 'star' + (!prefersReducedMotion && Math.random() > 0.65 ? ' twinkle' : '');
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';
        star.style.animationDelay = Math.random() * 3 + 's';
        frag.appendChild(star);
    }
    starsContainer.appendChild(frag);
}

generateStars();

// --- Section (hash) navigation -------------------------------------------------

// Which content sections are visible for each route.
const SECTION_MAP = {
    home: ['home-section', 'video-section', 'binnacle-section', 'features-section', 'download-section'],
    video: ['video-section'],
    privacy: ['privacy-section'],
    terms: ['terms-section'],
    download: ['download-section'],
};

function activateRoute(route) {
    const ids = SECTION_MAP[route] || SECTION_MAP.home;
    document.querySelectorAll('.content-section').forEach((section) => {
        section.classList.toggle('active', ids.includes(section.id));
    });
}

function showSection(route) {
    activateRoute(route);
    window.scrollTo(0, 0);
    toggleMenu(false);
    window.history.pushState(null, '', '#' + route);
}

function handleHashNavigation() {
    const route = window.location.hash.slice(1) || 'home';
    activateRoute(SECTION_MAP[route] ? route : 'home');
}

handleHashNavigation();
window.addEventListener('hashchange', handleHashNavigation);

// --- Mobile menu -------------------------------------------------------------

function toggleMenu(force = null) {
    const navLinks = document.getElementById('navLinks');
    const toggle = document.getElementById('menuToggle');
    if (!navLinks) return;

    const open = force === false ? false : (force === true ? true : !navLinks.classList.contains('active'));
    navLinks.classList.toggle('active', open);
    if (toggle) {
        toggle.setAttribute('aria-expanded', String(open));
        toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    }
}

document.addEventListener('click', function (event) {
    const nav = document.querySelector('nav');
    if (nav && !nav.contains(event.target)) toggleMenu(false);
});

window.addEventListener('resize', () => {
    if (window.innerWidth > 768) toggleMenu(false);
});

// --- CTA buttons ------------------------------------------------------------

function scrollToId(id) {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' });
}

function downloadApp() {
    scrollToId('download-section');
}

function learnMore() {
    scrollToId('features-section');
}

// --- YouTube trailer facade (load the iframe only on click) ------------------

document.addEventListener('DOMContentLoaded', () => {
    const year = document.getElementById('year');
    if (year) year.textContent = String(new Date().getFullYear());

    const facade = document.getElementById('videoFacade');
    if (!facade) return;

    facade.addEventListener('click', () => {
        const id = facade.dataset.video;
        const iframe = document.createElement('iframe');
        iframe.src =
            'https://www.youtube-nocookie.com/embed/' + id +
            '?autoplay=1&rel=0&modestbranding=1';
        iframe.title = 'Simon in Space trailer';
        iframe.allow = 'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture';
        iframe.allowFullscreen = true;
        iframe.loading = 'lazy';
        iframe.className = 'video-frame';
        facade.replaceWith(iframe);
    });
});
