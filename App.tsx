
import React, { useState, useCallback, useEffect } from 'react';
import { ResearchForm } from './components/ResearchForm';
import { ResearchDisplay } from './components/ResearchDisplay';
import { HistoryList } from './components/HistoryList';
import { generateResearchText } from './services/geminiService';
import { ResearchRequest, SavedResearch } from './types';

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [researchContent, setResearchContent] = useState<string | null>(null);
  const [lastRequest, setLastRequest] = useState<ResearchRequest | null>(null);
  const [history, setHistory] = useState<SavedResearch[]>([]);

  // Load history on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('research_history');
    if (savedHistory) setHistory(JSON.parse(savedHistory));
  }, []);

  const saveToHistory = useCallback((item: SavedResearch) => {
    setHistory(prev => {
      const newHistory = [item, ...prev].slice(0, 20);
      localStorage.setItem('research_history', JSON.stringify(newHistory));
      return newHistory;
    });
  }, []);

  const handleGenerate = useCallback(async (data: ResearchRequest) => {
    setIsLoading(true);
    setError(null);
    setLastRequest(data);
    
    try {
      // نمرر البيانات مباشرة دون الحاجة لمفتاح يدوي من المستخدم
      const result = await generateResearchText(data);
      setResearchContent(result);
      
      const newSavedItem: SavedResearch = {
        ...data,
        id: Date.now().toString(),
        content: result,
        timestamp: new Date().toISOString()
      };
      saveToHistory(newSavedItem);
    } catch (err: any) {
      setError(err.message || 'حدث خطأ أثناء الاتصال بالخدمة');
    } finally {
      setIsLoading(false);
    }
  }, [saveToHistory]);

  const handleRegenerate = () => {
    if (lastRequest) handleGenerate(lastRequest);
  };

  const handleClear = () => {
    setResearchContent(null);
    setLastRequest(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center py-10 px-4 relative">
      <header className="w-full max-w-4xl text-center mb-10 no-print">
        <div className="inline-flex items-center justify-center p-3 bg-indigo-100 rounded-2xl mb-4">
          <svg className="w-10 h-10 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>
        <h1 className="text-4xl font-extrabold text-slate-900 mb-2">مولد الأبحاث التربوية المتقدم</h1>
        <p className="text-lg text-slate-600">أداة تعليمية ذكية لمساعدة الطلاب على إعداد أبحاث مدرسية متميزة.</p>
      </header>

      <main className="w-full max-w-4xl space-y-12">
        {!researchContent && (
          <ResearchForm onSubmit={handleGenerate} isLoading={isLoading} />
        )}

        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 p-4 rounded-xl flex items-center gap-3 no-print">
            <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <p>{error}</p>
          </div>
        )}

        {researchContent && (
          <ResearchDisplay 
            content={researchContent} 
            topic={lastRequest?.topic || ''} 
            onClear={handleClear} 
            onRegenerate={handleRegenerate}
            isLoading={isLoading}
          />
        )}

        {!researchContent && (
          <HistoryList 
            history={history} 
            onSelect={(item) => {
              setResearchContent(item.content);
              setLastRequest(item);
            }} 
            onDelete={(id) => {
              const newHistory = history.filter(i => i.id !== id);
              setHistory(newHistory);
              localStorage.setItem('research_history', JSON.stringify(newHistory));
            }}
          />
        )}
      </main>

      <footer className="mt-auto pt-10 pb-6 text-slate-400 text-sm no-print">
        <p>© {new Date().getFullYear()} مولد الأبحاث التربوية المتقدم</p>
      </footer>
    </div>
  );
};

export default App;
