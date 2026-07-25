/* =========================================
   1. تأثير الكتابة التلقائية
========================================= */
const textArray = [
    "مدير IT ومطور برمجيات 💻",
    "مطور تطبيقات Flutter (Offline Apps) 📱",
    "خريج كلية الأعمال - جامعة الإسكندرية 🎓",
    "مطور أنظمة الأتمتة والباك إند (Python) ⚡"
];

const typedTextSpan = document.querySelector(".typed-text");
const cursorSpan = document.querySelector(".cursor");

const typingDelay = 80;   
const erasingDelay = 40;  
const newTextDelay = 2000; 
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

document.addEventListener("DOMContentLoaded", function() {
    if (textArray.length) setTimeout(type, newTextDelay + 250);
});

/* =========================================
   2. تأثير الإضاءة التفاعلي مع الماوس على الكروت
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
   3. تشغيل عداد الأرقام التفاعلي (تم التحديث لـ IntersectionObserver للأداء الفائق)
========================================= */
const counters = document.querySelectorAll('.counter');
const statsSection = document.querySelector('.stats-section');

if (statsSection && counters.length > 0) {
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                counters.forEach(counter => {
                    const target = +counter.getAttribute('data-target');
                    const increment = target / 40; // سرعة العداد

                    const updateCount = () => {
                        const current = +counter.innerText.replace(/\D/g, ''); // جلب الرقم فقط
                        if (current < target) {
                            counter.innerText = Math.ceil(current + increment);
                            setTimeout(updateCount, 30);
                        } else {
                            counter.innerText = target + (target === 100 ? "%" : "+");
                        }
                    };
                    updateCount();
                });
                observer.unobserve(statsSection); // يشتغل مرة واحدة بس
            }
        });
    }, { threshold: 0.5 }); // يبدأ لما 50% من القسم يظهر

    observer.observe(statsSection);
}

/* =========================================
   4. خلفية الجسيمات التفاعلية (Particles)
========================================= */
const canvas = document.getElementById('particles-canvas');
if(canvas) {
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
}

/* =========================================
   5. شاشة التحميل (Preloader)
========================================= */
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    setTimeout(() => {
        if (preloader) {
            preloader.classList.add('preloader-hidden');
            // إزالة العنصر من الـ DOM بعد الاختفاء عشان ميأثرش على الكليكات
            setTimeout(() => preloader.style.display = 'none', 800);
        }
    }, 1500);
});

/* =========================================
   6. حركة مؤشر الماوس النيون
========================================= */
const cursorDot = document.querySelector('.cursor-dot');
const cursorOutline = document.querySelector('.cursor-outline');

if (cursorDot && cursorOutline && window.innerWidth > 900) {
    window.addEventListener('mousemove', (e) => {
        cursorDot.style.left = `${e.clientX}px`;
        cursorDot.style.top = `${e.clientY}px`;
        
        cursorOutline.style.left = `${e.clientX}px`;
        cursorOutline.style.top = `${e.clientY}px`;
    });

    document.querySelectorAll('a, button, .portfolio-card, .skill-card, .stat-card, .color-dot').forEach(element => {
        element.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
        element.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });
}

/* =========================================
   7. أزرار فلترة الأعمال الذكية (مُحسنة)
========================================= */
const filterBtns = document.querySelectorAll('.filter-btn');
const portfolioCards = document.querySelectorAll('.portfolio-card');

if (filterBtns.length > 0) {
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
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
   8. مغير ألوان النيون الملكي (Theme Switcher)
========================================= */
const switcherBtn = document.querySelector('.switcher-btn');
const themeSwitcher = document.querySelector('.theme-switcher');
const colorDots = document.querySelectorAll('.color-dot');

if (switcherBtn && themeSwitcher) {
    switcherBtn.addEventListener('click', () => {
        themeSwitcher.classList.toggle('open');
    });

    colorDots.forEach(dot => {
        dot.addEventListener('click', () => {
            colorDots.forEach(d => d.classList.remove('active'));
            dot.classList.add('active');

            const color = dot.getAttribute('data-color');
            const shadow = dot.getAttribute('data-shadow');

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
   9. نظام الـ Offline App (PWA) وتثبيت التطبيق
========================================= */
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(reg => console.log('[PWA] Service Worker Registered!'))
            .catch(err => console.log('[PWA] Error:', err));
    });
}

let deferredPrompt;
const installBtn = document.getElementById('install-btn');

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    if (installBtn) {
        installBtn.style.display = 'inline-block';
    }
});

if (installBtn) {
    installBtn.addEventListener('click', () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            deferredPrompt.userChoice.then((choiceResult) => {
                if (choiceResult.outcome === 'accepted') {
                    installBtn.style.display = 'none';
                }
                deferredPrompt = null;
            });
        }
    });
}
/* =========================================
   10. تأثير شاشة الـ Terminal التفاعلية (Geek Vibe)
========================================= */
const terminalBody = document.getElementById('terminal-body');

const terminalCommands = [
    "> Initializing AminOS v2.0...",
    "> Loading system modules: Flutter, Dart, Python...",
    "> Compiling robust Offline Architecture... [OK]",
    "> Establishing secure database connections... [OK]",
    "> Fetching recent project data: Market Control, Nova Academy...",
    "> Status: All systems highly optimized and ready.",
    "> root@amin-os:~# _"
];

let termLineIndex = 0;
let termCharIndex = 0;
let isTerminalAnimated = false;

