import { useState, useEffect } from 'react';
import geminiService from './services/geminiService';
import './App.css';

interface AdviceState {
  advice: string | null;
  loading: boolean;
  error: string | null;
  modelUsed?: string;
}

function App() {
  const [state, setState] = useState<AdviceState>({
    advice: null,
    loading: false,
    error: null
  });

  const [apiKeyConfigured, setApiKeyConfigured] = useState<boolean | null>(null);

  useEffect(() => {
    // Проверяем, настроен ли API ключ
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    setApiKeyConfigured(apiKey && apiKey !== 'your_gemini_api_key_here');
  }, []);

  const handleGetAdvice = async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const result = await geminiService.getPsychologicalAdvice();
      setState(prev => ({ 
        ...prev, 
        advice: result.advice, 
        modelUsed: result.modelUsed,
        loading: false 
      }));
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Произошла неизвестная ошибка',
        loading: false 
      }));
    }
  };

  return (
    <div className="app">
      <div className="container">
        <header className="header">
          <h1>🧠 Психологический Совет</h1>
          <p>Получите мудрый совет от Gemini 2.5 Pro для улучшения вашего психологического состояния</p>
        </header>

        <main className="main">
          <div className="advice-section">
            {apiKeyConfigured === false && (
              <div className="setup-instructions">
                <h2>🔧 Настройка API ключа</h2>
                <div className="instructions-content">
                  <p>Для работы приложения необходимо настроить API ключ от Google Gemini:</p>
                  <ol>
                    <li>Получите API ключ на <a href="https://makersuite.google.com/app/apikey" target="_blank" rel="noopener noreferrer">Google AI Studio</a></li>
                    <li>В настройках Vercel добавьте переменную окружения:</li>
                    <ul>
                      <li><strong>Имя:</strong> VITE_GEMINI_API_KEY</li>
                      <li><strong>Значение:</strong> ваш_api_ключ</li>
                    </ul>
                    <li>Перезапустите деплой в Vercel</li>
                  </ol>
                </div>
              </div>
            )}

            <button 
              className="advice-button"
              onClick={handleGetAdvice}
              disabled={state.loading || apiKeyConfigured === false}
            >
              {state.loading ? 'Получаю совет...' : 'Получить психологический совет'}
            </button>

            {state.error && (
              <div className="error-message">
                <p>❌ {state.error}</p>
              </div>
            )}

            {state.advice && (
              <div className="advice-result">
                <h2>💡 Ваш психологический совет:</h2>
                <div className="advice-text">
                  {state.advice}
                </div>
                {state.modelUsed && (
                  <div className="model-info">
                    <small>🤖 Сгенерировано моделью: {state.modelUsed}</small>
                  </div>
                )}
              </div>
            )}
          </div>
        </main>

        <footer className="footer">
          <p>Powered by Google Gemini 2.5 Pro AI</p>
        </footer>
      </div>
    </div>
  );
}

export default App;