// Telegram Web App объект
let tg = window.Telegram?.WebApp;

// Инициализация приложения
document.addEventListener('DOMContentLoaded', function() {
    initApp();
});

function initApp() {
    // Проверяем доступность Telegram Web App
    if (!tg) {
        console.warn('Telegram Web App SDK недоступен. Приложение работает в режиме демонстрации.');
        // Создаем заглушку для демонстрации
        tg = {
            expand: () => {},
            backgroundColor: '#f5f7fa',
            textColor: '#333333',
            MainButton: {
                text: '',
                show: () => {},
                hide: () => {},
                onClick: () => {}
            },
            HapticFeedback: {
                impactOccurred: () => {}
            },
            showAlert: (message) => alert(message),
            initDataUnsafe: null,
            onEvent: () => {}
        };
    }
    
    // Расширяем приложение на весь экран
    if (tg.expand) tg.expand();
    
    // Настраиваем цвета темы
    if (tg.backgroundColor) {
        document.body.style.backgroundColor = tg.backgroundColor;
    }
    
    // Проверяем, запущено ли приложение в Telegram
    if (tg.initDataUnsafe && tg.initDataUnsafe.user) {
        // Пользователь уже авторизован через Telegram Web App
        showMainPage(tg.initDataUnsafe.user);
    } else {
        // Показываем страницу авторизации
        showAuthPage();
    }
    
    // Настраиваем обработчики событий
    setupEventListeners();
    
    // Создаем Telegram Login Widget
    createTelegramLoginWidget();
}

{{ ... }}
