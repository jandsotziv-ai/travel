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

// --- Логика мобильного меню ---
const menuBtn = document.getElementById('mobileMenuBtn');
const nav = document.getElementById('main-nav');
const body = document.body;

if (menuBtn && nav) {
    menuBtn.addEventListener('click', () => {
        // Переключаем класс active у меню и кнопки
        nav.classList.toggle('active');
        menuBtn.classList.toggle('active');
        
        // Блокируем прокрутку страницы, когда меню открыто
        if (nav.classList.contains('active')) {
            body.style.overflow = 'hidden';
        } else {
            body.style.overflow = '';
        }
    });

    // Закрываем меню при клике на любую ссылку внутри него
    const navLinks = nav.querySelectorAll('a, .dropdown-toggle');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            nav.classList.remove('active');
            menuBtn.classList.remove('active');
            body.style.overflow = '';
        });
    });
}
