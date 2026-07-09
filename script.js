// الجمل اللي هتبدل وتتكتب تلقائياً على الشاشة
const textArray = [
    "مدير IT ومطور برمجيات 💻",
    "مطور تطبيقات Flutter (Offline Apps) 📱",
    "خريج كلية الأعمال - جامعة الإسكندرية 🎓",
    "مطور أنظمة الأتمتة والباك إند (Python) ⚡"
];

const typedTextSpan = document.querySelector(".typed-text");
const cursorSpan = document.querySelector(".cursor");

const typingDelay = 80;   // سرعة الكتابة
const erasingDelay = 40;  // سرعة المسح
const newTextDelay = 2000; // وقت الانتظار قبل ما يمسح الجملة ويبدأ في اللي بعدها
let textArrayIndex = 0;
let charIndex = 0;

function type() {
    if (charIndex < textArray[textArrayIndex].length) {
        typedTextSpan.textContent += textArray[textArrayIndex].charAt(charIndex);
        charIndex++;
        setTimeout(type, typingDelay);
    } else {
        setTimeout(erase, newTextDelay);
    }
}

function erase() {
    if (charIndex > 0) {
        typedTextSpan.textContent = textArray[textArrayIndex].substring(0, charIndex - 1);
        charIndex--;
        setTimeout(erase, erasingDelay);
    } else {
        textArrayIndex++;
        if (textArrayIndex >= textArray.length) textArrayIndex = 0;
        setTimeout(type, typingDelay + 500);
    }
}

// تشغيل التأثير أول ما الصفحة تحمل
document.addEventListener("DOMContentLoaded", function() {
    if (textArray.length) setTimeout(type, newTextDelay + 250);
});
/* =========================================
   1. تأثير الإضاءة التفاعلي مع الماوس على الكروت
========================================= */
document.querySelectorAll('.skill-card, .portfolio-card, .contact-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--x', `${x}px`);
        card.style.setProperty('--y', `${y}px`);
    });
});

/* =========================================
   2. تشغيل عداد الأرقام التفاعلي عند الوصول إليه
========================================= */
const counters = document.querySelectorAll('.counter');
let animated = false;

window.addEventListener('scroll', () => {
    const statsSection = document.querySelector('.stats-section');
    if (!statsSection) return;
    
    const sectionPosition = statsSection.getBoundingClientRect().top;
    const screenPosition = window.innerHeight / 1.3;

    if (sectionPosition < screenPosition && !animated) {
        counters.forEach(counter => {
            const target = +counter.getAttribute('data-target');
            const count = +counter.innerText;
            const increment = target / 50;

            const updateCount = () => {
                const current = +counter.innerText;
                if (current < target) {
                    counter.innerText = Math.ceil(current + increment);
                    setTimeout(updateCount, 30);
                } else {
                    counter.innerText = target + (target === 100 ? "%" : "+");
                }
            };
            updateCount();
        });
        animated = true;
    }
});

/* =========================================
   3. خلفية الجسيمات التفاعلية (Particles)
========================================= */
const canvas = document.getElementById('particles-canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particlesArray = [];
const numberOfParticles = 60;

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 1;
        this.speedX = Math.random() * 1 - 0.5;
        this.speedY = Math.random() * 1 - 0.5;
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x > canvas.width || this.x < 0) this.speedX *= -1;
        if (this.y > canvas.height || this.y < 0) this.speedY *= -1;
    }
    draw() {
        ctx.fillStyle = 'rgba(0, 242, 254, 0.5)';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
    }
}

function initParticles() {
    particlesArray = [];
    for (let i = 0; i < numberOfParticles; i++) {
        particlesArray.push(new Particle());
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();
        for (let j = i; j < particlesArray.length; j++) {
            const dx = particlesArray[i].x - particlesArray[j].x;
            const dy = particlesArray[i].y - particlesArray[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < 100) {
                ctx.beginPath();
                ctx.strokeStyle = `rgba(0, 242, 254, ${0.15 - distance/700})`;
                ctx.lineWidth = 0.8;
                ctx.moveTo(particlesArray[i].x, particlesArray[i].y);
                ctx.lineTo(particlesArray[j].x, particlesArray[j].y);
                ctx.stroke();
                ctx.closePath();
            }
        }
    }
    requestAnimationFrame(animateParticles);
}

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initParticles();
});

initParticles();
animateParticles();
/* =========================================
   4. تشغيل شاشة التحميل المستقبلية (Preloader)
========================================= */
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    // تأخير بسيط لمدة ثانية ونص عشان العميل يستمتع بشكل التحميل
    setTimeout(() => {
        if (preloader) {
            preloader.classList.add('preloader-hidden');
        }
    }, 1500);
});

/* =========================================
   5. حركة مؤشر الماوس النيون المخصص
========================================= */
const cursorDot = document.querySelector('.cursor-dot');
const cursorOutline = document.querySelector('.cursor-outline');

