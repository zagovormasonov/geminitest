const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../dist')));

// Проверяем наличие API ключа при запуске
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error('❌ GEMINI_API_KEY не найден в переменных окружения');
  console.error('Пожалуйста, добавьте GEMINI_API_KEY в настройки Railway');
} else {
  console.log('✅ GEMINI_API_KEY найден');
}

// Импортируем сервис Gemini (с обработкой ошибок)
let geminiService = null;
try {
  geminiService = require('./services/geminiService');
  console.log('✅ Gemini Service загружен успешно');
} catch (error) {
  console.error('❌ Ошибка при загрузке Gemini Service:', error.message);
}

// API Routes
app.get('/api/health', (req, res) => {
  const status = {
    status: 'OK', 
    message: 'Gemini Psychology API is running',
    timestamp: new Date().toISOString(),
    apiKeyConfigured: !!apiKey,
    geminiServiceLoaded: !!geminiService
  };
  
  console.log('🏥 Health check:', status);
  res.json(status);
});

app.post('/api/advice', async (req, res) => {
  try {
    if (!geminiService) {
      throw new Error('Gemini Service не загружен. Проверьте настройки API ключа.');
    }
    
    console.log('📝 Получен запрос на психологический совет');
    
    const result = await geminiService.getPsychologicalAdvice();
    
    console.log(`✅ Совет успешно сгенерирован моделью: ${result.modelUsed}`);
    
    res.json({
      success: true,
      advice: result.advice,
      modelUsed: result.modelUsed,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Ошибка при генерации совета:', error);
    
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Serve React app for all other routes
app.get('*', (req, res) => {
  const indexPath = path.join(__dirname, '../dist/index.html');
  console.log('📁 Serving static file:', indexPath);
  res.sendFile(indexPath, (err) => {
    if (err) {
      console.error('❌ Ошибка при раздаче статических файлов:', err);
      res.status(404).json({
        error: 'Фронтенд не найден. Проверьте сборку проекта.',
        path: indexPath
      });
    }
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('🚨 Серверная ошибка:', error);
  res.status(500).json({
    success: false,
    error: 'Внутренняя ошибка сервера',
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Сервер запущен на порту ${PORT}`);
  console.log(`🌐 API доступно по адресу: http://localhost:${PORT}/api`);
  console.log(`📱 Фронтенд доступен по адресу: http://localhost:${PORT}`);
});
