import React, { useState, useCallback, useEffect } from "react";
import { ResearchForm } from "./components/ResearchForm";
import { ResearchDisplay } from "./components/ResearchDisplay";
import { HistoryList } from "./components/HistoryList";
import { ThemeToggle } from "./components/ThemeToggle";
import {
  generateResearchText,
  extendResearchText,
} from "./services/geminiService";
import { ResearchRequest, SavedResearch } from "./types";
import { Button } from "./components/Button";

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [researchContent, setResearchContent] = useState<string | null>(null);
  const [lastRequest, setLastRequest] = useState<ResearchRequest | null>(null);
  const [history, setHistory] = useState<SavedResearch[]>([]);

  // API Key Settings State
  const [apiKey, setApiKey] = useState<string>("");
  const [showSettings, setShowSettings] = useState(false);

  // Load configuration on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem("research_history");
    if (savedHistory) setHistory(JSON.parse(savedHistory));

    const savedKey = localStorage.getItem("gemini_api_key");
    if (savedKey) setApiKey(savedKey);
  }, []);

  const saveApiKey = (key: string) => {
    setApiKey(key);
    localStorage.setItem("gemini_api_key", key);
    setShowSettings(false);
  };

  const saveToHistory = useCallback((item: SavedResearch) => {
    setHistory((prev) => {
      const newHistory = [item, ...prev].slice(0, 20);
      localStorage.setItem("research_history", JSON.stringify(newHistory));
      return newHistory;
    });
  }, []);

  const handleGenerate = useCallback(
    async (data: ResearchRequest) => {
      if (!apiKey) {
        setShowSettings(true);
        setError("يرجى إدخال مفتاح API أولاً لاستخدام التطبيق.");
        return;
      }

      setIsLoading(true);
      setError(null);
      setLastRequest(data);

      try {
        const result = await generateResearchText(data, apiKey);
        setResearchContent(result);

        const newSavedItem: SavedResearch = {
          ...data,
          id: Date.now().toString(),
          content: result,
          timestamp: new Date().toISOString(),
        };
        saveToHistory(newSavedItem);
      } catch (err: any) {
        setError(err.message || "حدث خطأ أثناء الاتصال بالخدمة");
      } finally {
        setIsLoading(false);
      }
    },
    [apiKey, saveToHistory],
  );

  const handleExtend = useCallback(async () => {
    if (!researchContent || !lastRequest || !apiKey) return;

    setIsLoading(true);
    setError(null);

    try {
      const result = await extendResearchText(
        researchContent,
        lastRequest,
        apiKey,
      );
      setResearchContent(result);

      const newSavedItem: SavedResearch = {
        ...lastRequest,
        id: Date.now().toString(),
        content: result,
        timestamp: new Date().toISOString(),
      };
      saveToHistory(newSavedItem);
    } catch (err: any) {
      setError(err.message || "حدث خطأ أثناء توسيع البحث");
    } finally {
      setIsLoading(false);
    }
  }, [researchContent, lastRequest, apiKey, saveToHistory]);

  const handleRegenerate = () => {
    if (lastRequest) handleGenerate(lastRequest);
  };

  const handleClear = () => {
    setResearchContent(null);
    setLastRequest(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col items-center py-10 px-4 relative transition-colors">
      {/* Settings Button - Top Right */}
      <div className="absolute top-6 right-6 no-print flex gap-2">
        <ThemeToggle />
        <button
          onClick={() => setShowSettings(true)}
          className="p-3 bg-white dark:bg-slate-800 shadow-md rounded-full text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors border border-slate-100 dark:border-slate-700"
          title="إعدادات API"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        </button>
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 no-print">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200">
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4">
              إعدادات مفتاح API
            </h3>
            <p className="text-slate-600 dark:text-slate-300 text-sm mb-4">
              أدخل مفتاح Google Gemini API الخاص بك. يتم تخزينه محلياً في متصفحك
              فقط.
            </p>
            <input
              type="password"
              placeholder="AIzaSy..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg mb-4 outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100"
            />
            <div className="flex gap-2">
              <Button onClick={() => saveApiKey(apiKey)} className="flex-1">
                حفظ
              </Button>
              <Button variant="outline" onClick={() => setShowSettings(false)}>
                إلغاء
              </Button>
            </div>
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              className="block text-center mt-4 text-xs text-indigo-600 hover:underline"
            >
              الحصول على مفتاح مجاني من هنا
            </a>
          </div>
        </div>
      )}

      <header className="w-full max-w-4xl text-center mb-10 no-print">
        <div className="inline-flex items-center justify-center p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-2xl mb-4">
          <svg
            className="w-10 h-10 text-indigo-600 dark:text-indigo-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            />
          </svg>
        </div>
        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-slate-100 mb-2">
          مولد الأبحاث التربوية المتقدم
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400">
          أداة تعليمية ذكية لمساعدة الطلاب على إعداد أبحاث مدرسية متميزة.
        </p>
      </header>

      <main className="w-full max-w-4xl space-y-12">
        {!researchContent && (
          <ResearchForm onSubmit={handleGenerate} isLoading={isLoading} />
        )}

        {error && (
          <div className="bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 p-4 rounded-xl flex items-center justify-between gap-3 no-print">
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <p>{error}</p>
            </div>
            {!apiKey && (
              <button
                onClick={() => setShowSettings(true)}
                className="text-indigo-600 font-bold underline"
              >
                افتح الإعدادات
              </button>
            )}
          </div>
        )}

        {researchContent && (
          <ResearchDisplay
            content={researchContent}
            topic={lastRequest?.topic || ""}
            onClear={handleClear}
            onRegenerate={handleRegenerate}
            onExtend={handleExtend}
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
              const newHistory = history.filter((i) => i.id !== id);
              setHistory(newHistory);
              localStorage.setItem(
                "research_history",
                JSON.stringify(newHistory),
              );
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
