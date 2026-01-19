
import React, { useState } from 'react';
import { EducationalLevel, ResearchLength, ResearchLanguage, ResearchRequest } from '../types';
import { Button } from './Button';

interface ResearchFormProps {
  onSubmit: (data: ResearchRequest) => void;
  isLoading: boolean;
}

export const ResearchForm: React.FC<ResearchFormProps> = ({ onSubmit, isLoading }) => {
  const [topic, setTopic] = useState('');
  const [level, setLevel] = useState<EducationalLevel>(EducationalLevel.PRIMARY);
  const [length, setLength] = useState<ResearchLength>(ResearchLength.SHORT);
  const [language, setLanguage] = useState<ResearchLanguage>(ResearchLanguage.ARABIC);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;
    onSubmit({ topic, level, length, language });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-md border border-slate-100 space-y-6 no-print">
      <div className="space-y-2">
        <label className="block text-sm font-bold text-slate-700">موضوع البحث</label>
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="مثال: أهمية الماء، تلوث البيئة، الفضاء..."
          className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-lg"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <label className="block text-sm font-bold text-slate-700">لغة البحث</label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as ResearchLanguage)}
            className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none appearance-none bg-white cursor-pointer"
          >
            {Object.values(ResearchLanguage).map((lang) => (
              <option key={lang} value={lang}>{lang}</option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-bold text-slate-700">المستوى التعليمي</label>
          <select
            value={level}
            onChange={(e) => setLevel(e.target.value as EducationalLevel)}
            className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none appearance-none bg-white cursor-pointer"
          >
            {Object.values(EducationalLevel).map((lvl) => (
              <option key={lvl} value={lvl}>{lvl}</option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-bold text-slate-700">طول البحث</label>
          <select
            value={length}
            onChange={(e) => setLength(e.target.value as ResearchLength)}
            className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none appearance-none bg-white cursor-pointer"
          >
            {Object.values(ResearchLength).map((len) => (
              <option key={len} value={len}>{len}</option>
            ))}
          </select>
        </div>
      </div>

      <Button 
        type="submit" 
        isLoading={isLoading} 
        className="w-full text-lg py-4"
        variant="primary"
      >
        إنشاء البحث الآن
      </Button>
    </form>
  );
};
