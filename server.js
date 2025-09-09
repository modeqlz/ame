const express = require('express');
const crypto = require('crypto');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Конфигурация бота (замените на ваши данные)
const BOT_TOKEN = process.env.BOT_TOKEN || 'YOUR_BOT_TOKEN';

// Функция для проверки подлинности данных Telegram
function verifyTelegramAuth(authData) {
    const secret = crypto.createHash('sha256').update(BOT_TOKEN).digest();
    const { hash, ...data } = authData;
    
    const dataCheckString = Object.keys(data)
        .sort()
        .map(key => `${key}=${data[key]}`)
        .join('\n');
    
    const hmac = crypto.createHmac('sha256', secret).update(dataCheckString).digest('hex');
    
    return hmac === hash;
}

// Функция для проверки данных Telegram Web App
function verifyTelegramWebAppData(initData) {
    if (!initData) return false;
    
    try {
        const urlParams = new URLSearchParams(initData);
        const hash = urlParams.get('hash');
        urlParams.delete('hash');
        
        const dataCheckString = Array.from(urlParams.entries())
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([key, value]) => `${key}=${value}`)
            .join('\n');
        
        const secret = crypto.createHmac('sha256', 'WebAppData').update(BOT_TOKEN).digest();
        const calculatedHash = crypto.createHmac('sha256', secret).update(dataCheckString).digest('hex');
        
        return calculatedHash === hash;
    } catch (error) {
        console.error('Ошибка проверки данных Web App:', error);
        return false;
    }
}

// Главная страница
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// API для авторизации через Telegram Login Widget
app.post('/auth/telegram', (req, res) => {
    const authData = req.body;
    
    // Проверяем подлинность данных
    if (!verifyTelegramAuth(authData)) {
        return res.status(401).json({
            success: false,
            error: 'Неверные данные авторизации'
        });
    }
    
    // Проверяем, что данные не устарели (не старше 24 часов)
    const authDate = new Date(authData.auth_date * 1000);
    const now = new Date();
    const hoursDiff = (now - authDate) / (1000 * 60 * 60);
    
    if (hoursDiff > 24) {
        return res.status(401).json({
            success: false,
            error: 'Данные авторизации устарели'
        });
    }
    
    // Сохраняем пользователя в базе данных (здесь используем простое логирование)
    console.log('Пользователь авторизован:', {
        id: authData.id,
        first_name: authData.first_name,
        last_name: authData.last_name,
        username: authData.username,
        photo_url: authData.photo_url,
        auth_date: authDate
    });
    
    res.json({
        success: true,
        user: {
            id: authData.id,
            first_name: authData.first_name,
            last_name: authData.last_name,
            username: authData.username,
            photo_url: authData.photo_url,
            language_code: authData.language_code,
            is_premium: authData.is_premium || false
        }
    });
});

// API для проверки данных Web App
app.post('/auth/webapp', (req, res) => {
    const { initData } = req.body;
    
    if (!verifyTelegramWebAppData(initData)) {
        return res.status(401).json({
            success: false,
            error: 'Неверные данные Web App'
        });
    }
    
    // Парсим данные пользователя из initData
    const urlParams = new URLSearchParams(initData);
    const userParam = urlParams.get('user');
    
    if (!userParam) {
        return res.status(400).json({
            success: false,
            error: 'Данные пользователя не найдены'
        });
    }
    
    try {
        const user = JSON.parse(userParam);
        
        console.log('Web App пользователь авторизован:', user);
        
        res.json({
            success: true,
            user: user
        });
    } catch (error) {
        console.error('Ошибка парсинга данных пользователя:', error);
        res.status(400).json({
            success: false,
            error: 'Ошибка обработки данных пользователя'
        });
    }
});

// API для получения информации о пользователе
app.get('/api/user/:userId', (req, res) => {
    const userId = req.params.userId;
    
    // Здесь должна быть логика получения пользователя из базы данных
    // Для демонстрации возвращаем заглушку
    res.json({
        success: true,
        user: {
            id: userId,
            first_name: 'Demo',
            last_name: 'User',
            username: 'demouser',
            language_code: 'ru',
            is_premium: false,
            registration_date: new Date().toISOString(),
            last_activity: new Date().toISOString()
        }
    });
});

// API для сохранения данных пользователя
app.post('/api/user/:userId/data', (req, res) => {
    const userId = req.params.userId;
    const userData = req.body;
    
    // Здесь должна быть логика сохранения данных в базе данных
    console.log(`Сохранение данных для пользователя ${userId}:`, userData);
    
    res.json({
        success: true,
        message: 'Данные сохранены успешно'
    });
});

// API для получения статистики пользователя
app.get('/api/user/:userId/stats', (req, res) => {
    const userId = req.params.userId;
    
    // Заглушка для статистики
    res.json({
        success: true,
        stats: {
            total_sessions: Math.floor(Math.random() * 100) + 1,
            total_time: Math.floor(Math.random() * 10000) + 100,
            last_login: new Date().toISOString(),
            features_used: ['Профиль', 'Настройки'],
            premium_features_available: 5
        }
    });
});

// Webhook для получения обновлений от Telegram бота
app.post('/webhook/telegram', (req, res) => {
    const update = req.body;
    
    console.log('Получено обновление от Telegram:', update);
    
    // Здесь можно обрабатывать команды бота, сообщения и т.д.
    if (update.message) {
        const message = update.message;
        const chatId = message.chat.id;
        const text = message.text;
        
        // Пример обработки команды /start
        if (text === '/start') {
            // Отправляем приветственное сообщение с кнопкой Web App
            // (требует настройки бота через BotFather)
            console.log(`Пользователь ${chatId} запустил бота`);
        }
    }
    
    res.status(200).send('OK');
});

// Обработка ошибок
app.use((err, req, res, next) => {
    console.error('Ошибка сервера:', err);
    res.status(500).json({
        success: false,
        error: 'Внутренняя ошибка сервера'
    });
});

// 404 обработчик
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: 'Страница не найдена'
    });
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`🚀 Сервер запущен на порту ${PORT}`);
    console.log(`📱 Откройте http://localhost:${PORT} в браузере`);
    console.log(`🤖 Не забудьте настроить BOT_TOKEN в файле .env`);
});

module.exports = app;
