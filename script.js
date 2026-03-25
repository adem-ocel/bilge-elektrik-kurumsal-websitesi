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

// Premium Notification System
function showNotification(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `fixed top-4 right-4 z-[9999] px-6 py-4 rounded-lg shadow-2xl transform transition-all duration-500 translate-x-full opacity-0 flex items-center space-x-3 backdrop-blur-md border ${type === 'success' ? 'bg-[#0f172a]/95 border-[#d4af37]' : 'bg-red-900/95 border-red-500'}`;
    
    const icon = type === 'success' 
        ? '<i class="fas fa-check-circle text-[#d4af37] text-xl"></i>' 
        : '<i class="fas fa-exclamation-circle text-red-500 text-xl"></i>';
        
    toast.innerHTML = `
        ${icon}
        <p class="text-white text-sm font-medium tracking-wide">${message}</p>
    `;
    
    document.body.appendChild(toast);
    
    // Animate in
    requestAnimationFrame(() => {
        setTimeout(() => {
            toast.classList.remove('translate-x-full', 'opacity-0');
            toast.classList.add('translate-x-0', 'opacity-100');
        }, 10);
    });
    
    // Animate out
    setTimeout(() => {
        toast.classList.remove('translate-x-0', 'opacity-100');
        toast.classList.add('translate-x-full', 'opacity-0');
        setTimeout(() => toast.remove(), 500);
    }, 4000);
}