if (cursorDot && cursorOutline) {
    window.addEventListener('mousemove', (e) => {
        const posX = e.clientX;
        const posY = e.clientY;

        // حركة النقطة الداخلية الفورية
        cursorDot.style.left = `${posX}px`;
        cursorDot.style.top = `${posY}px`;

        // حركة الدائرة الخارجية بنعومة
        cursorOutline.style.left = `${posX}px`;
        cursorOutline.style.top = `${posY}px`;
    });

    // تفاعل الماوس لما يقف على أي زرار أو لينك أو كارت
    document.querySelectorAll('a, button, .portfolio-card, .skill-card, .stat-card').forEach(element => {
        element.addEventListener('mouseenter', () => {
            document.body.classList.add('cursor-hover');
        });
        element.addEventListener('mouseleave', () => {
            document.body.classList.remove('cursor-hover');
        });
    });
}
/* =========================================
   6. تشغيل أزرار فلترة الأعمال الذكية
========================================= */
const filterBtns = document.querySelectorAll('.filter-btn');
const portfolioCards = document.querySelectorAll('.portfolio-card');

if (filterBtns.length > 0) {
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // إزالة الكلاس النشط من كل الأزرار ووضعه على الزرار المضغوط
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            portfolioCards.forEach(card => {
                if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                    card.style.display = 'flex';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

/* =========================================
   7. تشغيل مغير ألوان النيون الملكي (Theme Switcher)
========================================= */
const switcherBtn = document.querySelector('.switcher-btn');
const themeSwitcher = document.querySelector('.theme-switcher');
const colorDots = document.querySelectorAll('.color-dot');

if (switcherBtn && themeSwitcher) {
    // فتح وغلق صندوق الألوان عند الضغط على الأيقونة
    switcherBtn.addEventListener('click', () => {
        themeSwitcher.classList.toggle('open');
    });

    // تغيير ألوان الموقع بالكامل لايف عند اختيار لون
    colorDots.forEach(dot => {
        dot.addEventListener('click', () => {
            colorDots.forEach(d => d.classList.remove('active'));
            dot.classList.add('active');

            const color = dot.getAttribute('data-color');
            const shadow = dot.getAttribute('data-shadow');

            // حقن الألوان الجديدة للموقع في ثانية واحدة
            let styleTag = document.getElementById('dynamic-theme');
            if (!styleTag) {
                styleTag = document.createElement('style');
                styleTag.id = 'dynamic-theme';
                document.head.appendChild(styleTag);
            }

            styleTag.innerHTML = `
                .logo span, .neon-text, .hero-content h4, .badge, .stat-card h3,
                .app-tag, .click-hint, .btn-contact, .typed-text, .loading-text code,
                .skill-card h3, .portfolio-card h3 { color: ${color} !important; }
                .logo span, .neon-text, .stat-card h3, .typed-text, .loading-text code { text-shadow: 0 0 15px ${shadow} !important; }
                .section-title::after { background: linear-gradient(90deg, ${color}, #161b22) !important; box-shadow: 0 0 12px ${shadow} !important; }
                .btn-primary { background: linear-gradient(45deg, ${color}, #161b22) !important; box-shadow: 0 0 20px ${shadow} !important; }
                .btn-contact { border-color: ${color} !important; }
                .badge { background: ${shadow} !important; border-color: ${color} !important; }
                .app-tag { background: ${shadow} !important; }
                .image-frame { background: linear-gradient(135deg, ${color}, #161b22, #0d1117) !important; box-shadow: 0 10px 25px ${shadow} !important; }
                .card-image { background: linear-gradient(135deg, ${color}, #161b22) !important; }
                .stat-card { border-bottom-color: ${color} !important; }
                .cursor-dot { background-color: ${color} !important; box-shadow: 0 0 10px ${color} !important; }
                .cursor-outline { border-color: ${color} !important; }
                .cursor-hover .cursor-outline { border-color: ${color} !important; background: ${shadow} !important; }
                .spinner { border-top-color: ${color} !important; box-shadow: 0 0 20px ${shadow} !important; }
                .cursor { background-color: ${color} !important; box-shadow: 0 0 8px ${color} !important; }
                .filter-btn.active, .filter-btn:hover { background: ${color} !important; color: #0d1117 !important; box-shadow: 0 0 15px ${shadow} !important; border-color: ${color} !important; }
                .switcher-btn { border-color: ${color} !important; box-shadow: 0 0 15px ${shadow} !important; }
            `;
        });
    });
}
/* =========================================
   8. تشغيل نظام الـ Offline App (PWA) وتثبيت التطبيق
========================================= */
// تسجيل السيرفيس وركر
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(reg => console.log('[PWA] Service Worker Registered!', reg))
            .catch(err => console.log('[PWA] Error:', err));
    });
}

// إظهار زرار التثبيت والتعامل مع الضغطة
let deferredPrompt;
const installBtn = document.getElementById('install-btn');

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    if (installBtn) {
        installBtn.style.display = 'inline-block'; // إظهار الزرار للعميل
    }
});

if (installBtn) {
    installBtn.addEventListener('click', () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            deferredPrompt.userChoice.then((choiceResult) => {
                if (choiceResult.outcome === 'accepted') {
                    console.log('[PWA] User accepted the install prompt');
                    installBtn.style.display = 'none';
                }
                deferredPrompt = null;
            });
        }
    });
}