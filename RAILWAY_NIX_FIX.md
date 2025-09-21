# 🔧 Исправление ошибки Nix на Railway

## ❌ Проблема
```
error: undefined variable 'npm'
at /app/.nixpacks/nixpkgs-ffeebf0acf3ae8b29f8c7049cd911b9636efd7e7.nix:19:16:
nodejs npm
|                ^
```

## ✅ Решение

### 1. Удален nixpacks.toml
Проблема была в том, что `npm` указан как отдельный пакет, но в Nix он входит в состав `nodejs`.

### 2. Упрощена конфигурация Railway
Теперь используется только `railway.json` без дополнительных конфигураций:

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "cd backend && npm start",
    "healthcheckPath": "/api/health"
  }
}
```

### 3. Добавлены дополнительные файлы
- **`Procfile`** - альтернативный способ запуска
- **`.railwayignore`** - исключение ненужных файлов

## 🚀 Развертывание

### 1. Загрузка в GitHub
```bash
git add .
git commit -m "Fix Nix npm error for Railway"
git push origin main
```

### 2. Создание проекта Railway
1. **Удалите старый проект Railway** (если есть)
2. **Создайте новый проект** на [railway.app](https://railway.app)
3. **Подключите GitHub репозиторий**
4. **Railway автоматически определит Node.js проект**

### 3. Переменные окружения
Добавьте в Railway:
- `GEMINI_API_KEY` - ваш API ключ от Google Gemini
- `NODE_ENV=production`

### 4. Обновление URL
После получения Railway URL, обновите `src/services/geminiService.ts`:
```typescript
this.baseUrl = import.meta.env.PROD 
  ? 'https://your-railway-url.railway.app'
  : 'http://localhost:3000';
```

## 🔍 Как работает сборка

Railway автоматически выполнит:
1. **Определение проекта** - Node.js приложение
2. **Установка зависимостей** - `npm install` в корне и в backend
3. **Сборка фронтенда** - `npm run build`
4. **Запуск сервера** - `cd backend && npm start`

## 📊 Структура проекта

```
gemini-psychology-app/
├── backend/                 # Серверная часть
│   ├── package.json        # Зависимости бэкенда
│   ├── server.js           # Express сервер
│   └── services/
│       └── geminiService.js
├── src/                    # Фронтенд
├── dist/                   # Собранный фронтенд
├── railway.json           # Конфигурация Railway
├── Procfile              # Альтернативный запуск
└── .railwayignore        # Исключения
```

## 🛡️ Безопасность

- ✅ **API ключ скрыт** на сервере
- ✅ **CORS настроен** для фронтенда
- ✅ **Обработка ошибок** на всех уровнях
- ✅ **Логирование** всех запросов

## 🔍 Проверка работы

### 1. Health Check
Откройте: `https://your-app.railway.app/api/health`
```json
{
  "status": "OK",
  "message": "Gemini Psychology API is running",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### 2. Фронтенд
Откройте: `https://your-app.railway.app`
- Должен загрузиться интерфейс
- Кнопка "Получить совет" должна работать

### 3. API тест
```bash
curl -X POST https://your-app.railway.app/api/advice \
  -H "Content-Type: application/json"
```

## 🚨 Устранение проблем

### Если сборка не запускается:
1. Проверьте логи в Railway Dashboard
2. Убедитесь, что все файлы загружены
3. Проверьте переменные окружения

### Если API не работает:
1. Проверьте `GEMINI_API_KEY`
2. Убедитесь, что API ключ правильный
3. Проверьте логи сервера

### Если фронтенд не загружается:
1. Проверьте, что фронтенд собран
2. Убедитесь, что статические файлы раздаются
3. Проверьте CORS настройки

## 📈 Мониторинг

### Логи Railway:
1. Railway Dashboard → Deployments
2. Кликните на последний деплой
3. Посмотрите логи в реальном времени

### Метрики:
- Время ответа API
- Использование памяти
- Количество запросов

## 🎉 Готово!

После выполнения этих шагов ваше приложение должно успешно развернуться на Railway:

- 🖥️ **Фронтенд**: React + TypeScript
- ⚙️ **Бэкенд**: Node.js + Express  
- 🤖 **AI**: Google Gemini API
- 🚂 **Хостинг**: Railway.com

Приложение готово к использованию! 🎊
