/**
 * Инициализирует плавную прокрутку для всех навигационных ссылок.
 * При клике на ссылку плавно прокручивает страницу к соответствующему разделу.
 */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Анимация сетки при движении мыши
const hero = document.querySelector('.hero');
const gridOverlay = document.querySelector('.grid-overlay');

/**
 * Создает эффект параллакса для сетки при движении мыши.
 * @param {MouseEvent} e - Событие движения мыши
 */
hero.addEventListener('mousemove', (e) => {
    const { clientX, clientY } = e;
    const { left, top, width, height } = hero.getBoundingClientRect();
    
    // Вычисляем позицию курсора относительно центра секции
    const x = (clientX - left - width / 2) / 20;
    const y = (clientY - top - height / 2) / 20;
    
    // Применяем трансформацию к сетке
    gridOverlay.style.transform = `translate(${x}px, ${y}px)`;
});

/**
 * Сбрасывает позицию сетки при уходе курсора с секции.
 */
hero.addEventListener('mouseleave', () => {
    gridOverlay.style.transform = 'translate(0, 0)';
});

// Анимация появления элементов при прокрутке
/**
 * Настройки для Intersection Observer.
 * @type {Object}
 */
const observerOptions = {
    threshold: 0.1
};

/**
 * Создает анимацию появления элементов при прокрутке.
 * @param {IntersectionObserverEntry[]} entries - Массив элементов, за которыми ведется наблюдение
 */
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

/**
 * Добавляет классы для анимации и начинает наблюдение за элементами.
 */
document.querySelectorAll('.about-content, .services-grid, .contact-content').forEach(element => {
    element.classList.add('fade-in');
    observer.observe(element);
});

// Добавляем стили для анимации
/**
 * Добавляет стили для анимации появления элементов.
 */
const style = document.createElement('style');
style.textContent = `
    .fade-in {
        opacity: 0;
        transform: translateY(20px);
        transition: opacity 0.6s ease, transform 0.6s ease;
    }
    
    .fade-in.visible {
        opacity: 1;
        transform: translateY(0);
    }
`;
document.head.appendChild(style);

// Изменение прозрачности шапки при прокрутке
const header = document.querySelector('.header');
let lastScroll = 0;

/**
 * Обновляет прозрачность шапки при прокрутке страницы.
 */
window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll <= 0) {
        header.style.background = 'rgba(18, 18, 18, 0.95)';
        return;
    }
    
    if (currentScroll > lastScroll) {
        // Прокрутка вниз
        header.style.background = 'rgba(18, 18, 18, 0.8)';
    } else {
        // Прокрутка вверх
        header.style.background = 'rgba(18, 18, 18, 0.95)';
    }
    
    lastScroll = currentScroll;
});

// Кнопка "наверх"
const scrollToTopButton = document.getElementById('scrollToTop');

/**
 * Показывает/скрывает кнопку "наверх" при прокрутке.
 */
window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        scrollToTopButton.classList.add('visible');
    } else {
        scrollToTopButton.classList.remove('visible');
    }
});

/**
 * Плавно прокручивает страницу вверх при клике на кнопку.
 */
scrollToTopButton.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Мобильное меню
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

/**
 * Переключает видимость мобильного меню при клике на кнопку.
 */
menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    menuToggle.classList.toggle('active');
});

/**
 * Закрывает мобильное меню при клике на пункт меню.
 */
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        menuToggle.classList.remove('active');
    });
});

// Discord статус
const DISCORD_USER_ID = '350970672769662976';
const DISCORD_USERNAME = '__tesla';

// Обновляем имя пользователя
document.querySelector('.discord-username').textContent = DISCORD_USERNAME;

/**
 * Обновляет статус Discord пользователя.
 * Получает данные о статусе и активности пользователя через Lanyard API.
 * @returns {Promise<void>}
 */
async function updateDiscordStatus() {
    try {
        // Используем Lanyard API для получения статуса
        const response = await fetch(`https://api.lanyard.rest/v1/users/${DISCORD_USER_ID}`);
        
        if (response.ok) {
            const data = await response.json();
            const status = data.data.discord_status || 'offline';
            const statusText = {
                'online': 'В сети',
                'idle': 'Не активен',
                'dnd': 'Не беспокоить',
                'offline': 'Не в сети'
            }[status];

            const statusIndicator = document.querySelector('.status-indicator');
            const statusTextElement = document.querySelector('.status-text');

            statusIndicator.className = 'status-indicator ' + status;
            statusTextElement.textContent = statusText;

            // Если есть активность, показываем её
            if (data.data.activities && data.data.activities.length > 0) {
                const activity = data.data.activities[0];
                if (activity.name) {
                    statusTextElement.textContent += ` • ${activity.name}`;
                }
            }
        }
    } catch (error) {
        console.error('Ошибка при получении статуса Discord:', error);
        // Устанавливаем статус "Не в сети" при ошибке
        const statusIndicator = document.querySelector('.status-indicator');
        const statusTextElement = document.querySelector('.status-text');
        statusIndicator.className = 'status-indicator offline';
        statusTextElement.textContent = 'Не в сети';
    }
}

