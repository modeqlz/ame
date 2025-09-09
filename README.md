# Telegram Web App с авторизацией

Современное веб-приложение для Telegram с красивым интерфейсом, авторизацией через Telegram и синхронизацией данных пользователя.

## 🚀 Возможности

- ✅ Авторизация через Telegram Web App API
- ✅ Telegram Login Widget для веб-браузеров
- ✅ Синхронизация данных пользователя с Telegram
- ✅ Современный адаптивный интерфейс
- ✅ Поддержка тем Telegram
- ✅ Уведомления и тактильная обратная связь
- ✅ Серверная валидация данных

## 📋 Требования

- Node.js 14+ 
- npm или yarn
- Telegram бот (создается через @BotFather)

## 🛠 Установка и настройка

### 1. Клонирование и установка зависимостей

```bash
# Установка зависимостей
npm install

# Или с yarn
yarn install
```

### 2. Создание Telegram бота

1. Откройте [@BotFather](https://t.me/BotFather) в Telegram
2. Отправьте команду `/newbot`
3. Следуйте инструкциям для создания бота
4. Сохраните полученный токен

### 3. Настройка Web App

1. В [@BotFather](https://t.me/BotFather) отправьте `/setmenubutton`
2. Выберите вашего бота
3. Отправьте название кнопки (например, "Открыть приложение")
4. Отправьте URL вашего приложения (например, `https://yourdomain.com`)

### 4. Настройка Login Widget

1. В [@BotFather](https://t.me/BotFather) отправьте `/setdomain`
2. Выберите вашего бота
3. Отправьте домен вашего сайта (например, `yourdomain.com`)

### 5. Конфигурация приложения

1. Скопируйте `.env` файл и заполните его:

```bash
# Токен вашего бота из BotFather
BOT_TOKEN=1234567890:AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA

# Порт для сервера
PORT=3000

# Среда разработки
NODE_ENV=development

# URL для webhook (если используется)
WEBHOOK_URL=https://yourdomain.com/webhook/telegram
```

2. В файле `app.js` замените `YOUR_BOT_USERNAME` на username вашего бота:

```javascript
script.setAttribute('data-telegram-login', 'your_bot_username');
```

## 🚀 Запуск

### Режим разработки

```bash
npm run dev
```

### Продакшн

```bash
npm start
```

Приложение будет доступно по адресу: `http://localhost:3000`

## 📱 Использование

### Для пользователей Telegram

1. Найдите вашего бота в Telegram
2. Нажмите кнопку "Открыть приложение" в меню бота
3. Приложение откроется с автоматической авторизацией

### Для веб-браузеров

1. Откройте приложение в браузере
2. Нажмите "Войти через Telegram"
3. Авторизуйтесь через Telegram Login Widget

## 🏗 Структура проекта

```
telegram-web-app/
├── index.html          # Главная HTML страница
├── styles.css          # CSS стили
├── app.js             # JavaScript логика клиента
├── server.js          # Express сервер
├── package.json       # Зависимости Node.js
├── .env              # Переменные окружения
└── README.md         # Документация
```

## 🔧 API Endpoints

### Авторизация

- `POST /auth/telegram` - Авторизация через Login Widget
- `POST /auth/webapp` - Проверка данных Web App

### Пользователи

- `GET /api/user/:userId` - Получение данных пользователя
- `POST /api/user/:userId/data` - Сохранение данных пользователя
- `GET /api/user/:userId/stats` - Статистика пользователя

### Webhook

- `POST /webhook/telegram` - Webhook для обновлений от бота

## 🎨 Кастомизация

### Изменение темы

Отредактируйте CSS переменные в `styles.css`:

```css
:root {
    --primary-color: #0088cc;
    --secondary-color: #667eea;
    --background-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
```

### Добавление новых функций

1. Добавьте HTML разметку в `index.html`
2. Создайте стили в `styles.css`
3. Реализуйте логику в `app.js`
4. При необходимости добавьте API endpoints в `server.js`

## 🔒 Безопасность

- Все данные от Telegram проверяются криптографически
- Используется HMAC-SHA256 для валидации
- Данные авторизации имеют срок действия 24 часа
- Поддерживается CORS для безопасных запросов

## 🐛 Отладка

### Проверка подключения к Telegram

```javascript
console.log('Telegram Web App доступен:', !!window.Telegram?.WebApp);
console.log('Данные пользователя:', window.Telegram?.WebApp?.initDataUnsafe);
```

### Логи сервера

Сервер выводит подробные логи всех операций авторизации и API запросов.

## 📚 Дополнительные ресурсы

- [Telegram Web Apps Documentation](https://core.telegram.org/bots/webapps)
- [Telegram Login Widget](https://core.telegram.org/widgets/login)
- [Bot API Documentation](https://core.telegram.org/bots/api)

## 🤝 Поддержка

Если у вас возникли вопросы или проблемы:

1. Проверьте, что BOT_TOKEN правильно настроен
2. Убедитесь, что домен добавлен в настройки бота
3. Проверьте консоль браузера на наличие ошибок
4. Убедитесь, что сервер запущен и доступен

## 📄 Лицензия

MIT License - используйте свободно для личных и коммерческих проектов.
