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

  async getPsychologicalAdvice(): Promise<string> {
    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      
      if (!apiKey || apiKey === 'your_gemini_api_key_here') {
        throw new Error('API ключ не настроен. Пожалуйста, добавьте VITE_GEMINI_API_KEY в настройки Vercel.');
      }

      if (!this.genAI) {
        this.genAI = new GoogleGenerativeAI(apiKey);
      }

      const model = this.genAI!.getGenerativeModel({ model: 'gemini-pro' });
      
      const prompt = "Напиши психологический совет";
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      return text;
    } catch (error) {
      console.error('Gemini API Error:', error);
      
      if (error instanceof Error && error.message.includes('API ключ')) {
        throw error;
      }
      
      throw new Error('Ошибка при получении ответа от Gemini API. Проверьте подключение к интернету и настройки API.');
    }
  }
}

export default new GeminiService();
