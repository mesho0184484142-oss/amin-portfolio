/* ==========================================================================
   أمين رجب | رواد البرمجيات - المحرك التفاعلي (JavaScript)
   ========================================================================== */

/* 1. شاشة التحميل السينمائية (Preloader) */
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    setTimeout(() => {
        if (preloader) {
            preloader.classList.add('preloader-hidden');
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 600);
        }
    }, 900);
});

/* 2. تأثير الكتابة التلقائية الاحترافي (بدون إيموجيز) */
const textArray = [
    "مؤسس رواد البرمجيات وتطوير الأنظمة",
    "مهندس تطبيقات Flutter (Offline-First)",
    "متخصص في الأنظمة المحاسبية والإدارية",
    "تصميم وتطوير المواقع التعريفية للشركات"
];

const typedTextSpan = document.querySelector(".typed-text");
const typingDelay = 65;
const erasingDelay = 35;
const newTextDelay = 2200;
let textArrayIndex = 0;
let charIndex = 0;

function type() {
    if (!typedTextSpan) return;
    if (charIndex < textArray[textArrayIndex].length) {
        typedTextSpan.textContent += textArray[textArrayIndex].charAt(charIndex);
        charIndex++;
        setTimeout(type, typingDelay);
    } else {
        setTimeout(erase, newTextDelay);
    }
}

function erase() {
    if (!typedTextSpan) return;
    if (charIndex > 0) {
        typedTextSpan.textContent = textArray[textArrayIndex].substring(0, charIndex - 1);
        charIndex--;
        setTimeout(erase, erasingDelay);
    } else {
        textArrayIndex++;
        if (textArrayIndex >= textArray.length) textArrayIndex = 0;
        setTimeout(type, typingDelay + 400);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    if (textArray.length && typedTextSpan) {
        setTimeout(type, 1200);
    }
});

/* 3. قائمة الموبايل (Hamburger Menu) وتأثير الهيدر عند التمرير */
const menuToggle = document.getElementById('menu-toggle');
const navLinks = document.getElementById('nav-links');
const navItems = document.querySelectorAll('.nav-item');
const navbar = document.getElementById('navbar');

if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });

    // إغلاق القائمة تلقائياً عند اختيار أي قسم في الموبايل
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            navLinks.classList.remove('active');
        });
    });
}

// تغيير الرابط النشط في الهيدر حسب القسم الظاهر على الشاشة
const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;

    if (navbar) {
        if (scrollY > 50) {
            navbar.style.padding = '12px 0';
            navbar.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.5)';
        } else {
            navbar.style.padding = '16px 0';
            navbar.style.boxShadow = 'none';
        }
    }

    sections.forEach(current => {
        const sectionHeight = current.offsetHeight;
        const sectionTop = current.offsetTop - 140;
        const sectionId = current.getAttribute('id');
        const targetNav = document.querySelector(`.nav-links a[href*=${sectionId}]`);

        if (targetNav) {
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navItems.forEach(link => link.classList.remove('active'));
                targetNav.classList.add('active');
            }
        }
    });
});

/* 4. تأثير الإضاءة التفاعلية مع حركة الماوس على الكروت (Bento & Portfolio) */
document.querySelectorAll('.bento-card, .portfolio-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--x', `${x}px`);
        card.style.setProperty('--y', `${y}px`);
    });
});

/* 5. عداد الإحصائيات التفاعلي (IntersectionObserver) */
const counters = document.querySelectorAll('.counter');
const statsSection = document.querySelector('.stats-section');

if (statsSection && counters.length > 0) {
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                counters.forEach(counter => {
                    const target = +counter.getAttribute('data-target');
                    const increment = Math.max(1, Math.ceil(target / 35));

                    const updateCount = () => {
                        const current = +counter.innerText.replace(/\D/g, '');
                        if (current < target) {
                            counter.innerText = Math.min(target, current + increment);
                            setTimeout(updateCount, 35);
                        } else {
                            counter.innerText = target;
                        }
                    };
                    updateCount();
                });
                obs.unobserve(statsSection);
            }
        });
    }, { threshold: 0.4 });

    observer.observe(statsSection);
}

