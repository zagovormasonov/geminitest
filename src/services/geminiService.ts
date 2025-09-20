import { GoogleGenerativeAI } from '@google/generative-ai';

class GeminiService {
  private genAI: GoogleGenerativeAI | null = null;

  constructor() {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey || apiKey === 'your_gemini_api_key_here') {
      console.error('Gemini API Error: API ключ не настроен');
      // Не выбрасываем ошибку в конструкторе, чтобы приложение не падало
    } else {
      this.genAI = new GoogleGenerativeAI(apiKey);
    }
  }

  async getPsychologicalAdvice(): Promise<{ advice: string; modelUsed: string }> {
    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      
      if (!apiKey || apiKey === 'your_gemini_api_key_here') {
        throw new Error('API ключ не настроен. Пожалуйста, добавьте VITE_GEMINI_API_KEY в настройки Vercel.');
      }

      if (!this.genAI) {
        this.genAI = new GoogleGenerativeAI(apiKey);
      }

      // Пробуем разные модели в порядке приоритета (от самых новых к старым)
      const models = [
        'gemini-2.5-pro',        // Самая мощная модель Gemini 2.5 Pro
        'gemini-2.0-flash-exp',  // Экспериментальная версия Gemini 2.0
        'gemini-2.0-flash',      // Стабильная версия Gemini 2.0
        'gemini-1.5-pro',        // Мощная модель 1.5
        'gemini-1.5-flash',      // Быстрая модель 1.5
        'gemini-pro'             // Старая версия для совместимости
      ];
      let lastError: Error | null = null;

      for (const modelName of models) {
        try {
          console.log(`Пробуем модель: ${modelName}`);
          const model = this.genAI!.getGenerativeModel({ model: modelName });
          
          const prompt = "Напиши психологический совет";
          
          const result = await model.generateContent(prompt);
          const response = await result.response;
          const text = response.text();
          
          console.log(`✅ Успешно использована модель: ${modelName}`);
          return { advice: text, modelUsed: modelName };
        } catch (modelError) {
          console.warn(`Модель ${modelName} недоступна:`, modelError);
          lastError = modelError as Error;
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
      
      throw new Error('Ошибка при получении ответа от Gemini API. Проверьте подключение к интернету и настройки API.');
    }
  }
}

export default new GeminiService();
