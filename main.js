document.addEventListener('DOMContentLoaded', () => {
    // --- 1. Логика Тултипов (Карта) ---
    const points = document.querySelectorAll('.map-point');
    const tooltip = document.getElementById('mapTooltip');
    const hero = document.getElementById('hero');
    
    if (points.length > 0 && tooltip && hero) {
        const titleEl = document.getElementById('tooltipTitle');
        const textEl = document.getElementById('tooltipText');

        points.forEach((point) => {
            point.addEventListener('mouseenter', function() {
                const location = this.getAttribute('data-location');
                const program = this.getAttribute('data-program');
                const date = this.getAttribute('data-date');

                if (titleEl && textEl) {
                    titleEl.textContent = location || '';
                    textEl.textContent = program ? `${program} • ${date}` : date;
                    
                    tooltip.classList.add('active');
                    
                    const heroRect = hero.getBoundingClientRect();
                    const rect = this.getBoundingClientRect();
                    tooltip.style.left = (rect.left - heroRect.left) + 'px';
                    tooltip.style.top = (rect.top - heroRect.top - 10) + 'px';
                }
            });

            point.addEventListener('mouseleave', () => {
                tooltip.classList.remove('active');
            });
        });
    }

    // --- 2. Логика Галереи (Скролл перетаскиванием) ---
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

        // Запрет нативного drag & drop для картинок в галерее
        slider.querySelectorAll('img').forEach(img => {
            img.addEventListener('dragstart', (e) => e.preventDefault());
        });
        
        // Кнопки навигации (если будут добавлены)
        const prevBtn = document.getElementById('galleryPrev');
        const nextBtn = document.getElementById('galleryNext');
        if (prevBtn && nextBtn) {
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

    // --- 4. Эффект шапки при скролле ---
    window.addEventListener('scroll', () => {
        const header = document.querySelector('header');
        if (header) {
            header.style.boxShadow = window.pageYOffset > 50 ? '0 4px 30px rgba(0,0,0,0.08)' : 'none';
        }
    });

    // --- 5. Мобильное меню ---
    const menuBtn = document.getElementById('mobileMenuBtn');
    const mobileDropdown = document.getElementById('mobileDropdown');

    if (menuBtn && mobileDropdown) {
        menuBtn.addEventListener('click', () => {
            mobileDropdown.classList.toggle('active');
            const isActive = mobileDropdown.classList.contains('active');
            if (isActive) {
                menuBtn.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>';
            } else {
                menuBtn.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>';
            }
        });

        // Закрываем меню при клике на любую ссылку
        const links = mobileDropdown.querySelectorAll('a');
        links.forEach(link => {
            link.addEventListener('click', () => {
                mobileDropdown.classList.remove('active');
                menuBtn.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>';
            });
        });
    }

    // --- 6. МОДАЛЬНЫЕ ОКНА ЗАЯВОК (3 ТИПА ФОРМ) ---
    const programButtons = document.querySelectorAll('.program-btn');
    const modalOverlays = document.querySelectorAll('.modal-overlay');

    function closeModal(targetModal) {
        if (targetModal) {
            targetModal.classList.remove('active');
        } else {
            modalOverlays.forEach(m => m.classList.remove('active'));
        }
        // Восстанавливаем скролл, если больше нет открытых окон
        const hasOpenModal = document.querySelector('.modal-overlay.active');
        if (!hasOpenModal) {
            document.body.style.overflow = '';
        }
    }

    if (programButtons.length > 0) {
        programButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Считываем ID целевой формы из data-modal (по умолчанию programModal)
                const targetModalId = btn.getAttribute('data-modal') || 'programModal';
                const targetModal = document.getElementById(targetModalId) || document.getElementById('programModal');
                
                if (!targetModal) return;

                const programName = btn.getAttribute('data-program') || 'Наша программа';

                // Обновляем заголовок конкретно в открываемой форме
                const titleEl = targetModal.querySelector('.modal-title, h3');
                if (titleEl) {
                    titleEl.textContent = programName;
                }

                // Заполняем скрытое поле с названием программы
                const programInput = targetModal.querySelector('input[name="program"]');
                if (programInput) {
                    programInput.value = programName;
                }

                // Открываем модальное окно
                targetModal.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        });
    }

    // Закрытие по клику на крестик
    document.querySelectorAll('.modal-close').forEach(closeBtn => {
        closeBtn.addEventListener('click', () => {
            const modal = closeBtn.closest('.modal-overlay');
            closeModal(modal);
        });
    });

    // Закрытие кликом по затемнению (overlay)
    modalOverlays.forEach(overlay => {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                closeModal(overlay);
            }
        });
    });

    // Закрытие клавишей Esc
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal();
        }
    });

    // --- 7. Обработка отправки форм ---
    const allForms = document.querySelectorAll('.modal-form, #contactForm');
    allForms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn ? submitBtn.textContent : 'Отправить';
            
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.textContent = 'Отправка...';
            }

            setTimeout(() => {
                alert('Спасибо за вашу заявку! Мы свяжемся с вами в ближайшее время.');
                form.reset();
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.textContent = originalText;
                }
                const modal = form.closest('.modal-overlay');
                if (modal) {
                    closeModal(modal);
                }
            }, 300);
        });
    });
});
