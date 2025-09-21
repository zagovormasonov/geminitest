# 🔧 Исправление ошибки Health Check на Railway

## ❌ Проблема
```
Attempt #1 failed with service unavailable. Continuing to retry for 1m35s
...
1/1 replicas never became healthy!
Healthcheck failed!
```

## ✅ Решение

### 1. Улучшена обработка ошибок в сервере
- **Проверка API ключа** при запуске
- **Graceful загрузка** Gemini Service
- **Подробные логи** для диагностики
- **Обработка ошибок** статических файлов

### 2. Обновлен Health Check
Теперь `/api/health` возвращает подробную информацию:
```json
{
  "status": "OK",
  "message": "Gemini Psychology API is running",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "apiKeyConfigured": true,
  "geminiServiceLoaded": true
}
```

### 3. Добавлен тестовый сервер
Создан `test-server.js` для диагностики проблем.

## 🚀 Развертывание

### 1. Загрузка в GitHub
```bash
git add .
git commit -m "Fix health check and server startup issues"
git push origin main
```

### 2. Настройка Railway
1. **Убедитесь, что добавлен `GEMINI_API_KEY`** в переменные окружения
2. **Перезапустите деплой** в Railway
3. **Проверьте логи** в Railway Dashboard

### 3. Диагностика
Если проблемы продолжаются, используйте тестовый сервер:

#### Временное решение:
1. В Railway измените `startCommand` на: `cd backend && npm run test`
2. Это запустит простой тестовый сервер
3. Проверьте, работает ли health check
4. Если работает, верните обратно: `cd backend && npm start`

## 🔍 Проверка работы

### 1. Локальная проверка
```bash
# Запуск основного сервера
cd backend && npm start

# Или тестового сервера
cd backend && npm run test
```

### 2. Проверка Health Check
```bash
curl http://localhost:3000/api/health
```

Ожидаемый ответ:
```json
{
  "status": "OK",
  "message": "Gemini Psychology API is running",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "apiKeyConfigured": true,
  "geminiServiceLoaded": true
}
```

### 3. Проверка в Railway
1. Откройте Railway Dashboard
2. Перейдите в раздел "Deployments"
3. Посмотрите логи запуска
4. Проверьте переменные окружения

## 🚨 Устранение проблем

### Проблема: "Service unavailable"
**Возможные причины:**
1. **API ключ не настроен** - проверьте `GEMINI_API_KEY`
2. **Ошибка в коде** - проверьте логи
3. **Порт не открыт** - Railway должен автоматически назначить порт

**Решение:**
1. Проверьте переменные окружения в Railway
2. Посмотрите логи запуска
3. Убедитесь, что сервер запускается

### Проблема: "Gemini Service не загружен"
**Причина:** API ключ не настроен или неправильный

**Решение:**
1. Получите новый API ключ на [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Добавьте его в Railway как `GEMINI_API_KEY`
3. Перезапустите деплой

### Проблема: "Фронтенд не найден"
**Причина:** Фронтенд не собран

**Решение:**
1. Убедитесь, что выполняется `npm run build`
2. Проверьте, что папка `dist/` существует
3. Проверьте логи сборки

## 📊 Ожидаемые логи

### Успешный запуск:
```
✅ GEMINI_API_KEY найден
✅ Gemini Service загружен успешно
🚀 Сервер запущен на порту 3000
🌐 API доступно по адресу: http://localhost:3000/api
📱 Фронтенд доступен по адресу: http://localhost:3000
```

### При ошибке API ключа:
```
❌ GEMINI_API_KEY не найден в переменных окружения
❌ Ошибка при загрузке Gemini Service: GEMINI_API_KEY не найден
🚀 Сервер запущен на порту 3000
```

## 🎯 Проверочный список

- [ ] `GEMINI_API_KEY` добавлен в Railway
- [ ] Все файлы загружены в GitHub
- [ ] Railway проект перезапущен
- [ ] Логи проверены
- [ ] Health check работает
- [ ] API отвечает

## 🔄 Альтернативное решение

Если проблемы продолжаются:

1. **Используйте тестовый сервер** временно
2. **Проверьте переменные окружения** в Railway
3. **Создайте новый проект Railway** с нуля
4. **Проверьте API ключ** - получите новый

После выполнения этих шагов ваше приложение должно успешно запуститься на Railway! 🎉🚂