// Обновляем статус каждые 10 секунд
updateDiscordStatus();
setInterval(updateDiscordStatus, 10000);

// Инициализация частиц
/**
 * Конфигурация и инициализация частиц для фона.
 * @type {Object}
 */
particlesJS('particles-js', {
    particles: {
        number: {
            value: 80,
            density: {
                enable: true,
                value_area: 800
            }
        },
        color: {
            value: '#ffffff'
        },
        shape: {
            type: 'circle'
        },
        opacity: {
            value: 0.5,
            random: true,
            anim: {
                enable: true,
                speed: 1,
                opacity_min: 0.1,
                sync: false
            }
        },
        size: {
            value: 3,
            random: true,
            anim: {
                enable: true,
                speed: 2,
                size_min: 0.1,
                sync: false
            }
        },
        line_linked: {
            enable: true,
            distance: 150,
            color: '#ffffff',
            opacity: 0.2,
            width: 1
        },
        move: {
            enable: true,
            speed: 2,
            direction: 'none',
            random: true,
            straight: false,
            out_mode: 'out',
            bounce: false,
            attract: {
                enable: true,
                rotateX: 600,
                rotateY: 1200
            }
        }
    },
    interactivity: {
        detect_on: 'canvas',
        events: {
            onhover: {
                enable: true,
                mode: 'grab'
            },
            onclick: {
                enable: true,
                mode: 'push'
            },
            resize: true
        },
        modes: {
            grab: {
                distance: 140,
                line_linked: {
                    opacity: 0.5
                }
            },
            push: {
                particles_nb: 4
            }
        }
    },
    retina_detect: true
});

// Слайдер проектов
const slider = document.querySelector('.services-grid');
const prevBtn = document.querySelector('.slider-nav.prev');
const nextBtn = document.querySelector('.slider-nav.next');
const cards = document.querySelectorAll('.service-card');
const playBtn = document.querySelector('.slider-play');
const pauseBtn = document.querySelector('.slider-pause');

if (playBtn && pauseBtn) {
    function getCardsPerView() {
        return window.innerWidth > 1100 ? 3 : 1;
    }

    let currentIndex = 0;
    let autoSlideInterval = null;

    function updateSlider() {
        const cardsPerView = getCardsPerView();
        const maxIndex = Math.max(0, cards.length - cardsPerView);
        if (currentIndex > maxIndex) currentIndex = maxIndex;
        if (currentIndex < 0) currentIndex = 0;
        const offset = currentIndex * (cards[0].offsetWidth + 40); // 40px gap
        slider.style.transform = `translateX(-${offset}px)`;
        prevBtn.style.opacity = currentIndex === 0 ? '0.5' : '1';
        nextBtn.style.opacity = currentIndex === maxIndex ? '0.5' : '1';
    }

    prevBtn.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
            updateSlider();
        }
    });

    nextBtn.addEventListener('click', () => {
        const cardsPerView = getCardsPerView();
        const maxIndex = Math.max(0, cards.length - cardsPerView);
        if (currentIndex < maxIndex) {
            currentIndex++;
            updateSlider();
        }
    });

    playBtn.addEventListener('click', () => {
        if (autoSlideInterval) return;
        autoSlideInterval = setInterval(() => {
            const cardsPerView = getCardsPerView();
            const maxIndex = Math.max(0, cards.length - cardsPerView);
            if (currentIndex < maxIndex) {
                currentIndex++;
                updateSlider();
            } else {
                clearInterval(autoSlideInterval);
                autoSlideInterval = null;
            }
        }, 2000);
    });

    pauseBtn.addEventListener('click', () => {
        if (autoSlideInterval) {
            clearInterval(autoSlideInterval);
            autoSlideInterval = null;
        }
    });

    window.addEventListener('resize', () => {
        updateSlider();
    });

    updateSlider();
}

window.addEventListener('resize', () => {
    updateSlider();
});
