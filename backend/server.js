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

// Импортируем сервис Gemini
const geminiService = require('./services/geminiService');

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Gemini Psychology API is running',
    timestamp: new Date().toISOString()
  });
});

app.post('/api/advice', async (req, res) => {
  try {
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
  res.sendFile(path.join(__dirname, '../dist/index.html'));
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
