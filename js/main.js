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
        let startX = 0;
        let scrollLeft = 0;

        // Перетаскивание мышью. Слушаем document, чтобы движение не обрывалось,
        // когда курсор выходит за границы галереи. На сенсорных экранах работает
        // нативная прокрутка, поэтому реагируем только на мышь.
        slider.addEventListener('pointerdown', (e) => {
            if (e.pointerType !== 'mouse' || e.button !== 0) return;
            isDown = true;
            startX = e.clientX;
            scrollLeft = slider.scrollLeft;
            // Плавная прокрутка из CSS на время перетаскивания мешает: каждое движение «догоняет» с задержкой
            slider.style.scrollBehavior = 'auto';
            slider.classList.add('active');
        });
        document.addEventListener('pointermove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            slider.scrollLeft = scrollLeft - (e.clientX - startX);
        });
        const stopDrag = () => {
            if (!isDown) return;
            isDown = false;
            slider.style.scrollBehavior = '';
            slider.classList.remove('active');
        };
        document.addEventListener('pointerup', stopDrag);
        document.addEventListener('pointercancel', stopDrag);

        // Запрет нативного drag & drop для картинок в галерее
        slider.querySelectorAll('img').forEach(img => {
            img.addEventListener('dragstart', (e) => e.preventDefault());
        });

        // Стрелки навигации: листают на ширину видимой области без одной фотографии
        const prevBtn = document.getElementById('galleryPrev');
        const nextBtn = document.getElementById('galleryNext');
        if (prevBtn && nextBtn) {
            const step = () => Math.max(slider.clientWidth * 0.8, 300);
            const updateArrows = () => {
                const max = slider.scrollWidth - slider.clientWidth;
                prevBtn.disabled = slider.scrollLeft <= 2;
                nextBtn.disabled = slider.scrollLeft >= max - 2;
            };
            prevBtn.addEventListener('click', () => slider.scrollBy({ left: -step(), behavior: 'smooth' }));
            nextBtn.addEventListener('click', () => slider.scrollBy({ left: step(), behavior: 'smooth' }));
            slider.addEventListener('scroll', updateArrows, { passive: true });
            window.addEventListener('resize', updateArrows);
            updateArrows();
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
    // Прячет сообщение об успешной отправке и кнопку «Скачать инфолист»
    function resetFormResult(form) {
        const success = form.querySelector('.form-success');
        const download = form.querySelector('.form-download');
        if (success) success.hidden = true;
        if (download) download.hidden = true;
    }

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

                // Запоминаем инфолист программы (только для зарубежных поездок)
                const modalForm = targetModal.querySelector('form');
                if (modalForm) {
                    modalForm.dataset.infosheet = btn.getAttribute('data-infosheet') || '';
                    resetFormResult(modalForm);
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
    // ЗАГЛУШКА: пока заявки никуда не уходят. Заменить на fetch() к серверному
    // обработчику (почта / Telegram), который возвращает успех или ошибку.
    function sendForm(form) {
        return new Promise((resolve) => setTimeout(resolve, 300));
    }

    const allForms = document.querySelectorAll('.modal-form, #contactForm');
    allForms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn ? submitBtn.textContent : 'Отправить';
            const success = form.querySelector('.form-success');
            const download = form.querySelector('.form-download');

            resetFormResult(form);
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.textContent = 'Отправка...';
            }

            sendForm(form).then(() => {
                form.reset();
                if (success) success.hidden = false;

                // Инфолист показываем, только если у программы он задан
                const infosheet = form.dataset.infosheet;
                if (download && infosheet) {
                    download.href = infosheet;
                    download.hidden = false;
                }
            }).catch(() => {
                alert('Не удалось отправить форму. Пожалуйста, позвоните нам: 8 (3812) 972-440.');
            }).finally(() => {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.textContent = originalText;
                }
            });
        });
    });

    // --- 8. Баннер согласия на Cookies (на всех страницах, где подключён main.js) ---
    const CONSENT_KEY = 'cookieConsent';
    let consentGiven = false;
    try {
        consentGiven = localStorage.getItem(CONSENT_KEY) === 'accepted';
    } catch (err) {
        // localStorage недоступен — просто покажем баннер
    }

    if (!consentGiven) {
        const banner = document.createElement('div');
        banner.className = 'cookie-banner';
        banner.setAttribute('role', 'dialog');
        banner.setAttribute('aria-label', 'Согласие на обработку файлов Cookies');
        banner.innerHTML =
            '<p>Продолжая использовать наш сайт, вы даете согласие на обработку ' +
            '<a href="cookies.html" target="_blank">файлов Cookies</a> и других пользовательских данных, ' +
            'в том числе и с использованием сервиса «Яндекс Метрика», в соответствии с ' +
            '<a href="privacy-policy.html" target="_blank">Политикой конфиденциальности</a>.</p>' +
            '<button type="button" class="btn cookie-accept">Принять</button>';
        document.body.appendChild(banner);

        banner.querySelector('.cookie-accept').addEventListener('click', () => {
            try {
                localStorage.setItem(CONSENT_KEY, 'accepted');
            } catch (err) {
                // без localStorage баннер просто покажется снова при следующем заходе
            }
            banner.remove();
        });
    }
});
