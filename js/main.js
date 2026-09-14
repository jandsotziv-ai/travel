// Ждем полной загрузки страницы
document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Логика тултипов карты ---
    const points = document.querySelectorAll('.map-point');
    const tooltip = document.getElementById('mapTooltip');
    
    if (tooltip && points.length > 0) {
        const titleEl = document.getElementById('tooltipTitle');
        const textEl = document.getElementById('tooltipText');

        points.forEach(point => {
            point.addEventListener('mouseenter', (e) => {
                const location = point.getAttribute('data-location');
                const program = point.getAttribute('data-program');
                const date = point.getAttribute('data-date');

                if (!location) return;

                titleEl.textContent = location;
                textEl.textContent = program + ' • ' + date;

                tooltip.classList.add('active');
                
                const rect = point.getBoundingClientRect();
                tooltip.style.left = (rect.left + window.scrollX) + 'px';
                tooltip.style.top = (rect.top + window.scrollY - 10) + 'px';
            });

            point.addEventListener('mouseleave', () => {
                tooltip.classList.remove('active');
            });
            
            point.addEventListener('mousemove', (e) => {
                if (tooltip.classList.contains('active')) {
                    const rect = point.getBoundingClientRect();
                    tooltip.style.left = (rect.left + window.scrollX) + 'px';
                    tooltip.style.top = (rect.top + window.scrollY - 10) + 'px';
                }
            });
        });
    }

    // --- 2. Логика горизонтальной галереи (Drag & Drop) ---
    const slider = document.querySelector('.gallery-scroll-wrapper');
    
    if (slider) {
        let isDown = false;
        let startX;
        let scrollLeft;

        slider.addEventListener('mousedown', (e) => {
            isDown = true;
            slider.classList.add('active');
            slider.style.cursor = 'grabbing';
            startX = e.pageX - slider.offsetLeft;
            scrollLeft = slider.scrollLeft;
        });

        slider.addEventListener('mouseleave', () => {
            isDown = false;
            slider.classList.remove('active');
            slider.style.cursor = 'grab';
        });

        slider.addEventListener('mouseup', () => {
            isDown = false;
            slider.classList.remove('active');
            slider.style.cursor = 'grab';
        });

        slider.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - slider.offsetLeft;
            const walk = (x - startX) * 2;
            slider.scrollLeft = scrollLeft - walk;
        });
        
        // Кнопки навигации галереи
        const prevBtn = document.getElementById('galleryPrev');
        const nextBtn = document.getElementById('galleryNext');
        const scrollAmount = 400;

        if (prevBtn && nextBtn) {
            prevBtn.addEventListener('click', () => {
                slider.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
            });
            nextBtn.addEventListener('click', () => {
                slider.scrollBy({ left: scrollAmount, behavior: 'smooth' });
            });
        }
    }

    // --- 3. Анимация появления при скролле (Reveal) ---
    const reveals = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.1 });

    reveals.forEach(el => revealObserver.observe(el));
});

// --- 4. Эффект хедера при скролле (вне DOMContentLoaded для надежности) ---
window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    if (header) {
        if (window.pageYOffset > 50) {
            header.style.boxShadow = '0 4px 30px rgba(0,0,0,0.08)';
            header.style.background = 'rgba(255, 255, 255, 0.95)';
        } else {
            header.style.boxShadow = 'none';
            header.style.background = 'rgba(255, 255, 255, 0.85)';
        }
    }
});
