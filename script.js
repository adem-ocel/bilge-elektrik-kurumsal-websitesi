// Mobile Menu Toggle
const menuToggle = document.getElementById('menu-toggle');
const menuClose = document.getElementById('menu-close');
const mobileMenu = document.getElementById('mobile-menu');
const navLinks = document.querySelectorAll('.mobile-nav-link');

if (menuToggle && menuClose && mobileMenu) {
    function toggleMenu() {
        if (mobileMenu.classList.contains('mobile-menu-hidden')) {
            mobileMenu.classList.remove('mobile-menu-hidden');
            mobileMenu.classList.add('mobile-menu-visible');
            document.body.style.overflow = 'hidden';
        } else {
            mobileMenu.classList.add('mobile-menu-hidden');
            mobileMenu.classList.remove('mobile-menu-visible');
            document.body.style.overflow = 'auto';
        }
    }

    menuToggle.addEventListener('click', toggleMenu);
    menuClose.addEventListener('click', toggleMenu);
    if (navLinks) {
        navLinks.forEach(link => link.addEventListener('click', toggleMenu));
    }
}

// Form Validation & Mock Submission
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const contactInfo = document.getElementById('contact_info').value;
        const message = document.getElementById('message').value;

        if (!name || !contactInfo || !message) {
            alert('Lütfen tüm alanları doldurun.');
            return;
        }

        alert(`Sayın ${name}, mesajınız alınmıştır. En kısa sürede sizinle iletişime geçeceğiz.`);
        contactForm.reset();
    });
}

// Smooth Scrolling for all internal links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Career Form Submission
const careerForm = document.getElementById('careerForm');
if (careerForm) {
    careerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        alert('Başvurunuz alındı. İnsan Kaynakları ekibimiz en kısa sürede sizinle iletişime geçecektir.');
        this.reset();
    });
}

// Supplier Form Submission
const supplierForm = document.getElementById('supplierForm');
if (supplierForm) {
    supplierForm.addEventListener('submit', function(e) {
        e.preventDefault();
        alert('Başvurunuz sisteme kaydedildi. İlginiz için teşekkür ederiz.');
        this.reset();
    });
}
// Scroll Reveal Observer
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
        }
    });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// Swiper Initialization & Filtering
let projectSwiper;
const projectWrapper = document.getElementById('project-list');
const projectTemplates = Array.from(document.querySelectorAll('.swiper-slide')); // Store original slides

function initSwiper() {
    if (document.querySelector('.projectSwiper')) {
        if (projectSwiper) projectSwiper.destroy(true, true);
        
        projectSwiper = new Swiper(".projectSwiper", {
            slidesPerView: 1,
            spaceBetween: 30,
            centeredSlides: true,
            loop: false, // Disabling loop for cleaner filtering
            autoplay: {
                delay: 4000,
                disableOnInteraction: false,
            },
            pagination: {
                el: ".swiper-pagination",
                clickable: true,
            },
            navigation: {
                nextEl: ".swiper-button-next",
                prevEl: ".swiper-button-prev",
            },
            breakpoints: {
                768: { slidesPerView: 1.5 },
                1024: { slidesPerView: 2 }
            }
        });
    }
}

// Project Filtering Logic
const filterButtons = document.querySelectorAll('.filter-btn');

filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const filter = btn.getAttribute('data-filter');

        // Update active class
        filterButtons.forEach(b => {
            b.classList.remove('filter-btn-active', 'text-white');
            b.classList.add('text-gray-500');
        });
        btn.classList.add('filter-btn-active', 'text-white');
        btn.classList.remove('text-gray-500');

        // Clear and rebuild slider content
        if (projectWrapper) {
            projectWrapper.innerHTML = ''; // Full clear
            projectTemplates.forEach(slide => {
                const category = slide.getAttribute('data-category');
                if (filter === 'all' || filter === category) {
                    projectWrapper.appendChild(slide.cloneNode(true));
                }
            });
            initSwiper(); // Re-init with new slides
        }
    });
});

// Initial load
initSwiper();

// Dynamic Counter Animation
const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const target = entry.target;
            const countTo = parseInt(target.getAttribute('data-target'));
            let currentCount = 0;
            const duration = 2000; // Animation duration in ms
            const stepTime = 1000 / 60; // 60fps
            const totalSteps = duration / stepTime;
            const increment = countTo / totalSteps;

            const updateCount = () => {
                currentCount += increment;
                if (currentCount < countTo) {
                    target.innerText = Math.floor(currentCount);
                    requestAnimationFrame(updateCount);
                } else {
                    target.innerText = countTo;
                }
            };
            
            updateCount();
            counterObserver.unobserve(target); // Animate only once
        }
    });
}, { threshold: 0.5 }); // Start when 50% visible

document.querySelectorAll('.counter').forEach(el => counterObserver.observe(el));

// FAQ Toggle Function
function toggleFAQ(button) {
    const answer = button.nextElementSibling;
    const icon = button.querySelector('i');
    
    // Close other FAQs
    document.querySelectorAll('.faq-answer').forEach(el => {
        if (el !== answer) {
            el.style.maxHeight = null;
            const otherIcon = el.previousElementSibling.querySelector('i');
            if (otherIcon) otherIcon.classList.replace('fa-minus', 'fa-plus');
        }
    });

    if (answer.style.maxHeight) {
        answer.style.maxHeight = null;
        icon.classList.replace('fa-minus', 'fa-plus');
    } else {
        answer.style.maxHeight = answer.scrollHeight + "px";
        icon.classList.replace('fa-plus', 'fa-minus');
    }
}
// WhatsApp Button Scroll Manager
// WhatsApp Button Scroll Manager
function updateWhatsappPosition() {
    const whatsappBtn = document.getElementById('whatsapp-btn');
    const copyright = document.getElementById('copyright');
    
    if (!whatsappBtn || !copyright) return;
    
    const copyrightRect = copyright.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const baseOffset = 10; 

    if (copyrightRect.top < windowHeight) {
        const pushAmount = windowHeight - copyrightRect.top;
        whatsappBtn.style.bottom = (pushAmount + baseOffset) + 'px';
    } else {
        whatsappBtn.style.bottom = baseOffset + 'px';
    }
}

window.addEventListener('scroll', updateWhatsappPosition);
updateWhatsappPosition(); // Run on initial load