/* 6. فلترة سابقة الأعمال الذكية بنعومة */
const filterBtns = document.querySelectorAll('.filter-btn');
const portfolioCards = document.querySelectorAll('.portfolio-card');

if (filterBtns.length > 0) {
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            portfolioCards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');
                if (filterValue === 'all' || cardCategory === filterValue) {
                    card.style.display = 'flex';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 30);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(15px)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 280);
                }
            });
        });
    });
}

/* 7. نافذة عرض تفاصيل المشروع (Project Modal) المتوافقة مع الهيكل الجديد */
const modal = document.getElementById('project-modal');
const closeModal = document.querySelector('.close-modal');

if (modal && portfolioCards.length > 0) {
    portfolioCards.forEach(card => {
        card.addEventListener('click', function(e) {
            e.preventDefault();

            const titleEl = this.querySelector('.card-title') || this.querySelector('h3');
            const descEl = this.querySelector('.card-excerpt') || this.querySelector('p');
            const tagEl = this.querySelector('.floating-category') || this.querySelector('.app-tag');
            const imgEl = this.querySelector('img');
            const link = this.getAttribute('href');
            const category = this.getAttribute('data-category');

            if (titleEl) document.getElementById('modal-title').innerText = titleEl.innerText;
            if (descEl) document.getElementById('modal-desc').innerText = descEl.innerText;
            if (tagEl) document.getElementById('modal-tag').innerText = tagEl.innerText;
            if (imgEl) document.getElementById('modal-img').src = imgEl.src;

            const modalLink = document.getElementById('modal-link');
            if (modalLink) {
                modalLink.href = link;
                modalLink.innerHTML = category === 'web' 
                    ? 'زيارة الموقع الرسمي <i class="fa-solid fa-arrow-up-left"></i>'
                    : 'استعراض على Google Play <i class="fa-brands fa-google-play"></i>';
            }

            const techTags = document.getElementById('modal-tech-tags');
            if (techTags) {
                if (category === 'web') {
                    techTags.innerHTML = '<span>HTML5</span><span>CSS3</span><span>JavaScript</span><span>Responsive UI/UX</span><span>SEO Ready</span>';
                } else {
                    techTags.innerHTML = '<span>Flutter</span><span>Dart</span><span>Isar / Hive DB</span><span>Offline-First Architecture</span><span>Google Play</span>';
                }
            }

            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    const closeProjectModal = () => {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    };

    if (closeModal) {
        closeModal.addEventListener('click', closeProjectModal);
    }

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeProjectModal();
        }
    });

    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeProjectModal();
        }
    });
}

/* 8. فتح صفحة رواد البرمجيات في تطبيق فيسبوك مباشرة (Deep Linking) */
const agencyLink = document.getElementById('agency-link');

if (agencyLink) {
    agencyLink.addEventListener('click', function(e) {
        e.preventDefault();

        const pageId = '61590389177742';
        const webUrl = `https://www.facebook.com/profile.php?id=${pageId}`;
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

        if (isMobile) {
            window.location.href = `fb://profile/${pageId}`;
            setTimeout(() => {
                window.location.href = webUrl;
            }, 500);
        } else {
            window.open(webUrl, '_blank');
        }
    });
}

/* 9. نظام تطبيق الويب التقدمي (PWA) وتثبيت التطبيق */
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js')
            .then(() => console.log('[PWA] Service Worker Registered'))
            .catch(err => console.log('[PWA] Error:', err));
    });
}

let deferredPrompt;
const installBtn = document.getElementById('install-btn');

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    if (installBtn) {
        installBtn.style.display = 'inline-flex';
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
