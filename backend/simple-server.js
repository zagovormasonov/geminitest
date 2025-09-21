const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Простой health check
app.get('/api/health', (req, res) => {
  console.log('🏥 Health check - OK');
  res.json({ 
    status: 'OK', 
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    port: PORT,
    nodeEnv: process.env.NODE_ENV || 'development'
  });
});

// Простой тест
app.get('/api/test', (req, res) => {
  console.log('🧪 Test endpoint called');
  res.json({
    message: 'Test endpoint works!',
    timestamp: new Date().toISOString()
  });
});

// Простой совет (без Gemini API)
app.post('/api/advice', (req, res) => {
  console.log('📝 Advice request received');
  res.json({
    success: true,
    advice: "Это тестовый совет. Сервер работает, но Gemini API не настроен.",
    modelUsed: "test-server",
    timestamp: new Date().toISOString()
  });
});

// Обработка всех остальных маршрутов
app.get('*', (req, res) => {
  console.log('📁 Serving fallback for:', req.path);
  res.json({
    message: 'Server is running',
    path: req.path,
    timestamp: new Date().toISOString(),
    endpoints: ['/api/health', '/api/test', '/api/advice']
  });
});

// Запуск сервера
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Simple server запущен на порту ${PORT}`);
  console.log(`🌐 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🧪 Test endpoint: http://localhost:${PORT}/api/test`);
  console.log(`📝 Advice endpoint: http://localhost:${PORT}/api/advice`);
  console.log(`🔧 Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Обработка ошибок
process.on('uncaughtException', (error) => {
  console.error('🚨 Uncaught Exception:', error);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('🚨 Unhandled Rejection at:', promise, 'reason:', reason);
});
