document.addEventListener('DOMContentLoaded', () => {

    /* ---------- Preloader ---------- */
    const preloader = document.getElementById('preloader');
    window.addEventListener('load', () => {
        setTimeout(() => preloader.classList.add('done'), 700);
    });
    // fallback in case load event is delayed
    setTimeout(() => preloader.classList.add('done'), 2200);

    /* ---------- Typing effect ---------- */
    const typingEl = document.getElementById('typingText');
    const phrases = [
        'Ini portofolio kami.',
        'Ini hasil kerja tim kami.',
        'Ini bukti kerja sama kami.'
    ];
    let phraseIndex = 0, charIndex = 0, deleting = false;

    function typeLoop() {
        const current = phrases[phraseIndex];
        if (!deleting) {
            charIndex++;
            typingEl.textContent = current.slice(0, charIndex);
            if (charIndex === current.length) {
                deleting = true;
                setTimeout(typeLoop, 1600);
                return;
            }
        } else {
            charIndex--;
            typingEl.textContent = current.slice(0, charIndex);
            if (charIndex === 0) {
                deleting = false;
                phraseIndex = (phraseIndex + 1) % phrases.length;
            }
        }
        setTimeout(typeLoop, deleting ? 35 : 55);
    }
    setTimeout(typeLoop, 900);

    /* ---------- Scroll progress bar ---------- */
    const progressBar = document.getElementById('scrollProgress');
    function updateProgress() {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        progressBar.style.width = pct + '%';
    }

    /* ---------- Navbar scrolled state ---------- */
    const navbar = document.getElementById('navbar');
    function updateNavbar() {
        if (window.scrollY > 40) navbar.classList.add('scrolled');
        else navbar.classList.remove('scrolled');
    }

    /* ---------- Back to top button ---------- */
    const toTopBtn = document.getElementById('toTop');
    function updateToTop() {
        if (window.scrollY > 500) toTopBtn.classList.add('show');
        else toTopBtn.classList.remove('show');
    }
    toTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    window.addEventListener('scroll', () => {
        updateProgress();
        updateNavbar();
        updateToTop();
        updateActiveNav();
    }, { passive: true });

    /* ---------- Mobile nav toggle ---------- */
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('open');
        navLinks.classList.toggle('open');
    });
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('open');
            navLinks.classList.remove('open');
        });
    });

    /* ---------- Active nav link on scroll ---------- */
    const sections = document.querySelectorAll('section[id]');
    const navItems = document.querySelectorAll('.nav-link');
    function updateActiveNav() {
        let current = sections[0].id;
        const offset = window.innerHeight * 0.35;
        sections.forEach(sec => {
            if (window.scrollY >= sec.offsetTop - offset) current = sec.id;
        });
        navItems.forEach(item => {
            item.classList.toggle('active', item.dataset.section === current);
        });
    }

    /* ---------- Reveal on scroll (IntersectionObserver) ---------- */
    const revealEls = document.querySelectorAll('[data-reveal]');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });
    revealEls.forEach(el => revealObserver.observe(el));

    /* ---------- Counter animation for stats ---------- */
    const statNums = document.querySelectorAll('.stat-num');
    const statObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCount(entry.target);
                statObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.6 });
    statNums.forEach(el => statObserver.observe(el));

    function animateCount(el) {
        const target = parseInt(el.dataset.count, 10);
        const suffix = el.dataset.suffix || '';
        const duration = 1400;
        const start = performance.now();
        function step(now) {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.round(eased * target) + suffix;
            if (progress < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
    }

    /* ---------- Lightweight particle background (hero only) ---------- */
    const canvas = document.getElementById('particles');
    const ctx = canvas.getContext('2d');
    let particles = [];
    const hero = document.querySelector('.hero');

    function resizeCanvas() {
        canvas.width = hero.offsetWidth;
        canvas.height = hero.offsetHeight;
    }

    function createParticles() {
        const count = Math.floor((canvas.width * canvas.height) / 22000);
        particles = Array.from({ length: count }, () => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            r: Math.random() * 1.6 + 0.4,
            vx: (Math.random() - 0.5) * 0.15,
            vy: (Math.random() - 0.5) * 0.15,
            alpha: Math.random() * 0.5 + 0.1
        }));
    }

    function drawParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            if (p.x < 0) p.x = canvas.width;
            if (p.x > canvas.width) p.x = 0;
            if (p.y < 0) p.y = canvas.height;
            if (p.y > canvas.height) p.y = 0;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(209,38,63,${p.alpha})`;
            ctx.fill();
        });
        requestAnimationFrame(drawParticles);
    }

    resizeCanvas();
    createParticles();
    drawParticles();
    window.addEventListener('resize', () => {
        resizeCanvas();
        createParticles();
    });

    /* Initial calls */
    updateProgress();
    updateNavbar();
    updateActiveNav();
});