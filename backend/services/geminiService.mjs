import { GoogleGenerativeAI } from '@google/generative-ai';

class GeminiService {
  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error('❌ GEMINI_API_KEY не найден в переменных окружения');
      throw new Error('GEMINI_API_KEY не найден в переменных окружения');
    }
    this.genAI = new GoogleGenerativeAI(apiKey);
    console.log('🤖 Gemini Service инициализирован');
  }

  async getPsychologicalAdvice() {
    try {
      console.log('🧠 Начинаем генерацию психологического совета...');
      
      // Пробуем разные модели в порядке приоритета (от самых доступных к новым)
      const models = [
        'gemini-1.5-flash',      // Самая доступная и быстрая модель
        'gemini-1.5-pro',        // Мощная модель 1.5 (широко доступна)
        'gemini-2.0-flash',      // Стабильная версия Gemini 2.0
        'gemini-2.0-flash-exp',  // Экспериментальная версия Gemini 2.0
        'gemini-2.5-pro',        // Самая мощная модель Gemini 2.5 Pro (ограниченная доступность)
        'gemini-pro'             // Старая версия для совместимости
      ];
      let lastError = null;

      for (const modelName of models) {
        try {
          console.log(`Пробуем модель: ${modelName}`);
          const model = this.genAI.getGenerativeModel({ model: modelName });
          
          const prompt = "Напиши психологический совет";
          
          const result = await model.generateContent(prompt);
          const response = await result.response;
          const text = response.text();
          
          console.log(`✅ Успешно использована модель: ${modelName}`);
          return { advice: text, modelUsed: modelName };
        } catch (modelError) {
          console.warn(`⚠️ Модель ${modelName} недоступна:`, modelError);
          
          // Проверяем, является ли это ошибкой регионального ограничения
          if (modelError instanceof Error && modelError.message.includes('User location is not supported')) {
            console.warn(`🌍 Модель ${modelName} недоступна в вашем регионе`);
          }
          
          lastError = modelError;
          continue;
        }
      }

      // Если все модели не работают, выбрасываем последнюю ошибку
      throw lastError || new Error('Все модели Gemini недоступны');
      
    } catch (error) {
      console.error('Gemini API Error:', error);
      
      if (error instanceof Error && error.message.includes('API ключ')) {
        throw error;
      }
      
      if (error instanceof Error && error.message.includes('модели')) {
        throw new Error('Все модели Gemini API недоступны. Попробуйте позже или обратитесь в поддержку Google.');
      }
      
      if (error instanceof Error && error.message.includes('User location is not supported')) {
        throw new Error('Некоторые модели Gemini недоступны в вашем регионе. Используется доступная модель.');
      }
      
      throw new Error('Ошибка при получении ответа от Gemini API. Проверьте подключение к интернету и настройки API.');
    }
  }
}

export default new GeminiService();
