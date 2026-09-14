// Map tooltips
document.addEventListener('DOMContentLoaded', () => {
    const points = document.querySelectorAll('.map-point');
    const tooltip = document.getElementById('mapTooltip');
    
    // Проверяем, существуют ли элементы, чтобы избежать ошибок
    if (!tooltip || points.length === 0) return;

    const titleEl = document.getElementById('tooltipTitle');
    const textEl = document.getElementById('tooltipText');

    points.forEach(point => {
        point.addEventListener('mouseenter', (e) => {
            // Берем данные из атрибутов
            const location = point.getAttribute('data-location');
            const program = point.getAttribute('data-program');
            const date = point.getAttribute('data-date');

            if (!location) return; // Если данных нет, не показываем

            // Заполняем текст
            titleEl.textContent = location;
            textEl.textContent = program + '\n' + date;

            // Показываем тултип
            tooltip.classList.add('active');

            // Вычисляем позицию
            // Используем getBoundingClientRect для точной позиции относительно экрана
            const rect = point.getBoundingClientRect();
            
            // Позиционируем абсолютно относительно документа
            tooltip.style.left = (rect.left + window.scrollX) + 'px';
            tooltip.style.top = (rect.top + window.scrollY) + 'px';
        });

        point.addEventListener('mouseleave', () => {
            tooltip.classList.remove('active');
        });
        
        // Дополнительно: обновление позиции при скролле, если тултип открыт
        point.addEventListener('mousemove', (e) => {
             if (tooltip.classList.contains('active')) {
                const rect = point.getBoundingClientRect();
                tooltip.style.left = (rect.left + window.scrollX) + 'px';
                tooltip.style.top = (rect.top + window.scrollY) + 'px';
             }
        });
    });
});
// Scroll reveal
const reveals = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        }
    });
}, { threshold: 0.1 });

reveals.forEach(el => revealObserver.observe(el));

// Header scroll effect
window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
        header.style.boxShadow = '0 4px 30px rgba(0,0,0,0.08)';
    } else {
        header.style.boxShadow = 'none';
    }
});

document.addEventListener('DOMContentLoaded', () => {
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

        slider.addEventListener('mouseleave', () => {
            isDown = false;
            slider.classList.remove('active');
        });

        slider.addEventListener('mouseup', () => {
            isDown = false;
            slider.classList.remove('active');
        });

        slider.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - slider.offsetLeft;
            const walk = (x - startX) * 2; // Скорость скролла
            slider.scrollLeft = scrollLeft - walk;
        });
    }