function typeTerminalCommand() {
    if (termLineIndex < terminalCommands.length) {
        // إنشاء سطر جديد
        if (termCharIndex === 0) {
            const lineSpan = document.createElement('span');
            lineSpan.className = 'terminal-line';
            lineSpan.id = 'term-line-' + termLineIndex;
            terminalBody.insertBefore(lineSpan, document.querySelector('.terminal-cursor'));
        }
        
        const currentLine = document.getElementById('term-line-' + termLineIndex);
        
        // كتابة الحروف
        if (terminalCommands[termLineIndex] === "> root@amin-os:~# _" && termCharIndex === terminalCommands[termLineIndex].length - 1) {
            // تجاهل حرف الـ underscore الأخير عشان نعوضه بالـ CSS Cursor
        } else {
            currentLine.innerHTML += terminalCommands[termLineIndex].charAt(termCharIndex);
        }
        
        termCharIndex++;
        
        if (termCharIndex >= terminalCommands[termLineIndex].length) {
            termCharIndex = 0;
            termLineIndex++;
            setTimeout(typeTerminalCommand, 600); // انتظار نص ثانية قبل السطر اللي بعده
        } else {
            // سرعة كتابة عشوائية عشان تبان حقيقية (زي الهاكرز)
            const typeSpeed = Math.random() * 40 + 20;
            setTimeout(typeTerminalCommand, typeSpeed);
        }
    }
}

if (terminalBody) {
    const cursor = document.createElement('span');
    cursor.className = 'terminal-cursor';
    terminalBody.appendChild(cursor);

    // تشغيل التأثير فقط لما العميل ينزل ويوصل للقسم ده
    const termObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !isTerminalAnimated) {
                isTerminalAnimated = true;
                setTimeout(typeTerminalCommand, 500); // انتظار نص ثانية قبل بدء الكتابة
            }
        });
    }, { threshold: 0.3 });

    termObserver.observe(terminalBody);
}
/* =========================================
   11. الشاشة السينمائية (Cinematic Modal)
========================================= */
const modal = document.getElementById('project-modal');
const closeModal = document.querySelector('.close-modal');
const portfolioCardsClick = document.querySelectorAll('.portfolio-card');

if(modal && portfolioCardsClick.length > 0) {
    portfolioCardsClick.forEach(card => {
        card.addEventListener('click', function(e) {
            e.preventDefault(); 
            
            // سحب البيانات من الكارت
            const title = this.querySelector('h3').innerText;
            const desc = this.querySelector('p').innerText;
            const tagText = this.querySelector('.app-tag').innerText;
            const imgSrc = this.querySelector('img').src;
            const link = this.getAttribute('href');
            
            // السر هنا: بنسحب نوع المشروع الأصلي المخفي في الكود
            const category = this.getAttribute('data-category'); 
            
            // حقن البيانات في المودال
            document.getElementById('modal-title').innerText = title;
            document.getElementById('modal-desc').innerText = desc;
            document.getElementById('modal-tag').innerText = tagText;
            document.getElementById('modal-img').src = imgSrc;
            document.getElementById('modal-link').href = link;
            
            // تحديد التقنيات بناءً على تصنيف الكارت بشكل قاطع
            const techTags = document.getElementById('modal-tech-tags');
            techTags.innerHTML = ''; 
            
            if(category === 'web') {
                // لو التصنيف ويب سايت
                techTags.innerHTML = '<span>HTML5</span><span>CSS3</span><span>JavaScript</span><span>UI/UX</span>';
            } else {
                // لو أي تصنيف تاني (تطبيقات أو برامج)
                techTags.innerHTML = '<span>Flutter</span><span>Dart</span><span>SQLite</span><span>Offline Architecture</span>';
            }

            modal.classList.add('active');
            document.body.style.overflow = 'hidden'; 
        });
    });

    closeModal.addEventListener('click', () => {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto'; 
    });

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });
}
/* =========================================
   12. فتح صفحة رواد البرمجيات في تطبيق فيسبوك مباشرة (Deep Linking)
========================================= */
const agencyLink = document.getElementById('agency-link');

if (agencyLink) {
    agencyLink.addEventListener('click', function(e) {
        e.preventDefault(); // نمنع الزرار يشتغل بالطريقة العادية
        
        const pageId = '61590389177742'; // الـ ID بتاع صفحتك
        const webUrl = `https://www.facebook.com/profile.php?id=${pageId}`;
        
        // فحص نوع الجهاز (موبايل ولا كمبيوتر)
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

        if (isMobile) {
            // كود إجبار فتح تطبيق فيسبوك
            window.location.href = `fb://profile/${pageId}`;
            
            // لو العميل معندوش الأبلكيشن (أو مسحه)، يفتح المتصفح كبديل بعد نص ثانية
            setTimeout(() => {
                window.location.href = webUrl;
            }, 500);
        } else {
            // لو العميل فاتح من كمبيوتر، يفتح الصفحة في تاب جديد عادي
            window.open(webUrl, '_blank');
        }
    });
}
const aiVoiceBtn = document.getElementById('ai-voice-btn');
const aiAudio = document.getElementById('ai-audio');

if (aiVoiceBtn && aiAudio) {
    aiVoiceBtn.addEventListener('click', function(e) {
        e.preventDefault();
        
        if (aiAudio.paused) {
            aiAudio.play();
            aiVoiceBtn.classList.add('playing');
            aiVoiceBtn.innerHTML = '<span class="icon">🔊</span> جاري التشغيل...';
        } else {
            aiAudio.pause();
            aiAudio.currentTime = 0; 
            aiVoiceBtn.classList.remove('playing');
            aiVoiceBtn.innerHTML = '<span class="icon">🎙️</span> استمع للترحيب';
        }
    });

    aiAudio.addEventListener('ended', function() {
        aiVoiceBtn.classList.remove('playing');
        aiVoiceBtn.innerHTML = '<span class="icon">🎙️</span> استمع للترحيب';
    });
}
