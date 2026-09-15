document.addEventListener('DOMContentLoaded', () => {
    console.log('Скрипт запущен!'); // Проверка 1: должно появиться в консоли

    // --- 1. Логика Тултипов (Карта) ---
    const points = document.querySelectorAll('.map-point');
    const tooltip = document.getElementById('mapTooltip');
    
    // Проверяем, есть ли вообще точки и тултип на странице
    if (points.length > 0 && tooltip) {
        console.log(`Найдено точек: ${points.length}`); // Проверка 2
        
        const titleEl = document.getElementById('tooltipTitle');
        const textEl = document.getElementById('tooltipText');

        points.forEach((point, index) => {
            // Вешаем событие наведения
            point.addEventListener('mouseenter', function() {
                console.log(`Наведение на точку ${index + 1}`); // Проверка 3: должно быть при наведении
                
                const location = this.getAttribute('data-location');
                const program = this.getAttribute('data-program');
                const date = this.getAttribute('data-date');

                if (titleEl && textEl) {
                    titleEl.textContent = location || '';
                    textEl.textContent = program ? `${program} • ${date}` : date;
                    
                    // Показываем
                    tooltip.classList.add('active');
                    
                    // Позиционируем
                    const rect = this.getBoundingClientRect();
                    tooltip.style.left = (rect.left + window.scrollX) + 'px';
                    tooltip.style.top = (rect.top + window.scrollY - 10) + 'px'; // Чуть выше точки
                }
            });

            // Вешаем событие ухода мыши
            point.addEventListener('mouseleave', () => {
                tooltip.classList.remove('active');
            });
        });
    } else {
        if(points.length === 0) console.warn('Не найдено элементов .map-point');
        if(!tooltip) console.error('Не найден элемент #mapTooltip');
    }

    // --- 2. Логика Галереи (Скролл) ---
    const slider = document.querySelector('.gallery-scroll-wrapper');
    if (slider) {
        let isDown = false;
        let startX;
        let scrollLeft;

        slider.addEventListener('mousedown', (e) => {
            isDown = true;
            slider.classList.add('active');
            startX = e.pageX - slider.offsetLeft;
            scrollLeft = slider.scrollLeft;
        });
        slider.addEventListener('mouseleave', () => { isDown = false; slider.classList.remove('active'); });
        slider.addEventListener('mouseup', () => { isDown = false; slider.classList.remove('active'); });
        slider.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - slider.offsetLeft;
            const walk = (x - startX) * 2;
            slider.scrollLeft = scrollLeft - walk;
        });
        
        // Кнопки навигации (если есть)
        const prevBtn = document.getElementById('galleryPrev');
        const nextBtn = document.getElementById('galleryNext');
        if(prevBtn && nextBtn) {
            prevBtn.addEventListener('click', () => slider.scrollBy({ left: -400, behavior: 'smooth' }));
            nextBtn.addEventListener('click', () => slider.scrollBy({ left: 400, behavior: 'smooth' }));
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

    // --- 4. Эффект шапки ---
    window.addEventListener('scroll', () => {
        const header = document.querySelector('header');
        if (header) {
            header.style.boxShadow = window.pageYOffset > 50 ? '0 4px 30px rgba(0,0,0,0.08)' : 'none';
        }
    });
});

// Логика мобильного меню
const menuBtn = document.getElementById('mobileMenuBtn');
const mobileDropdown = document.getElementById('mobileDropdown');
const mobileLinks = document.querySelectorAll('.mobile-link');

if (menuBtn && mobileDropdown) {
    menuBtn.addEventListener('click', () => {
        mobileDropdown.classList.toggle('active');
        
        // Меняем иконку бургера на крестик (опционально)
        const isActive = mobileDropdown.classList.contains('active');
        if (isActive) {
            menuBtn.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>';
        } else {
            menuBtn.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>';
        }
    });

    // Закрываем меню при клике на любую ссылку
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileDropdown.classList.remove('active');
            menuBtn.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>';
        });
    });
}
