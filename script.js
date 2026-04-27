/* ===========================
   SCRIPT.JS
   Shahriar Shipping Ltd
   =========================== */

document.addEventListener('DOMContentLoaded', () => {

    /* ——— HEADER SCROLL ——— */
    const header = document.getElementById('header');
    const topbar = document.getElementById('topbar');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        if (scrollY > 60) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Hide topbar on scroll down, show on scroll up
        if (scrollY > 100 && scrollY > lastScroll) {
            topbar.style.marginTop = `-${topbar.offsetHeight}px`;
            topbar.style.transition = 'margin-top 0.3s ease';
        } else {
            topbar.style.marginTop = '0';
        }
        lastScroll = scrollY;

        // Back to top visibility
        const btt = document.getElementById('backToTop');
        if (scrollY > 400) {
            btt.classList.add('visible');
        } else {
            btt.classList.remove('visible');
        }

        // Trigger counters when stats in view
        triggerCounters();
    });

    /* ——— HAMBURGER MENU ——— */
    const hamburger = document.getElementById('hamburger');
    const nav = document.getElementById('nav');
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('open');
        nav.classList.toggle('open');
    });
    // Close on nav link click
    nav.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('open');
            nav.classList.remove('open');
        });
    });

    /* ——— SMOOTH SCROLL + ACTIVE NAV ——— */
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');

    function setActiveNav() {
        let current = '';
        sections.forEach(sec => {
            const top = sec.offsetTop - header.offsetHeight - 20;
            if (window.scrollY >= top) current = sec.getAttribute('id');
        });
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) link.classList.add('active');
        });
    }
    window.addEventListener('scroll', setActiveNav);

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (!target) return;
            const offset = header.offsetHeight + 8;
            const top = target.getBoundingClientRect().top + window.scrollY - offset;
            window.scrollTo({ top, behavior: 'smooth' });
        });
    });

    /* ——— BACK TO TOP ——— */
    document.getElementById('backToTop').addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    /* ——— SCROLL REVEAL ——— */
    const revealEls = document.querySelectorAll(
        '.service-card, .fcard, .why-card, .team-card, .client-card, .mission-card, .process-step, .stat-item, .contact-item'
    );

    revealEls.forEach(el => el.classList.add('reveal'));

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, i * 80);
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    revealEls.forEach(el => revealObserver.observe(el));

    /* ——— COUNTER ANIMATION ——— */
    let countersTriggered = false;

    function animateCounter(el) {
        const target = parseInt(el.getAttribute('data-target'), 10);
        const duration = 1800;
        const step = target / (duration / 16);
        let current = 0;

        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                el.textContent = target;
                clearInterval(timer);
            } else {
                el.textContent = Math.floor(current);
            }
        }, 16);
    }

    function triggerCounters() {
        if (countersTriggered) return;
        const statsSection = document.querySelector('.stats-section');
        if (!statsSection) return;
        const rect = statsSection.getBoundingClientRect();
        if (rect.top < window.innerHeight - 100) {
            countersTriggered = true;
            document.querySelectorAll('.counter').forEach(animateCounter);
        }
    }
    triggerCounters(); // In case already in view

    /* ——— CONTACT FORM ——— */
    const contactForm = document.getElementById('contactForm');
    const formSuccess = document.getElementById('formSuccess');
    const submitBtn = document.getElementById('submitBtn');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Basic validation
            const fullName = document.getElementById('fullName').value.trim();
            const email = document.getElementById('email').value.trim();
            const message = document.getElementById('message').value.trim();

            if (!fullName || !email || !message) {
                shakeForm();
                return;
            }
            if (!isValidEmail(email)) {
                document.getElementById('email').style.borderColor = '#ef4444';
                document.getElementById('email').focus();
                return;
            }

            // Simulate form submission
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;

            setTimeout(() => {
                submitBtn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
                formSuccess.classList.add('show');
                contactForm.reset();
                setTimeout(() => {
                    submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
                    submitBtn.disabled = false;
                    formSuccess.classList.remove('show');
                }, 5000);
            }, 1500);
        });
    }

    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function shakeForm() {
        const form = document.getElementById('contactForm');
        form.style.animation = 'none';
        form.style.transform = 'translateX(-8px)';
        setTimeout(() => {
            form.style.transform = 'translateX(8px)';
            setTimeout(() => {
                form.style.transform = 'translateX(-5px)';
                setTimeout(() => {
                    form.style.transform = 'translateX(0)';
                    form.style.transition = 'transform 0.1s ease';
                }, 80);
            }, 80);
        }, 80);
    }

    /* ——— INPUT RESET BORDER COLOR ——— */
    document.querySelectorAll('.form-group input, .form-group select, .form-group textarea').forEach(input => {
        input.addEventListener('input', () => {
            input.style.borderColor = '';
        });
    });

    /* ——— HERO PARALLAX EFFECT ——— */
    const heroBg = document.querySelector('.hero-bg-img');
    if (heroBg) {
        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            if (scrollY < window.innerHeight) {
                heroBg.style.transform = `translateY(${scrollY * 0.3}px)`;
            }
        });
    }

    /* ——— FLOATING CARDS STAGGERED ENTRANCE ——— */
    const fcards = document.querySelectorAll('.fcard');
    const fcardObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const cards = entry.target.querySelectorAll('.fcard');
                cards.forEach((card, i) => {
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, i * 150);
                });
                fcardObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    const floatingWrapper = document.querySelector('.floating-cards');
    if (floatingWrapper) {
        fcards.forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        });
        fcardObserver.observe(floatingWrapper);
    }

    /* ——— SECTION BACKGROUND WATERMARK TEXT ——— */
    // Add decorative watermark numbers to process steps
    document.querySelectorAll('.process-step').forEach((step, i) => {
        const watermark = document.createElement('div');
        watermark.classList.add('step-watermark');
        watermark.textContent = `0${i + 1}`;
        watermark.style.cssText = `
      position:absolute; bottom:-10px; left:50%; transform:translateX(-50%);
      font-size:6rem; font-weight:900; color:rgba(11,27,53,0.03);
      font-family:var(--font-head); line-height:1; pointer-events:none; z-index:0;
    `;
        step.style.position = 'relative';
        step.appendChild(watermark);
    });

    /* ——— TYPEWRITER EFFECT for hero badge ——— */
    // Subtle pulsing on hero CTA
    const heroBtn = document.querySelector('.hero-actions .btn-primary');
    if (heroBtn) {
        setInterval(() => {
            heroBtn.style.boxShadow = '0 8px 35px rgba(255,125,68,0.6)';
            setTimeout(() => {
                heroBtn.style.boxShadow = '0 4px 20px rgba(255,125,68,0.35)';
            }, 600);
        }, 2000);
    }

    /* ——— SERVICE CARD TILT EFFECT ——— */
    document.querySelectorAll('.service-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -5;
            const rotateY = ((x - centerX) / centerX) * 5;
            card.style.transform = `translateY(-8px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
            card.style.transition = 'all 0.4s ease';
        });
    });

    console.log('✅ Shahriar Shipping Ltd — Website Loaded Successfully');
});
