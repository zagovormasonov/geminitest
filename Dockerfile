# Railway конфигурация для Node.js приложения
FROM node:18-alpine

# Установка рабочей директории
WORKDIR /app

# Копирование package.json и package-lock.json
COPY package*.json ./
COPY backend/package*.json ./backend/

# Установка зависимостей
RUN npm ci --only=production

# Установка зависимостей бэкенда
RUN cd backend && npm ci --only=production

# Копирование исходного кода
COPY . .

# Сборка фронтенда
RUN npm run build

# Открытие порта
EXPOSE 3000

# Переменные окружения
ENV NODE_ENV=production
ENV PORT=3000

# Команда запуска
CMD ["cd", "backend", "&&", "npm", "start"]