// Universal Form Handler
function handleFormSubmit(formId, successMessage) {
    const form = document.getElementById(formId);
    if (!form) return;
    
    // File input and UI elements
    const fileInput = form.querySelector('input[type="file"]');
    const fileLabel = form.querySelector('.file-input-label');
    const fileNameDisplay = form.querySelector('.file-name-display');
    
    // File accumulator
    let dataTransfer = new DataTransfer();

    // File input change listener for UI update
    if (fileInput) {
        fileInput.addEventListener('change', (e) => {
            const files = e.target.files;
            
            // Add new files to our DataTransfer object
            for (let i = 0; i < files.length; i++) {
                // Prevent duplicate files based on name and size
                const fileExists = Array.from(dataTransfer.files).some(f => f.name === files[i].name && f.size === files[i].size);
                if (!fileExists) {
                    dataTransfer.items.add(files[i]);
                }
            }
            
            // Update input files with accumulated
            fileInput.files = dataTransfer.files;
            
            renderFileList();
        });
        
        function renderFileList() {
            if (dataTransfer.files.length > 0) {
                fileNameDisplay.style.display = 'block';
                let html = '<div class="file-list">';
                Array.from(dataTransfer.files).forEach((file, index) => {
                    html += `
                        <div class="file-item">
                            <i class="fas fa-file-alt"></i> ${file.name}
                            <i class="fas fa-times file-remove" data-index="${index}"></i>
                        </div>
                    `;
                });
                html += '</div>';
                fileNameDisplay.innerHTML = html;
                
                if (fileLabel) {
                    fileLabel.style.borderColor = 'var(--gold)';
                    fileLabel.style.borderStyle = 'solid';
                }
                
                // Add remove listeners
                const removeBtns = fileNameDisplay.querySelectorAll('.file-remove');
                removeBtns.forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        
                        const index = parseInt(e.currentTarget.getAttribute('data-index'));
                        const newDataTransfer = new DataTransfer();
                        
                        Array.from(dataTransfer.files).forEach((f, i) => {
                            if (i !== index) newDataTransfer.items.add(f);
                        });
                        
                        dataTransfer = newDataTransfer;
                        fileInput.files = dataTransfer.files;
                        renderFileList();
                    });
                });
            } else {
                fileNameDisplay.style.display = 'none';
                fileNameDisplay.innerHTML = '';
                if (fileLabel) {
                    fileLabel.style.borderColor = '';
                    fileLabel.style.borderStyle = '';
                }
            }
        }
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const btn = form.querySelector('button[type="submit"]');
        const originalText = btn.innerHTML;
        
        // Loading state
        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> GÖNDERİLİYOR...';
        btn.classList.add('opacity-75', 'cursor-not-allowed');
        
        // Form verilerini otomatik topla (FormData kullanarak)
        const formData = new FormData();
        const inputs = form.querySelectorAll('input, select, textarea');
        
        inputs.forEach(input => {
            if (input.type === 'file') return; // Dosyaları ayrı ekleyeceğiz

            let labelText = "";
            const label = form.querySelector(`label[for="${input.id}"]`) || input.closest('div')?.querySelector('label');
            
            if (label) {
                labelText = label.innerText.replace(":", "").trim();
            } else {
                labelText = input.placeholder || input.id || "Alan";
            }

            labelText = labelText.charAt(0).toUpperCase() + labelText.slice(1);
            
            if (input.type === 'checkbox' || input.type === 'radio') {
                if (input.checked) formData.append(labelText, input.value || 'Evet');
            } else if (input.value.trim() !== '') {
                formData.append(labelText, input.value.trim());
            }
        });

        // Çoklu dosya eklerini benzersiz anahtarlarla ekle (attachment1, attachment2, ...)
        if (fileInput && fileInput.files.length > 0) {
            for (let i = 0; i < fileInput.files.length; i++) {
                // FormSubmit çoklu dosya için benzersiz anahtarlar (label) bekleyebilir
                const key = i === 0 ? "attachment" : `attachment${i + 1}`;
                formData.append(key, fileInput.files[i]);
            }
        }

        // FormSubmit Özel Alanları & Meta Veriler
        let subjectName = "Yeni Bildirim";
        if (formId === 'contactForm') subjectName = "İletişim Formu Mesajı";
        if (formId === 'careerForm') subjectName = "Yeni Kariyer Başvurusu";
        if (formId === 'supplierForm') subjectName = "Yeni Tedarikçi Başvurusu";
        if (formId === 'partnerForm') subjectName = "Yeni Partnerlik Başvurusu";

        formData.append('_subject', subjectName);
        formData.append('_template', 'table');
        formData.append('_captcha', 'false');
        
        const now = new Date();
        const simpleDate = `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
        formData.append('Mesaj Tarihi', simpleDate);
        
        try {
            // Standart endpoint'e gönderiyoruz ancak fetch kullanarak sayfa yenilenmesini engelliyoruz.
            // Bu yöntem, dosya eklerinin (/ajax/ kısıtı olmadan) en güvenli şekilde iletilmesini sağlar.
            const response = await fetch("https://formsubmit.co/bilge.elektrik0@gmail.com", {
                method: "POST",
                body: formData
            });
            
            // Standart endpoint 302 redirect veya success dönebilir
            // fetch redirectleri takip eder (default: follow)
            if (response.ok) {
                showNotification(successMessage, 'success');
                form.reset();
                if (fileInput) {
                    dataTransfer = new DataTransfer();
                    fileInput.files = dataTransfer.files;
                    renderFileList();
                }
            } else {
                throw new Error('Form gönderilemedi.');
            }
        } catch (error) {
            console.error("Form Gönderim Hatası:", error);
            showNotification('Bir hata oluştu. Lütfen bağlantınızı kontrol edip tekrar deneyin.', 'error');
        } finally {
            btn.disabled = false;
            btn.innerHTML = originalText;
            btn.classList.remove('opacity-75', 'cursor-not-allowed');
        }
    });
}

// Initialize all forms
handleFormSubmit('contactForm', 'Mesajınız başarıyla iletildi. En kısa sürede size dönüş yapacağız.');
handleFormSubmit('careerForm', 'Başvurunuz başarıyla alındı. İnsan kaynakları ekibimiz değerlendirecektir.');
handleFormSubmit('supplierForm', 'Tedarikçi başvurunuz başarıyla sisteme kaydedildi.');
handleFormSubmit('partnerForm', 'Partnerlik başvurunuz başarıyla alındı. Sizinle iletişime geçeceğiz.');

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
