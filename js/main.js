// Map tooltips
const mapPoints = document.querySelectorAll('.map-point');
const tooltip = document.getElementById('mapTooltip');
const tooltipTitle = document.getElementById('tooltipTitle');
const tooltipText = document.getElementById('tooltipText');
const hero = document.getElementById('hero');

if (mapPoints.length > 0 && tooltip) {
    mapPoints.forEach(point => {
        point.addEventListener('mouseenter', (e) => {
            const rect = point.getBoundingClientRect();
            const heroRect = hero.getBoundingClientRect();

            tooltipTitle.textContent = point.dataset.location;
            tooltipText.textContent = `${point.dataset.program} — ${point.dataset.date}`;

            // Position tooltip above the point
            let left = rect.left - heroRect.left + rect.width / 2 - tooltip.offsetWidth / 2;
            let top = rect.top - heroRect.top - tooltip.offsetHeight - 12;

            // Keep within bounds
            if (left < 10) left = 10;
            if (left + tooltip.offsetWidth > heroRect.width - 10) left = heroRect.width - tooltip.offsetWidth - 10;
            if (top < 10) top = rect.top - heroRect.top + rect.height + 12;

            tooltip.style.left = left + 'px';
            tooltip.style.top = top + 'px';
            tooltip.classList.add('active');
        });

        point.addEventListener('mouseleave', () => {
            tooltip.classList.remove('active');
        });
    });
}

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

// Скрипт для перетаскивания галереи мышью
const galleryContainer = document.getElementById('galleryContainer');

if (galleryContainer) {
    let isDown = false;
    let startX;
    let scrollLeft;

    galleryContainer.addEventListener('mousedown', (e) => {
        isDown = true;
        galleryContainer.classList.add('active');
        startX = e.pageX - galleryContainer.offsetLeft;
        scrollLeft = galleryContainer.scrollLeft;
    });

    galleryContainer.addEventListener('mouseleave', () => {
        isDown = false;
        galleryContainer.classList.remove('active');
    });

    galleryContainer.addEventListener('mouseup', () => {
        isDown = false;
        galleryContainer.classList.remove('active');
    });

    galleryContainer.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - galleryContainer.offsetLeft;
        const walk = (x - startX) * 2; // Скорость прокрутки
        galleryContainer.scrollLeft = scrollLeft - walk;
    });
}
