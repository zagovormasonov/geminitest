const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

console.log('🚀 Starting server...');
console.log('📊 Environment variables:');
console.log('  PORT:', process.env.PORT);
console.log('  NODE_ENV:', process.env.NODE_ENV);
console.log('  GEMINI_API_KEY:', process.env.GEMINI_API_KEY ? 'SET' : 'NOT SET');

// Middleware
app.use(cors());
app.use(express.json());

// Простой health check
app.get('/api/health', (req, res) => {
  console.log('🏥 Health check requested');
  res.json({ 
    status: 'OK', 
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    port: PORT,
    nodeEnv: process.env.NODE_ENV || 'development',
    pid: process.pid
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

// Простой совет
app.post('/api/advice', (req, res) => {
  console.log('📝 Advice request received');
  res.json({
    success: true,
    advice: "Это тестовый совет. Сервер работает!",
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

// Обработка ошибок
process.on('uncaughtException', (error) => {
  console.error('🚨 Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('🚨 Unhandled Rejection at:', promise, 'reason:', reason);
});

// Запуск сервера
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server запущен на порту ${PORT}`);
  console.log(`🌐 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🧪 Test endpoint: http://localhost:${PORT}/api/test`);
  console.log(`📝 Advice endpoint: http://localhost:${PORT}/api/advice`);
  console.log(`🔧 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📊 Process ID: ${process.pid}`);
});

// Обработка ошибок сервера
server.on('error', (error) => {
  console.error('🚨 Server error:', error);
  if (error.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use`);
  }
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('🛑 SIGINT received, shutting down gracefully');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});
