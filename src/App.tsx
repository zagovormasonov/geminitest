import { useState } from 'react';
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
          <p>Получите мудрый совет от Gemini AI для улучшения вашего психологического состояния</p>
        </header>

        <main className="main">
          <div className="advice-section">
            <button 
              className="advice-button"
              onClick={handleGetAdvice}
              disabled={state.loading}
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
          <p>Powered by Google Gemini AI</p>
        </footer>
      </div>
    </div>
  );
}

export default App;