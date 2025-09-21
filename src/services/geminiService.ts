// Сервис для работы с Gemini API через бэкенд
class GeminiService {
  private baseUrl: string;

  constructor() {
    // В продакшене используем Railway URL, в разработке - localhost
    this.baseUrl = import.meta.env.PROD 
      ? 'https://geminitest-production-3230.up.railway.app' 
      : 'http://localhost:3000';
  }

  async getPsychologicalAdvice(): Promise<{ advice: string; modelUsed: string }> {
    try {
      console.log('📡 Отправляем запрос на сервер...');
      
      const response = await fetch(`${this.baseUrl}/api/advice`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Неизвестная ошибка сервера');
      }

      console.log(`✅ Получен совет от модели: ${data.modelUsed}`);
      return {
        advice: data.advice,
        modelUsed: data.modelUsed
      };
      
    } catch (error) {
      console.error('❌ Ошибка при запросе к серверу:', error);
      
      if (error instanceof Error) {
        if (error.message.includes('Failed to fetch')) {
          throw new Error('Не удается подключиться к серверу. Проверьте подключение к интернету.');
        }
        throw error;
      }
      
      throw new Error('Произошла неизвестная ошибка при получении совета.');
    }
  }
}

export default new GeminiService();
