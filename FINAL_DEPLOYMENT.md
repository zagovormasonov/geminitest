# 🚂 Финальная инструкция по развертыванию на Railway

## ✅ Проблема решена!

Ошибка `npm ci` была исправлена обновлением `package-lock.json`. Теперь проект готов к развертыванию.

## 🚀 Пошаговое развертывание

### 1. Загрузка в GitHub
```bash
git add .
git commit -m "Fix Railway deployment - sync package-lock.json"
git push origin main
```

### 2. Создание проекта на Railway
1. Зайдите на [railway.app](https://railway.app)
2. Нажмите "New Project"
3. Выберите "Deploy from GitHub repo"
4. Подключите ваш репозиторий

### 3. Настройка переменных окружения
В Railway Dashboard → Settings → Variables добавьте:

| Переменная | Значение | Описание |
|------------|----------|----------|
| `GEMINI_API_KEY` | ваш_api_ключ | API ключ от Google Gemini |
| `NODE_ENV` | `production` | Режим продакшена |

### 4. Обновление URL в коде
После получения Railway URL, обновите файл `src/services/geminiService.ts`:

```typescript
this.baseUrl = import.meta.env.PROD 
  ? 'https://your-actual-railway-url.railway.app'  // ← Замените на реальный URL
  : 'http://localhost:3000';
```

### 5. Перезапуск деплоя
1. В Railway Dashboard нажмите "Redeploy"
2. Дождитесь завершения сборки
3. Проверьте логи

## 🔧 Конфигурация Railway

Проект использует файл `nixpacks.toml` для точной настройки сборки:

```toml
[phases.setup]
nixPkgs = ["nodejs", "npm"]

[phases.install]
cmds = [
  "npm ci",
  "cd backend && npm ci"
]

[phases.build]
cmds = [
  "npm run build"
]

[start]
cmd = "cd backend && npm start"
```

## 📊 Проверка работы

### 1. Health Check
Откройте: `https://your-app.railway.app/api/health`
Ожидаемый ответ:
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

## 🛡️ Безопасность

- ✅ **API ключ скрыт** на сервере
- ✅ **CORS настроен** для фронтенда
- ✅ **Обработка ошибок** на всех уровнях
- ✅ **Логирование** всех запросов

## 📈 Мониторинг

### Логи Railway:
1. Railway Dashboard → Deployments
2. Кликните на последний деплой
3. Посмотрите логи в реальном времени

### Метрики:
- Время ответа API
- Использование памяти
- Количество запросов

## 🔄 Обновления

Для обновления приложения:
1. Внесите изменения в код
2. Загрузите в GitHub
3. Railway автоматически пересоберет проект

## 🚨 Устранение проблем

### Если деплой не запускается:
1. Проверьте логи сборки
2. Убедитесь, что `GEMINI_API_KEY` добавлен
3. Проверьте синтаксис JavaScript

### Если API не работает:
1. Проверьте переменные окружения
2. Убедитесь, что API ключ правильный
3. Проверьте логи сервера

### Если фронтенд не загружается:
1. Проверьте, что фронтенд собран
2. Убедитесь, что статические файлы раздаются
3. Проверьте CORS настройки

## 🎉 Готово!

После выполнения всех шагов ваше приложение будет работать на Railway с полной серверной архитектурой:

- 🖥️ **Фронтенд**: React + TypeScript
- ⚙️ **Бэкенд**: Node.js + Express  
- 🤖 **AI**: Google Gemini API
- 🚂 **Хостинг**: Railway.com

Приложение готово к использованию! 🎊
